from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app import crud, schemas, models
from backend.app.cache import cache

def get_all_institutions(db: Session, skip: int = 0, limit: int = 100) -> List[schemas.Institution]:
    cache_key = f"all_institutions_{skip}_{limit}"
    cached_institutions = cache.get(cache_key)
    if cached_institutions:
        return cached_institutions
    
    institutions = crud.get_institutions(db, skip=skip, limit=limit)
    result = [schemas.Institution.model_validate(inst, from_attributes=True) for inst in institutions]
    cache.set(cache_key, result)
    return result

def get_institution_by_id(db: Session, institution_id: int) -> Optional[schemas.Institution]:
    cache_key = f"institution_{institution_id}"
    cached_institution = cache.get(cache_key)
    if cached_institution:
        return cached_institution

    institution = crud.get_institution(db, institution_id)
    if institution:
        result = schemas.Institution.model_validate(institution, from_attributes=True)
        cache.set(cache_key, result)
        return result
    return None

def update_institution_status(db: Session, institution_id: int, status: str) -> Optional[schemas.Institution]:
    updated_institution = crud.update_institution_status(db, institution_id, status)
    if updated_institution:
        cache.delete(f"institution_{institution_id}")
        cache.delete("all_institutions_0_100") # Assuming default pagination
        cache.delete("dashboard_None") # Invalidate dashboard cache
        return schemas.Institution.model_validate(updated_institution, from_attributes=True)
    return None

def create_institution_if_not_exists(db: Session, external_id: str, name: str) -> models.Institution:
    institution = crud.get_institution_by_external_id(db, external_id)
    if not institution:
        institution = crud.create_institution(db, schemas.InstitutionCreate(external_id=external_id, name=name))
        cache.delete("all_institutions_0_100") # Invalidate all institutions cache
    return institution

# More sophisticated SnapTrade integration logic would go here
# e.g., exchanging public token, fetching accounts, etc.
# For MVP, we are simulating much of this.
