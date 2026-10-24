from datetime import datetime, timedelta, timezone
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from .config import settings
from .db import Base, engine, get_db
from .models import DiningTable, MenuItem, Order, OrderItem, Reservation
from .schemas import (
    DiningTableCreate,
    DiningTableOut,
    DiningTableUpdate,
    MenuItemCreate,
    MenuItemOut,
    MenuItemUpdate,
    OrderCreate,
    OrderOut,
    OrderStatusUpdate,
    ReservationCreate,
    ReservationOut,
    ReservationUpdate,
    RestaurantStatsOut,
)

app = FastAPI(title=settings.app_name, version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

VALID_ORDER_TRANSITIONS: dict[str, set[str]] = {
    "PLACED": {"PREPARING", "CANCELLED"},
    "PREPARING": {"SERVED", "CANCELLED"},
    "SERVED": {"PAID"},
    "PAID": set(),
    "CANCELLED": set(),
}

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "service": settings.app_name,
        "version": "1.0.0",
        "docs": "/docs",
        "domain": "Restaurant Management",
    }

@app.get("/health")
def health():
    return {"status": "UP"}

@app.get("/ready")
def ready(db: Session = Depends(get_db)):
    db.execute(select(func.count(DiningTable.id)))
    return {"status": "READY"}

# ----------------- Dashboard Stats -----------------
@app.get("/api/stats", response_model=RestaurantStatsOut)
def get_stats(db: Session = Depends(get_db)):
    total_menu_items = db.scalar(select(func.count(MenuItem.id))) or 0
    total_tables = db.scalar(select(func.count(DiningTable.id))) or 0
    active_reservations = db.scalar(
        select(func.count(Reservation.id)).where(Reservation.status.in_(["CONFIRMED", "SEATED"]))
    ) or 0
    active_orders = db.scalar(
        select(func.count(Order.id)).where(Order.order_status.in_(["PLACED", "PREPARING", "SERVED"]))
    ) or 0
    total_revenue = db.scalar(
        select(func.coalesce(func.sum(Order.total_amount), 0.0)).where(Order.order_status == "PAID")
    ) or 0.0

    return RestaurantStatsOut(
        total_menu_items=total_menu_items,
        total_tables=total_tables,
        active_reservations=active_reservations,
        active_orders=active_orders,
        total_revenue=round(float(total_revenue), 2),
    )

# ----------------- Menu Items CRUD -----------------
@app.get("/api/menu-items", response_model=list[MenuItemOut])
def list_menu_items(
    category: str | None = Query(default=None),
    available_only: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    stmt = select(MenuItem)
    if category:
        stmt = stmt.where(MenuItem.category == category)
    if available_only:
        stmt = stmt.where(MenuItem.is_available.is_(True))
    stmt = stmt.order_by(MenuItem.category, MenuItem.name)
    return list(db.scalars(stmt))

@app.get("/api/menu-items/{item_id}", response_model=MenuItemOut)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    return item

@app.post("/api/menu-items", response_model=MenuItemOut, status_code=status.HTTP_201_CREATED)
def create_menu_item(payload: MenuItemCreate, db: Session = Depends(get_db)):
    item = MenuItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.put("/api/menu-items/{item_id}", response_model=MenuItemOut)
def update_menu_item(item_id: int, payload: MenuItemUpdate, db: Session = Depends(get_db)):
    item = db.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

@app.delete("/api/menu-items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = db.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    db.delete(item)
    db.commit()

# ----------------- Dining Tables CRUD -----------------
@app.get("/api/tables", response_model=list[DiningTableOut])
def list_tables(db: Session = Depends(get_db)):
    return list(db.scalars(select(DiningTable).order_by(DiningTable.table_number)))

@app.get("/api/tables/{table_id}", response_model=DiningTableOut)
def get_table(table_id: int, db: Session = Depends(get_db)):
    table = db.get(DiningTable, table_id)
    if not table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dining table not found")
    return table

@app.post("/api/tables", response_model=DiningTableOut, status_code=status.HTTP_201_CREATED)
def create_table(payload: DiningTableCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(DiningTable).where(DiningTable.table_number == payload.table_number))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Table number {payload.table_number} already exists",
        )
    table = DiningTable(**payload.model_dump())
    db.add(table)
    db.commit()
    db.refresh(table)
    return table

@app.put("/api/tables/{table_id}", response_model=DiningTableOut)
def update_table(table_id: int, payload: DiningTableUpdate, db: Session = Depends(get_db)):
    table = db.get(DiningTable, table_id)
    if not table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dining table not found")
    update_data = payload.model_dump(exclude_unset=True)
    if "table_number" in update_data and update_data["table_number"] != table.table_number:
        existing = db.scalar(select(DiningTable).where(DiningTable.table_number == update_data["table_number"]))
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Table number {update_data['table_number']} already exists",
            )
    for key, value in update_data.items():
        setattr(table, key, value)
    db.commit()
    db.refresh(table)
    return table

@app.delete("/api/tables/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_table(table_id: int, db: Session = Depends(get_db)):
    table = db.get(DiningTable, table_id)
    if not table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dining table not found")
    db.delete(table)
    db.commit()

# ----------------- Reservations CRUD & Business Logic -----------------
def normalize_datetime(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt

def validate_reservation_business_rules(
    db: Session,
    table_id: int,
    party_size: int,
    res_time: datetime,
    exclude_id: int | None = None,
):
    table = db.get(DiningTable, table_id)
    if not table:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table does not exist")
    if not table.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Table is currently inactive")

    # Business rule 1: Reject reservations exceeding table capacity
    if party_size > table.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Party size ({party_size}) exceeds table capacity ({table.capacity})",
        )

    # Business rule 2: Prevent double-booking same table within 2-hour window
    res_time = normalize_datetime(res_time)
    start_window = res_time - timedelta(hours=2)
    end_window = res_time + timedelta(hours=2)

    stmt = select(Reservation).where(
        Reservation.table_id == table_id,
        Reservation.status.in_(["CONFIRMED", "SEATED"]),
        Reservation.reservation_time > start_window,
        Reservation.reservation_time < end_window,
    )
    if exclude_id is not None:
        stmt = stmt.where(Reservation.id != exclude_id)

    conflict = db.scalars(stmt).first()
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Table {table.table_number} is already booked for {conflict.reservation_time.isoformat()} (overlapping 2-hour window)",
        )

