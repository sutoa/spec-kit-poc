import pytest
from httpx import AsyncClient
from datetime import date
from sqlalchemy.orm import Session
from unittest.mock import AsyncMock

from backend.src.main import app
from backend.src.models.item import Item
from backend.src.services.security import encrypt_data
from backend.src.database import get_db, Base, engine
from backend.src.services.plaid_service import PlaidService

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

@pytest.fixture
def mock_plaid_service():
    service = AsyncMock(spec=PlaidService)
    # Mocking get_transactions to return predefined data
    service.get_transactions.return_value = [
        {
            "account_id": "acc_1",
            "account_name": "Checking",
            "account_mask": "0001",
            "amount": -50.00,
            "date": "2025-01-01",
            "name": "Coffee Shop",
            "institution_name": "Test Bank"
        },
        {
            "account_id": "acc_1",
            "account_name": "Checking",
            "account_mask": "0001",
            "amount": -20.00,
            "date": "2025-01-02",
            "name": "Groceries",
            "institution_name": "Test Bank"
        },
        {
            "account_id": "acc_2",
            "account_name": "Savings",
            "account_mask": "0002",
            "amount": 1000.00,
            "date": "2025-01-01",
            "name": "Deposit",
            "institution_name": "Test Bank"
        }
    ]
    return service

@pytest.mark.asyncio
async def test_report_balance_accuracy(test_db: Session, mock_plaid_service: PlaidService):
    # Override the PlaidService dependency to use our mock
    app.dependency_overrides[PlaidService] = lambda: mock_plaid_service

    # Setup: Create a mock item in the test database
    encrypted_token = encrypt_data("mock_access_token") # Encrypt a mock token
    mock_item = Item(
        plaid_item_id="mock-plaid-item-id-2",
        access_token=encrypted_token,
        institution_id="mock-ins-id-2",
        institution_name="Mock Bank Two"
    )
    test_db.add(mock_item)
    test_db.commit()
    test_db.refresh(mock_item)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/report",
            json={
                "item_ids": [mock_item.id],
                "as_of_date": date.today().isoformat()
            }
        )

    assert response.status_code == 200
    report_data = response.json()

    # Expected values based on mock_plaid_service data
    expected_checking_balance = -50.00 - 20.00 # Sum of transactions for acc_1
    expected_savings_balance = 1000.00       # Sum of transactions for acc_2
    expected_grand_total = expected_checking_balance + expected_savings_balance

    assert report_data["grand_total"] == pytest.approx(expected_grand_total, abs=0.01)
    
    # Assert institution details
    assert len(report_data["institutions"]) == 1
    institution_report = report_data["institutions"][0]
    assert institution_report["institution_name"] == "Test Bank" # From mock data
    assert institution_report["sub_total"] == pytest.approx(expected_grand_total, abs=0.01) # Only one institution in mock

    # Assert account details
    assert len(institution_report["accounts"]) == 2
    
    # Find checking account
    checking_account = next((acc for acc in institution_report["accounts"] if acc["mask"] == "0001"), None)
    assert checking_account is not None
    assert checking_account["name"] == "Checking"
    assert checking_account["balance"] == pytest.approx(expected_checking_balance, abs=0.01)

    # Find savings account
    savings_account = next((acc for acc in institution_report["accounts"] if acc["mask"] == "0002"), None)
    assert savings_account is not None
    assert savings_account["name"] == "Savings"
    assert savings_account["balance"] == pytest.approx(expected_savings_balance, abs=0.01)

    # Clean up dependency override
    app.dependency_overrides = {}