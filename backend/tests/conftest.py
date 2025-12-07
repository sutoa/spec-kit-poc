import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session # Import Session
from starlette.testclient import TestClient
from backend.app.models import Base
from backend.app.schemas import UserCreate
from backend.app.crud import create_user
from backend.app.security import create_access_token
from backend.app.main import app, get_db
import backend.app.models
from unittest.mock import MagicMock, AsyncMock
import httpx


@pytest.fixture(scope="session")
def engine():
    TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    _engine = create_engine(TEST_SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    yield _engine

@pytest.fixture(scope="function")
def db_session(engine):
    import backend.app.models # Ensure models are registered

    # Create all tables once for the test session
    Base.metadata.create_all(bind=engine)

    connection = engine.connect()
    transaction = connection.begin()
    db = Session(bind=connection) # Use a direct Session instance from the connection

    # Override the application's get_db dependency to use this test session
    app.dependency_overrides[get_db] = lambda: db

    try:
        yield db
    finally:
        db.close() # Close the session
        transaction.rollback() # Rollback changes made during the test
        connection.close() # Close the connection
        # Drop all tables after the test function to ensure a clean slate for the next test
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def mock_httpx_clients(mocker): # Combined fixture to mock both sync and async httpx clients
    # Mock httpx.Client (for crud.create_user)
    mock_sync_response_object = MagicMock()
    mock_sync_response_object.status_code = 200
    mock_sync_response_object.json = MagicMock(return_value={"userId": "test_snap_user_id", "userSecret": "test_snap_user_secret"})
    mock_sync_response_object.raise_for_status = MagicMock()

    mock_sync_client_instance = MagicMock()
    mock_sync_client_instance.post.return_value = mock_sync_response_object
    mock_sync_client_instance.__enter__.return_value = mock_sync_client_instance # Configure for 'with' statement
    mock_sync_client_instance.__exit__.return_value = None # Configure for 'with' statement
    mocker.patch("httpx.Client", return_value=mock_sync_client_instance)

    # Mock httpx.AsyncClient (for initiate_snaptrade_connection and handle_snaptrade_callback)
    mock_async_response_object = AsyncMock()
    mock_async_response_object.status_code = 200
    # Make .json() a callable that returns the dictionary directly (not awaitable)
    mock_async_response_object.json = MagicMock(return_value={"redirect_uri": "https://snaptrade.com/mock_login", "state": "mock_state"})
    mock_async_response_object.raise_for_status = AsyncMock()

    mock_async_client_instance = AsyncMock()
    mock_async_client_instance.post.return_value = mock_async_response_object
    mock_async_client_instance.__aenter__.return_value = mock_async_client_instance # Configure for 'async with' statement
    mock_async_client_instance.__aexit__.return_value = None # Configure for 'async with' statement
    mocker.patch("httpx.AsyncClient", return_value=mock_async_client_instance)

    return mock_sync_client_instance, mock_async_client_instance # Return both for individual test overrides


@pytest.fixture(scope="function")
def test_user(mock_httpx_clients, db_session): # Dependency changed to mock_httpx_clients
    """Fixture to create a test user in the database, mocking the SnapTrade call."""
    mock_sync_client_instance, _ = mock_httpx_clients # Unpack for usage
    user_in = UserCreate(username="testuser", password="testpassword")
    user = create_user(db=db_session, user=user_in)
    db_session.commit()
    return user

@pytest.fixture(scope="function")
def auth_headers(test_user):
    """Fixture to create authentication headers for a test user."""
    token = create_access_token(data={"sub": test_user.username})
    return {"Authorization": f"Bearer {token}"}