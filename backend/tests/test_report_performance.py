import pytest
import time
from httpx import AsyncClient
from datetime import date
from sqlalchemy.orm import Session

from backend.src.main import app
from backend.src.models.item import Item
from backend.src.services.security import encrypt_data
from backend.src.database import get_db, Base, engine

# This will be replaced by a test-specific database session
@pytest.fixture(name="test_db")
def test_db_fixture():
    # Ensure tables are created for testing
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()
        # In a real test setup, you might drop tables or clean up data here
        Base.metadata.drop_all(bind=engine)


@pytest.mark.asyncio
async def test_report_generation_performance(test_db: Session):
    # Setup: Create a mock item in the test database
    encrypted_token = encrypt_data("mock_access_token") # Encrypt a mock token
    mock_item = Item(
        plaid_item_id="mock-plaid-item-id-1",
        access_token=encrypted_token,
        institution_id="mock-ins-id",
        institution_name="Mock Bank"
    )
    test_db.add(mock_item)
    test_db.commit()
    test_db.refresh(mock_item)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        start_time = time.time()
        response = await ac.post(
            "/api/v1/report",
            json={
                "item_ids": [mock_item.id],
                "as_of_date": date.today().isoformat()
            }
        )
        end_time = time.time()

    assert response.status_code == 200
    # Assert that the report generation is within the performance goal (60 seconds)
    assert (end_time - start_time) < 60, f"Report generation took too long: {end_time - start_time} seconds"

    # Further assertions on the report content could be added here
    report_data = response.json()
    assert report_data is not None
    assert "institutions" in report_data
    assert "grand_total" in report_data
