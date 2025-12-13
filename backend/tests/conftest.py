import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from starlette.testclient import TestClient
from backend.app.models import Base
from backend.app.main import app, get_db

@pytest.fixture(scope="session")
def engine():
    TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    _engine = create_engine(TEST_SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    yield _engine

@pytest.fixture(scope="function")
def db_session(engine):
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()
    transaction = connection.begin()
    db = Session(bind=connection)
    app.dependency_overrides[get_db] = lambda: db
    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
