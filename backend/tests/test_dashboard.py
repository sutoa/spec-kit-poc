import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from datetime import datetime, timedelta, timezone

from backend.app.main import app, get_db, cache
from backend.app.database import Base, engine
from backend.app.models import User, Connection
from backend.app.crud import create_user
from backend.app.schemas import UserCreate
from backend.app.security import create_access_token
from sqlalchemy.orm import sessionmaker

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function", autouse=True)
def clear_cache():
    cache.clear()

@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    db = TestingSessionLocal(bind=connection)
    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def _override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = _override_get_db
    return TestClient(app)


@pytest.fixture(scope="function")
@patch("httpx.Client.post")
def test_user(mock_post, db_session):
    mock_snaptrade_response = {"userId": "test_snap_user_id", "userSecret": "test_snap_user_secret"}
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = mock_snaptrade_response

    user_in = UserCreate(username="dashboard_user", password="password")
    user = create_user(db=db_session, user=user_in)
    db_session.commit()
    return user


@pytest.fixture(scope="function")
def auth_headers(test_user):
    token = create_access_token(data={"sub": test_user.username})
    return {"Authorization": f"Bearer {token}"}


@patch("httpx.AsyncClient.get", new_callable=AsyncMock)
def test_get_dashboard_success(mock_snaptrade_get, client, db_session, test_user, auth_headers):
    # Setup: Create connections for the user
    conn1 = Connection(user_id=test_user.id, institution_name="Bank Alpha", status="active", snaptrade_connection_id="snap1")
    conn2 = Connection(user_id=test_user.id, institution_name="Brokerage Beta", status="active", snaptrade_connection_id="snap2")
    db_session.add_all([conn1, conn2])
    db_session.commit()

    # Mock SnapTrade API responses
    mock_snaptrade_get.side_effect = [
        # Response for conn1
        AsyncMock(status_code=200, json=lambda: [
            {"id": 1, "number": "111", "balance": {"total": 1000, "currency": "USD"}, "meta": {"last_updated_at": "2023-01-01T12:00:00Z"}},
            {"id": 2, "number": "222", "balance": {"total": 2500, "currency": "USD"}, "meta": {"last_updated_at": "2023-01-01T12:00:00Z"}},
        ]),
        # Response for conn2
        AsyncMock(status_code=200, json=lambda: [
            {"id": 3, "number": "333", "balance": {"total": 5000, "currency": "CAD"}, "meta": {"last_updated_at": "2023-01-01T12:00:00Z"}},
        ]),
    ]
    
    response = client.get("/dashboard", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["grand_total"] == 8500.0
    assert len(data["institutions"]) == 2
    assert data["institutions"][0]["name"] == "Bank Alpha"
    assert len(data["institutions"][0]["accounts"]) == 2
    assert data["institutions"][1]["name"] == "Brokerage Beta"
    assert len(data["institutions"][1]["accounts"]) == 1

@patch("httpx.AsyncClient.get", new_callable=AsyncMock)
def test_get_dashboard_with_as_of_date(mock_snaptrade_get, client, db_session, test_user, auth_headers):
    conn = Connection(user_id=test_user.id, institution_name="Bank Gamma", status="active", snaptrade_connection_id="snap3")
    db_session.add(conn)
    db_session.commit()

    # Mock accounts with different update times
    now = datetime.now(timezone.utc)
    two_days_ago = now - timedelta(days=2)
    
    mock_snaptrade_get.return_value = AsyncMock(status_code=200, json=lambda: [
                                {"id": 101, "number": "n1", "balance": {"total": 100}, "meta": {"last_updated_at": now.isoformat()}, "snaptrade_account_id": "snap_acc_now"},
                                {"id": 102, "number": "n2", "balance": {"total": 200}, "meta": {"last_updated_at": two_days_ago.isoformat()}, "snaptrade_account_id": "snap_acc_old"},    ])
    
    one_day_ago = now - timedelta(days=1)
    
    response = client.get(f"/dashboard?as_of_date={one_day_ago.strftime('%Y-%m-%dT%H:%M:%SZ')}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    
    assert len(data["institutions"]) == 1
    assert len(data["institutions"][0]["accounts"]) == 1
    assert data["institutions"][0]["accounts"][0]["snaptrade_account_id"] == "snap_acc_old"
    assert data["grand_total"] == 200

@patch("httpx.AsyncClient.get", new_callable=AsyncMock)
def test_dashboard_caching(mock_snaptrade_get, client, auth_headers, test_user, db_session):
    conn = Connection(user_id=test_user.id, institution_name="Cache Bank", status="active", snaptrade_connection_id="snap_cache")
    db_session.add(conn)
    db_session.commit()

    mock_response = AsyncMock(status_code=200, json=lambda: [{"id": 3, "balance": {"total": 1234}, "meta": {"last_updated_at": "2023-01-01T12:00:00Z"}}])
    mock_snaptrade_get.return_value = mock_response

    # First call - should hit the API
    response1 = client.get("/dashboard", headers=auth_headers)
    assert response1.status_code == 200
    assert response1.json()["grand_total"] == 1234
    mock_snaptrade_get.assert_called_once()

    # Second call - should use cache
    response2 = client.get("/dashboard", headers=auth_headers)
    assert response2.status_code == 200
    assert response2.json()["grand_total"] == 1234
    mock_snaptrade_get.assert_called_once() 

    # Third call with date - should bypass cache and hit API again
    mock_snaptrade_get.return_value = AsyncMock(status_code=200, json=lambda: [{"id": 4, "balance": {"total": 5678}, "meta": {"last_updated_at": "2022-12-31T12:00:00Z"}}])
    response3 = client.get("/dashboard?as_of_date=2023-01-01T00:00:00Z", headers=auth_headers)
    assert response3.status_code == 200
    assert mock_snaptrade_get.call_count == 2
    assert response3.json()["grand_total"] == 5678
