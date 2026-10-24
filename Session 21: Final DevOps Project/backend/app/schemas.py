from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

Category = Literal["Appetizer", "Main Course", "Dessert", "Beverage", "Side"]
ReservationStatus = Literal["CONFIRMED", "SEATED", "CANCELLED", "COMPLETED"]
OrderStatus = Literal["PLACED", "PREPARING", "SERVED", "PAID", "CANCELLED"]
TableLocation = Literal["Indoor", "Patio", "Window", "Bar"]

# ----------------- MenuItem Schemas -----------------
class MenuItemBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=500)
    price: float = Field(gt=0, description="Price must be greater than zero")
    category: str = Field(min_length=1, max_length=50)
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    price: float | None = Field(default=None, gt=0)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    is_available: bool | None = None

class MenuItemOut(MenuItemBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ----------------- DiningTable Schemas -----------------
class DiningTableBase(BaseModel):
    table_number: int = Field(gt=0, description="Table number must be positive")
    capacity: int = Field(gt=0, le=30, description="Capacity must be between 1 and 30")
    location: str = Field(default="Indoor", min_length=1, max_length=50)
    is_active: bool = True

class DiningTableCreate(DiningTableBase):
    pass

class DiningTableUpdate(BaseModel):
    table_number: int | None = Field(default=None, gt=0)
    capacity: int | None = Field(default=None, gt=0, le=30)
    location: str | None = Field(default=None, min_length=1, max_length=50)
    is_active: bool | None = None

class DiningTableOut(DiningTableBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ----------------- Reservation Schemas -----------------
class ReservationBase(BaseModel):
    table_id: int
    customer_name: str = Field(min_length=1, max_length=100)
    customer_phone: str = Field(min_length=5, max_length=30)
    party_size: int = Field(gt=0, description="Party size must be at least 1")
    reservation_time: datetime
    status: ReservationStatus = "CONFIRMED"

class ReservationCreate(ReservationBase):
    pass

class ReservationUpdate(BaseModel):
    table_id: int | None = None
    customer_name: str | None = Field(default=None, min_length=1, max_length=100)
    customer_phone: str | None = Field(default=None, min_length=5, max_length=30)
    party_size: int | None = Field(default=None, gt=0)
    reservation_time: datetime | None = None
    status: ReservationStatus | None = None

class ReservationOut(ReservationBase):
    id: int
    created_at: datetime
    table: DiningTableOut | None = None
    model_config = ConfigDict(from_attributes=True)

# ----------------- Order Item & Order Schemas -----------------
class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(gt=0, default=1)

class OrderItemOut(BaseModel):
    id: int
    order_id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    item_total: float
    menu_item: MenuItemOut | None = None
    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    table_id: int | None = None
    notes: str = ""
    items: list[OrderItemCreate] = Field(min_length=1, description="Order must contain at least one item")

class OrderStatusUpdate(BaseModel):
    order_status: OrderStatus

class OrderOut(BaseModel):
    id: int
    table_id: int | None = None
    order_status: OrderStatus
    total_amount: float
    notes: str
    created_at: datetime
    table: DiningTableOut | None = None
    items: list[OrderItemOut] = []
    model_config = ConfigDict(from_attributes=True)

# ----------------- Stats Schema -----------------
class RestaurantStatsOut(BaseModel):
    total_menu_items: int
    total_tables: int
    active_reservations: int
    active_orders: int
    total_revenue: float