@app.get("/api/reservations", response_model=list[ReservationOut])
def list_reservations(db: Session = Depends(get_db)):
    stmt = (
        select(Reservation)
        .options(joinedload(Reservation.table))
        .order_by(Reservation.reservation_time.asc())
    )
    return list(db.scalars(stmt))

@app.get("/api/reservations/{reservation_id}", response_model=ReservationOut)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    stmt = select(Reservation).options(joinedload(Reservation.table)).where(Reservation.id == reservation_id)
    res = db.scalar(stmt)
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
    return res

@app.post("/api/reservations", response_model=ReservationOut, status_code=status.HTTP_201_CREATED)
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    validate_reservation_business_rules(
        db,
        table_id=payload.table_id,
        party_size=payload.party_size,
        res_time=payload.reservation_time,
    )
    reservation = Reservation(
        table_id=payload.table_id,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        party_size=payload.party_size,
        reservation_time=normalize_datetime(payload.reservation_time),
        status=payload.status,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return db.scalar(select(Reservation).options(joinedload(Reservation.table)).where(Reservation.id == reservation.id))

@app.put("/api/reservations/{reservation_id}", response_model=ReservationOut)
def update_reservation(reservation_id: int, payload: ReservationUpdate, db: Session = Depends(get_db)):
    res = db.get(Reservation, reservation_id)
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    new_table_id = payload.table_id if payload.table_id is not None else res.table_id
    new_party_size = payload.party_size if payload.party_size is not None else res.party_size
    new_time = payload.reservation_time if payload.reservation_time is not None else res.reservation_time

    if payload.table_id is not None or payload.party_size is not None or payload.reservation_time is not None:
        validate_reservation_business_rules(
            db,
            table_id=new_table_id,
            party_size=new_party_size,
            res_time=new_time,
            exclude_id=res.id,
        )

    for key, value in payload.model_dump(exclude_unset=True).items():
        if key == "reservation_time" and value is not None:
            value = normalize_datetime(value)
        setattr(res, key, value)

    db.commit()
    db.refresh(res)
    return db.scalar(select(Reservation).options(joinedload(Reservation.table)).where(Reservation.id == res.id))

@app.delete("/api/reservations/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    res = db.get(Reservation, reservation_id)
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
    db.delete(res)
    db.commit()

# ----------------- Orders CRUD & Business Logic -----------------
@app.get("/api/orders", response_model=list[OrderOut])
def list_orders(status_filter: str | None = Query(default=None), db: Session = Depends(get_db)):
    stmt = (
        select(Order)
        .options(
            joinedload(Order.table),
            selectinload(Order.items).joinedload(OrderItem.menu_item),
        )
        .order_by(Order.id.desc())
    )
    if status_filter:
        stmt = stmt.where(Order.order_status == status_filter)
    return list(db.scalars(stmt))

@app.get("/api/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    stmt = (
        select(Order)
        .options(
            joinedload(Order.table),
            selectinload(Order.items).joinedload(OrderItem.menu_item),
        )
        .where(Order.id == order_id)
    )
    order = db.scalar(stmt)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@app.post("/api/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    if payload.table_id is not None:
        table = db.get(DiningTable, payload.table_id)
        if not table:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dining table not found")

    # Business rule 3: Calculate order totals from order items
    total_amount = 0.0
    order_items_to_create: list[OrderItem] = []

    for item in payload.items:
        menu_item = db.get(MenuItem, item.menu_item_id)
        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item ID {item.menu_item_id} not found",
            )
        if not menu_item.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item '{menu_item.name}' is currently unavailable",
            )
        item_total = round(menu_item.price * item.quantity, 2)
        total_amount += item_total
        order_items_to_create.append(
            OrderItem(
                menu_item_id=menu_item.id,
                quantity=item.quantity,
                unit_price=menu_item.price,
                item_total=item_total,
            )
        )

    order = Order(
        table_id=payload.table_id,
        notes=payload.notes,
        order_status="PLACED",
        total_amount=round(total_amount, 2),
    )
    db.add(order)
    db.flush()  # Generates order.id

    for oi in order_items_to_create:
        oi.order_id = order.id
        db.add(oi)

    db.commit()
    db.refresh(order)

    return db.scalar(
        select(Order)
        .options(
            joinedload(Order.table),
            selectinload(Order.items).joinedload(OrderItem.menu_item),
        )
        .where(Order.id == order.id)
    )

@app.put("/api/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    # Business rule 4: Allow only valid order status changes (PLACED -> PREPARING -> SERVED -> PAID)
    current_status = order.order_status
    target_status = payload.order_status

    if target_status == current_status:
        return order

    allowed = VALID_ORDER_TRANSITIONS.get(current_status, set())
    if target_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid order status transition from '{current_status}' to '{target_status}'. Allowed: {sorted(list(allowed))}",
        )

    order.order_status = target_status
    db.commit()
    db.refresh(order)

    return db.scalar(
        select(Order)
        .options(
            joinedload(Order.table),
            selectinload(Order.items).joinedload(OrderItem.menu_item),
        )
        .where(Order.id == order.id)
    )

@app.delete("/api/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    db.delete(order)
    db.commit()
