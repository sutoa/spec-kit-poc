from sqlalchemy.orm import Session
from unittest.mock import MagicMock
from backend.app.services.institution_service import (
    get_all_institutions, get_institution_by_id, update_institution_status, create_institution_if_not_exists
)
from backend.app import crud, schemas
import types # Import types for SimpleNamespace

# A simple class to act as a mock SQLAlchemy model instance
# This ensures attributes return concrete values, not nested MagicMocks
class SimpleMockDbInstitution(types.SimpleNamespace):
    def __init__(self, id, external_id, name, status):
        super().__init__(id=id, external_id=external_id, name=name, status=status)

def test_get_all_institutions_empty(db_session: Session):
    crud.get_institutions = MagicMock(return_value=[])
    institutions = get_all_institutions(db_session)
    assert institutions == []

def test_get_all_institutions_with_data(db_session: Session):
    mock_db_institution = SimpleMockDbInstitution(id=1, external_id="ext1", name="Bank A", status="connected")
    crud.get_institutions = MagicMock(return_value=[mock_db_institution])
    
    institutions = get_all_institutions(db_session)
    assert len(institutions) == 1
    assert institutions[0].name == "Bank A"
    assert institutions[0].status == "connected"

def test_get_institution_by_id_found(db_session: Session):
    mock_db_institution = SimpleMockDbInstitution(id=1, external_id="ext1", name="Bank A", status="connected")
    crud.get_institution = MagicMock(return_value=mock_db_institution)
    
    institution = get_institution_by_id(db_session, 1)
    assert institution is not None
    assert institution.name == "Bank A"
    assert institution.status == "connected"

def test_get_institution_by_id_not_found(db_session: Session):
    crud.get_institution = MagicMock(return_value=None)
    
    institution = get_institution_by_id(db_session, 999)
    assert institution is None

def test_update_institution_status(db_session: Session):
    original_db_institution = SimpleMockDbInstitution(id=1, external_id="ext1", name="Bank A", status="connected")
    updated_db_institution_result = SimpleMockDbInstitution(id=1, external_id="ext1", name="Bank A", status="disconnected")

    crud.get_institution = MagicMock(return_value=original_db_institution)
    crud.update_institution_status = MagicMock(return_value=updated_db_institution_result) 
    
    updated_institution = update_institution_status(db_session, 1, "disconnected")
    assert updated_institution is not None
    assert updated_institution.status == "disconnected"
    crud.update_institution_status.assert_called_with(db_session, 1, "disconnected")

def test_create_institution_if_not_exists_new(db_session: Session):
    crud.get_institution_by_external_id = MagicMock(return_value=None)
    mock_created_db_institution = SimpleMockDbInstitution(id=2, external_id="new_ext", name="New Bank", status="disconnected")
    crud.create_institution = MagicMock(return_value=mock_created_db_institution)

    institution = create_institution_if_not_exists(db_session, "new_ext", "New Bank")
    assert institution.name == "New Bank"
    assert institution.status == "disconnected"
    crud.create_institution.assert_called_once()
    crud.get_institution_by_external_id.assert_called_once_with(db_session, "new_ext")

def test_create_institution_if_not_exists_existing(db_session: Session):
    existing_db_institution = SimpleMockDbInstitution(id=1, external_id="ext1", name="Bank A", status="connected")
    crud.get_institution_by_external_id = MagicMock(return_value=existing_db_institution)
    crud.create_institution = MagicMock() # Should not be called

    institution = create_institution_if_not_exists(db_session, "ext1", "Bank A")
    assert institution.name == "Bank A"
    assert institution.status == "connected"
    crud.create_institution.assert_not_called()
    crud.get_institution_by_external_id.assert_called_once_with(db_session, "ext1")