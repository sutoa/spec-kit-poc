import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.main import app, get_db
from backend.app import models, schemas, crud

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def db_session():
    models.Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        models.Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    return TestClient(app)

def test_token_endpoint(client, db_session, mocker):
    # Mock the SnapTrade API call in create_user
    mock_snaptrade_response = {
        "userId": "test_snap_user",
        "userSecret": "test_snap_secret"
    }
    mocker.patch(
        "httpx.Client.post",
        return_value=mocker.MagicMock(
            status_code=200,
            json=lambda: mock_snaptrade_response,
            raise_for_status=lambda: None
        )
    )

    user_create = schemas.UserCreate(username="testuser", password="testpassword")
    user = crud.create_user(db_session, user_create)
    
    login_data = {"username": "testuser", "password": "testpassword"}
    response = client.post("/token", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
