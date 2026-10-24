import os
from datetime import datetime, timedelta, timezone

# Use an isolated test database
os.environ["DATABASE_URL"] = "sqlite:///./test_restaurant.db"

import pytest
from fastapi.testclient import TestClient
from app.db import Base, engine
from app.main import app

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_restaurant.db"):
        try:
            os.remove("./test_restaurant.db")
        except OSError:
            pass

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "UP"}

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["service"] == "Restaurant Management API"
    assert res.json()["domain"] == "Restaurant Management"

def test_ready():
    res = client.get("/ready")
    assert res.status_code == 200
    assert res.json() == {"status": "READY"}

def test_menu_item_crud():
    # 1. Create
    payload = {
        "name": "Truffle Tagliatelle",
        "description": "Handmade pasta with black truffle cream sauce",
        "price": 24.50,
        "category": "Main Course",
        "is_available": True,
    }
    create_res = client.post("/api/menu-items", json=payload)
    assert create_res.status_code == 201
    item = create_res.json()
    assert item["name"] == "Truffle Tagliatelle"
    assert item["price"] == 24.50
    item_id = item["id"]

    # 2. Read
    get_res = client.get(f"/api/menu-items/{item_id}")
    assert get_res.status_code == 200
    assert get_res.json()["category"] == "Main Course"

    # 3. Update
    update_res = client.put(f"/api/menu-items/{item_id}", json={"price": 26.00})
    assert update_res.status_code == 200
    assert update_res.json()["price"] == 26.00

def test_dining_table_crud_and_uniqueness():
    table_payload = {"table_number": 12, "capacity": 4, "location": "Window", "is_active": True}
    res = client.post("/api/tables", json=table_payload)
    assert res.status_code == 201
    assert res.json()["table_number"] == 12

    # Reject duplicate table number
    dup_res = client.post("/api/tables", json=table_payload)
    assert dup_res.status_code == 409

def test_reservation_capacity_exceeded():
    # Table 20 has capacity of 2
    table_res = client.post("/api/tables", json={"table_number": 20, "capacity": 2, "location": "Patio"})
    assert table_res.status_code == 201
    table_id = table_res.json()["id"]

    # Try booking for party of 5 (exceeds capacity)
    booking_payload = {
        "table_id": table_id,
        "customer_name": "Alice Johnson",
        "customer_phone": "+1-555-0199",
        "party_size": 5,
        "reservation_time": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        "status": "CONFIRMED",
    }
    res = client.post("/api/reservations", json=booking_payload)
    assert res.status_code == 400
    assert "exceeds table capacity" in res.json()["detail"]

def test_reservation_prevent_double_booking():
    # Table 30 has capacity 6
    table_res = client.post("/api/tables", json={"table_number": 30, "capacity": 6, "location": "Indoor"})
    table_id = table_res.json()["id"]

    res_time = datetime.now(timezone.utc) + timedelta(days=2, hours=19)

    # First reservation succeeds
    first_res = client.post(
        "/api/reservations",
        json={
            "table_id": table_id,
            "customer_name": "Bob Smith",
            "customer_phone": "+1-555-0144",
            "party_size": 4,
            "reservation_time": res_time.isoformat(),
            "status": "CONFIRMED",
        },
    )
    assert first_res.status_code == 201

    # Second reservation on the same table 30 minutes later (within 2-hour window) must be rejected
    conflict_time = res_time + timedelta(minutes=30)
    second_res = client.post(
        "/api/reservations",
        json={
            "table_id": table_id,
            "customer_name": "Charlie Davis",
            "customer_phone": "+1-555-0188",
            "party_size": 2,
            "reservation_time": conflict_time.isoformat(),
            "status": "CONFIRMED",
        },
    )
    assert second_res.status_code == 409
    assert "already booked" in second_res.json()["detail"]

def test_order_totals_calculation():
    # Create two menu items
    i1 = client.post(
        "/api/menu-items",
        json={"name": "Burrata Salad", "description": "Fresh burrata with pesto", "price": 14.00, "category": "Appetizer"},
    ).json()
    i2 = client.post(
        "/api/menu-items",
        json={"name": "Tiramisu", "description": "Classic Italian dessert", "price": 9.50, "category": "Dessert"},
    ).json()

    table = client.post("/api/tables", json={"table_number": 42, "capacity": 4, "location": "Indoor"}).json()

    order_payload = {
        "table_id": table["id"],
        "notes": "No nuts please",
        "items": [
            {"menu_item_id": i1["id"], "quantity": 2},  # 2 * 14.00 = 28.00
            {"menu_item_id": i2["id"], "quantity": 3},  # 3 * 9.50 = 28.50
        ],
    }
    order_res = client.post("/api/orders", json=order_payload)
    assert order_res.status_code == 201
    order_data = order_res.json()

    # Total should equal 28.00 + 28.50 = 56.50
    assert order_data["total_amount"] == 56.50
    assert order_data["order_status"] == "PLACED"
    assert len(order_data["items"]) == 2

def test_order_status_valid_transition():
    # Create an order
    item = client.post(
        "/api/menu-items",
        json={"name": "Espresso", "price": 4.00, "category": "Beverage", "description": "Double shot"},
    ).json()

    order = client.post(
        "/api/orders",
        json={"notes": "Quick", "items": [{"menu_item_id": item["id"], "quantity": 1}]},
    ).json()
    order_id = order["id"]
    assert order["order_status"] == "PLACED"

    # Step 1: PLACED -> PREPARING
    s1 = client.put(f"/api/orders/{order_id}/status", json={"order_status": "PREPARING"})
    assert s1.status_code == 200
    assert s1.json()["order_status"] == "PREPARING"

    # Step 2: PREPARING -> SERVED
    s2 = client.put(f"/api/orders/{order_id}/status", json={"order_status": "SERVED"})
    assert s2.status_code == 200
    assert s2.json()["order_status"] == "SERVED"

    # Step 3: SERVED -> PAID
    s3 = client.put(f"/api/orders/{order_id}/status", json={"order_status": "PAID"})
    assert s3.status_code == 200
    assert s3.json()["order_status"] == "PAID"

def test_order_status_invalid_transition():
    item = client.post(
        "/api/menu-items",
        json={"name": "Sparkling Water", "price": 3.50, "category": "Beverage", "description": "San Pellegrino"},
    ).json()

    order = client.post(
        "/api/orders",
        json={"notes": "Chilled", "items": [{"menu_item_id": item["id"], "quantity": 1}]},
    ).json()
    order_id = order["id"]

    # Invalid jump: PLACED directly to PAID without preparing/serving
    bad_res = client.put(f"/api/orders/{order_id}/status", json={"order_status": "PAID"})
    assert bad_res.status_code == 400
    assert "Invalid order status transition" in bad_res.json()["detail"]

def test_stats_and_delete_menu_item():
    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_menu_items" in stats
    assert "total_tables" in stats
    assert "active_reservations" in stats
    assert "total_revenue" in stats

    # Create & delete menu item
    tmp = client.post(
        "/api/menu-items",
        json={"name": "Temporary Special", "price": 18.00, "category": "Side", "description": "Test delete"},
    ).json()
    del_res = client.delete(f"/api/menu-items/{tmp['id']}")
    assert del_res.status_code == 204

    # Verification: should return 404
    assert client.get(f"/api/menu-items/{tmp['id']}").status_code == 404
