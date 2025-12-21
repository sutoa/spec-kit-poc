from datetime import date
from sqlalchemy.orm import Session
from backend.app.services.dashboard_service import get_dashboard_data
from backend.app import crud, schemas, models
from unittest.mock import MagicMock

def test_get_dashboard_data_empty(db_session: Session):
    # Mock crud.get_institutions to return an empty list
    crud.get_institutions = MagicMock(return_value=[])
    
    response = get_dashboard_data(db_session, None)
    assert response.grand_total == 0.0
    assert response.institutions == []

def test_get_dashboard_data_with_data(db_session: Session):
    # Mock institutions and accounts
    institution1 = models.Institution(id=1, external_id="inst1_ext", name="Institution A", status="connected")
    account1_1 = models.Account(id=101, external_id="acc1_1_ext", masked_account_number="****1001", balance=100.0, as_of_date=date(2023, 1, 1), institution_id=1)
    account1_2 = models.Account(id=102, external_id="acc1_2_ext", masked_account_number="****1002", balance=200.0, as_of_date=date(2023, 1, 1), institution_id=1)

    institution2 = models.Institution(id=2, external_id="inst2_ext", name="Institution B", status="connected")
    account2_1 = models.Account(id=201, external_id="acc2_1_ext", masked_account_number="****2001", balance=150.0, as_of_date=date(2023, 1, 1), institution_id=2)

    crud.get_institutions = MagicMock(return_value=[institution1, institution2])
    crud.get_accounts_by_institution = MagicMock(side_effect=[
        [account1_1, account1_2], # For institution1
        [account2_1]              # For institution2
    ])

    response = get_dashboard_data(db_session, None)
    assert response.grand_total == 450.0
    assert len(response.institutions) == 2

    # Check Institution A
    inst_a_data = response.institutions[0]
    assert inst_a_data.institution.name == "Institution A"
    assert inst_a_data.sub_total == 300.0
    assert len(inst_a_data.accounts) == 2

    # Check Institution B
    inst_b_data = response.institutions[1]
    assert inst_b_data.institution.name == "Institution B"
    assert inst_b_data.sub_total == 150.0
    assert len(inst_b_data.accounts) == 1

def test_get_dashboard_data_with_as_of_date(db_session: Session):
    institution1 = models.Institution(id=1, external_id="inst1_ext", name="Institution A", status="connected")
    account1_1_old = models.Account(id=101, external_id="acc1_1_ext", masked_account_number="****1001", balance=100.0, as_of_date=date(2023, 1, 1), institution_id=1)
    account1_1_new = models.Account(id=103, external_id="acc1_1_ext", masked_account_number="****1001", balance=120.0, as_of_date=date(2023, 1, 15), institution_id=1)
    account1_2 = models.Account(id=102, external_id="acc1_2_ext", masked_account_number="****1002", balance=200.0, as_of_date=date(2023, 1, 10), institution_id=1)

    crud.get_institutions = MagicMock(return_value=[institution1])
    crud.get_accounts_by_institution = MagicMock(return_value=[account1_1_old, account1_1_new, account1_2])

    as_of_date = date(2023, 1, 12)
    response = get_dashboard_data(db_session, as_of_date)

    assert response.grand_total == 300.0 # 100 (old 1-1) + 200 (1-2) if 1-1_new not considered. The logic is latest <= as_of_date.
    assert len(response.institutions) == 1
    inst_a_data = response.institutions[0]
    assert inst_a_data.institution.name == "Institution A"
    assert inst_a_data.sub_total == 300.0
    assert len(inst_a_data.accounts) == 2 # acc1_1_old and acc1_2

    # Check specific accounts and balances
    assert any(acc.external_id == "acc1_1_ext" and acc.balance == 100.0 for acc in inst_a_data.accounts)
    assert any(acc.external_id == "acc1_2_ext" and acc.balance == 200.0 for acc in inst_a_data.accounts)

    as_of_date_latest = date(2023, 1, 20)
    response_latest = get_dashboard_data(db_session, as_of_date_latest)
    assert response_latest.grand_total == 320.0 # 120 (new 1-1) + 200 (1-2)
    assert len(response_latest.institutions) == 1
    inst_a_data_latest = response_latest.institutions[0]
    assert inst_a_data_latest.institution.name == "Institution A"
    assert inst_a_data_latest.sub_total == 320.0
    assert len(inst_a_data_latest.accounts) == 2 # acc1_1_new and acc1_2
    assert any(acc.external_id == "acc1_1_ext" and acc.balance == 120.0 for acc in inst_a_data_latest.accounts)
    assert any(acc.external_id == "acc1_2_ext" and acc.balance == 200.0 for acc in inst_a_data_latest.accounts)