import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.main import app, get_db
from backend.app.database import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_read_institutions(mocker):
    mocker.patch("backend.app.crud.get_institutions", return_value=[])
    response = client.get("/institutions/")
    assert response.status_code == 200
    assert response.json() == []


def test_snaptrade_connect(mocker):
    mocker.patch.dict(
        "os.environ",
        {
            "SNAPTRADE_CLIENT_ID": "test_client_id",
            "SNAPTRADE_CLIENT_SECRET": "test_consumer_key",
        },
    )

    mock_response_json = {"redirect_uri": "https://snaptrade.com/redirect"}
    mock_response_status_code = 200

    class MockHttpxResponse:
        def __init__(self, json_data, status_code):
            self._json_data = json_data
            self.status_code = status_code
            self.text = ""

        def json(self):
            return self._json_data

        def raise_for_status(self):
            if self.status_code >= 400:
                raise httpx.HTTPStatusError("Bad response", request=None, response=self)

    class MockAsyncClient:
        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

        async def post(self, *args, **kwargs):
            return MockHttpxResponse(mock_response_json, mock_response_status_code)

        async def get(self, *args, **kwargs): # Also mock get for potential future use or if callback uses it
            return MockHttpxResponse(mock_response_json, mock_response_status_code)

    mocker.patch("httpx.AsyncClient", return_value=MockAsyncClient())

    response = client.post("/snaptrade/connect", json={"institution_id": "inst_12_123"})
    assert response.status_code == 200
    assert response.json() == {"redirect_uri": "https://snaptrade.com/redirect"}
