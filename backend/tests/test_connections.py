import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.main import app, get_db
from backend.app.database import Base
from backend.app.models import User, Connection
from backend.app.schemas import UserCreate
from backend.app.crud import create_user
from backend.app.security import create_access_token
from unittest.mock import patch, AsyncMock

# Setup for in-memory SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()


@pytest.fixture(scope="function")
def client(db_session):
    """Fixture to create a TestClient for making API requests."""

    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    return TestClient(app)


@pytest.fixture(scope="function")
@patch("httpx.Client.post")
def test_user(mock_post, db_session):
    """Fixture to create a test user in the database, mocking the SnapTrade call."""
    mock_snaptrade_response = {"userId": "test_snap_user_id", "userSecret": "test_snap_user_secret"}
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = mock_snaptrade_response

    user_in = UserCreate(username="testuser", password="testpassword")
    user = create_user(db=db_session, user=user_in)
    db_session.commit()
    return user


@pytest.fixture(scope="function")
def auth_headers(test_user):
    """Fixture to create authentication headers for a test user."""
    token = create_access_token(data={"sub": test_user.username})
    return {"Authorization": f"Bearer {token}"}


def test_get_connections_empty(client, auth_headers):
    """Test fetching connections when there are none."""
    response = client.get("/connections", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_get_connections_with_data(client, db_session, test_user, auth_headers):
    """Test fetching connections when some exist."""
    conn1 = Connection(user_id=test_user.id, institution_name="Bank A", status="active", snaptrade_connection_id="snap1")
    conn2 = Connection(user_id=test_user.id, institution_name="Bank B", status="error", snaptrade_connection_id="snap2")
    db_session.add_all([conn1, conn2])
    db_session.commit()

    response = client.get("/connections", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["institution_name"] == "Bank A"
    assert data[1]["status"] == "error"
    
    db_session.delete(conn1)
    db_session.delete(conn2)
    db_session.commit()


@patch("backend.app.main.initiate_snaptrade_connection", new_callable=AsyncMock)
def test_initiate_connection(mock_initiate, client, auth_headers, test_user):
    """Test initiating a new connection via SnapTrade."""
    mock_response = {"redirect_uri": "https://snaptrade.com/mock_login", "state": "mock_state"}
    mock_initiate.return_value = mock_response

    response = client.post("/connections/connect", headers=auth_headers)

    assert response.status_code == 200
    assert response.json() == mock_response
    mock_initiate.assert_awaited_once()


@patch("backend.app.main.handle_snaptrade_callback", new_callable=AsyncMock)
def test_connection_callback(mock_handle_callback, client, db_session, test_user):
    """Test the callback endpoint for SnapTrade."""
    mock_connection = Connection(
        id=1,
        user_id=test_user.id,
        institution_name="Newly Connected Bank",
        status="active",
        snaptrade_connection_id="new_auth_id",
        created_at=test_user.created_at,
    )
    mock_handle_callback.return_value = mock_connection

    callback_data = {"authorization_id": "new_auth_id", "state": "a_valid_state_jwt"}

    response = client.post("/connections/callback", json=callback_data)

    assert response.status_code == 200
    data = response.json()
    assert data["institution_name"] == "Newly Connected Bank"
    assert data["status"] == "active"

    mock_handle_callback.assert_awaited_once()
    args, kwargs = mock_handle_callback.call_args
    assert "db" in kwargs
    assert kwargs["authorization_id"] == callback_data["authorization_id"]
    assert kwargs["state"] == callback_data["state"]


@patch("backend.app.main.handle_snaptrade_callback", new_callable=AsyncMock)
def test_connection_callback_invalid_state(mock_handle_callback, client):
    """Test the callback with an invalid state, expecting a 400 error."""
    mock_handle_callback.side_effect = ValueError("Invalid state")

    callback_data = {"authorization_id": "auth_id", "state": "invalid_state"}

    response = client.post("/connections/callback", json=callback_data)

    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid state"}

