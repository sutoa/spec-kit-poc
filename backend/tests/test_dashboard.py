import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from datetime import date, timedelta
import os

from backend.app.main import app, get_db, _fetch_snaptrade_accounts
from backend.app.database import Base, SessionLocal, engine
from backend.app import crud, schemas, models
from backend.app.cache import cache

# Setup for testing database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)

def override_get_db(): # This function is no longer needed but may be used by existing conftest.py
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# app.dependency_overrides[get_db] = override_get_db # Remove this line

client = TestClient(app)

@pytest.fixture(autouse=True)
def run_around_tests():
    # Setup: Clear cache before each test
    cache.clear()
    # Create tables
    Base.metadata.create_all(bind=test_engine)
    yield
    # Teardown: Drop tables after each test
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture
def db_session():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Override the application's get_db dependency to use this test session
    app.dependency_overrides[get_db] = lambda: session

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()
        app.dependency_overrides.clear() # Clear overrides after test


def create_test_institution(db: Session, external_id: str, name: str, status: str = "connected"):
    institution_data = schemas.InstitutionCreate(external_id=external_id, name=name, status=status)
    db_institution = crud.create_institution(db, institution=institution_data)
    db.commit()
    return db_institution

@pytest.mark.asyncio
async def test_get_dashboard_no_institutions(db_session: Session):
    response = client.get("/dashboard/")
    assert response.status_code == 200
    assert response.json() == {"grand_total": 0.0, "institutions": []}

@pytest.mark.asyncio
async def test_get_dashboard_with_connected_institutions(db_session: Session, mocker):
    create_test_institution(db_session, "snap_inst_1", "Test Bank 1", "connected")
    create_test_institution(db_session, "snap_inst_2", "Test Bank 2", "connected")

    mock_accounts_data_inst1 = [
        {"id": "acc1", "number": "1234", "balance": {"amount": 1000.0, "currency": "USD", "date": str(date.today())}},
        {"id": "acc2", "number": "5678", "balance": {"amount": 2000.0, "currency": "USD", "date": str(date.today())}},
    ]
    mock_accounts_data_inst2 = [
        {"id": "acc3", "number": "9012", "balance": {"amount": 3000.0, "currency": "USD", "date": str(date.today())}},
    ]

    mocker.patch("os.getenv", side_effect=lambda x: "dummy_key" if "SNAPTRADE" in x else None)
    mocker.patch("backend.app.main._fetch_snaptrade_accounts", side_effect=[
        mock_accounts_data_inst1,
        mock_accounts_data_inst2,
    ])

    response = client.get("/dashboard/")
    assert response.status_code == 200
    data = response.json()

    assert data["grand_total"] == 6000.0
    assert len(data["institutions"]) == 2
    assert data["institutions"][0]["name"] == "Test Bank 1"
    assert data["institutions"][0]["sub_total"] == 3000.0
    assert len(data["institutions"][0]["accounts"]) == 2
    assert data["institutions"][1]["name"] == "Test Bank 2"
    assert data["institutions"][1]["sub_total"] == 3000.0
    assert len(data["institutions"][1]["accounts"]) == 1

@pytest.mark.asyncio
async def test_get_dashboard_with_as_of_date_filter(db_session: Session, mocker):
    create_test_institution(db_session, "snap_inst_1", "Test Bank 1", "connected")

    today = date.today()
    yesterday = today - timedelta(days=1)
    two_days_ago = today - timedelta(days=2)

    mock_accounts_data = [
        {"id": "acc1", "number": "1111", "balance": {"amount": 100.0, "currency": "USD", "date": str(today)}},
        {"id": "acc2", "number": "2222", "balance": {"amount": 200.0, "currency": "USD", "date": str(yesterday)}},
        {"id": "acc3", "number": "3333", "balance": {"amount": 300.0, "currency": "USD", "date": str(two_days_ago)}},
    ]

    mocker.patch("os.getenv", side_effect=lambda x: "dummy_key" if "SNAPTRADE" in x else None)
    mocker.patch("backend.app.main._fetch_snaptrade_accounts", return_value=mock_accounts_data)

    response = client.get(f"/dashboard/?as_of_date={yesterday.isoformat()}")
    assert response.status_code == 200
    data = response.json()

    assert data["grand_total"] == 500.0 # Only accounts from yesterday and two days ago should be included
    assert len(data["institutions"]) == 1
    assert data["institutions"][0]["sub_total"] == 500.0
    assert len(data["institutions"][0]["accounts"]) == 2

@pytest.mark.asyncio
async def test_get_dashboard_caching(db_session: Session, mocker):
    create_test_institution(db_session, "snap_inst_1", "Test Bank 1", "connected")

    mock_accounts_data = [
        {"id": "acc1", "number": "1234", "balance": {"amount": 100.0, "currency": "USD", "date": str(date.today())}},
    ]

    mocker.patch("os.getenv", side_effect=lambda x: "dummy_key" if "SNAPTRADE" in x else None)
    mock_fetch = mocker.patch("backend.app.main._fetch_snaptrade_accounts", return_value=mock_accounts_data)

    # Mock the cache object itself
    mock_cache = mocker.Mock()
    mock_cache.get.return_value = None # Initially no cache hit
    mocker.patch("backend.app.main.cache", new=mock_cache)

    # First call - should fetch from API and populate cache
    response1 = client.get("/dashboard/")
    assert response1.status_code == 200
    assert response1.json()["grand_total"] == 100.0
    assert mock_fetch.call_count == 1
    mock_cache.get.assert_called_once_with("dashboard_None")
    mock_cache.set.assert_called_once() # Verify set was called

    # Configure mock cache for second call (cache hit)
    mock_cache.get.return_value = schemas.Dashboard(grand_total=100.0, institutions=[
        schemas.Institution(
            id=1, external_id="snap_inst_1", name="Test Bank 1", status="connected", sub_total=100.0, accounts=[
                schemas.Account(external_id="acc1", masked_account_number="••••1234", balance=100.0, as_of_date=str(date.today()), institution_id=1)
            ]
        )
    ])
    mock_fetch.reset_mock() # Reset mock_fetch call count for this assertion

    # Second call - should use cache, not hit API again
    response2 = client.get("/dashboard/")
    assert response2.status_code == 200
    assert response2.json()["grand_total"] == 100.0
    assert mock_fetch.call_count == 0 # Should not call fetch
    assert mock_cache.get.call_count == 2 # Get called twice

    # Third call with different as_of_date - should bypass cache and hit API again
    another_day = date.today() - timedelta(days=1)
    mock_fetch.return_value = [
        {"id": "acc1", "number": "1234", "balance": {"amount": 50.0, "currency": "USD", "date": str(another_day)}},
    ]
    mock_cache.get.return_value = None # Assume no cache for new key
    
    response3 = client.get(f"/dashboard/?as_of_date={another_day.isoformat()}")
    assert response3.status_code == 200
    assert response3.json()["grand_total"] == 50.0
    assert mock_fetch.call_count == 1 # Should be 1 more call
    assert mock_cache.get.call_count == 3 # Get called once more
    mock_cache.set.assert_called_with(f"dashboard_{another_day.isoformat()}", mocker.ANY) # Verify set with new key