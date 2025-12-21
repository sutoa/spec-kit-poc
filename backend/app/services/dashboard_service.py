from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from backend.app import crud, schemas
from backend.app.cache import cache

def get_dashboard_data(db: Session, as_of_date: Optional[date]):
    cache_key = f"dashboard_{as_of_date}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    institutions = crud.get_institutions(db)
    if not institutions:
        response = schemas.DashboardResponse(grand_total=0.0, institutions=[])
        cache.set(cache_key, response)
        return response

    dashboard_institutions = []
    grand_total = 0.0

    for institution_db in institutions:
        accounts_db = crud.get_accounts_by_institution(db, institution_db.id)
        
        if as_of_date:
            filtered_accounts = [
                account for account in accounts_db 
                if account.as_of_date and account.as_of_date <= as_of_date
            ]
            latest_accounts = {}
            for account in filtered_accounts:
                if account.external_id not in latest_accounts or \
                   (account.as_of_date and latest_accounts[account.external_id].as_of_date and 
                    account.as_of_date > latest_accounts[account.external_id].as_of_date):
                    latest_accounts[account.external_id] = account
            accounts_db = list(latest_accounts.values())
        
        sub_total = sum(account.balance for account in accounts_db)
        grand_total += sub_total

        institution_schema = schemas.Institution.from_orm(institution_db)
        accounts_schema = [schemas.Account.from_orm(account) for account in accounts_db]

        dashboard_institutions.append(schemas.DashboardInstitution(
            institution=institution_schema,
            accounts=accounts_schema,
            sub_total=sub_total
        ))
    
    response = schemas.DashboardResponse(grand_total=grand_total, institutions=dashboard_institutions)
    cache.set(cache_key, response)
    return response