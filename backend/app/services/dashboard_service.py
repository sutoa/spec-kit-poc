from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models import Account, Institution
from backend.app.schemas import DashboardReport, InstitutionGroup, Account as SchemaAccount # Alias Account schema

def get_dashboard_report(db: Session, as_of_date: Optional[date] = None) -> DashboardReport:
    """
    Retrieves and aggregates account data into a dashboard report.

    Args:
        db: The database session.
        as_of_date: Optional date to filter the report. If None, uses the latest available data.

    Returns:
        A DashboardReport schema object.
    """
    institutions = db.query(Institution).all()
    
    institution_groups: List[InstitutionGroup] = []
    grand_total = 0.0

    for inst in institutions:
        # Filter accounts by institution and as_of_date
        query = db.query(Account).filter(Account.institution_id == inst.id)
        if as_of_date:
            # Get the closest date of the account information available from the institution
            # before or on the 'as-of date' provided in the filter.
            # This is a simplified logic. A more robust implementation might involve
            # a subquery to find the max as_of_date <= provided_date for each account.
            accounts_data = query.filter(Account.as_of_date <= as_of_date).order_by(Account.as_of_date.desc()).all()
            
            # Group accounts by their external_id to pick the latest for each
            unique_accounts = {}
            for acc in accounts_data:
                if acc.external_id not in unique_accounts or unique_accounts[acc.external_id].as_of_date < acc.as_of_date:
                    unique_accounts[acc.external_id] = acc
            accounts_filtered = list(unique_accounts.values())
            
        else:
            # If no as_of_date, get the latest data for each account
            # This requires more complex logic to get the latest `as_of_date` for each unique `external_id`
            # For simplicity in MVP, we'll fetch all and then filter to latest unique
            all_accounts = query.order_by(Account.as_of_date.desc()).all()
            unique_accounts_latest = {}
            for acc in all_accounts:
                if acc.external_id not in unique_accounts_latest:
                    unique_accounts_latest[acc.external_id] = acc
            accounts_filtered = list(unique_accounts_latest.values())

        sub_total = sum(acc.balance for acc in accounts_filtered)

        # Convert SQLAlchemy models to Pydantic schemas
        schema_accounts = [SchemaAccount.from_orm(acc) for acc in accounts_filtered]
        schema_institution = {
            "id": inst.id,
            "name": inst.name,
            # "status": inst.status # Only include necessary fields for dashboard view
        }

        institution_groups.append(
            InstitutionGroup(
                institution=schema_institution,
                accounts=schema_accounts,
                sub_total=sub_total
            )
        )
        grand_total += sub_total

    return DashboardReport(
        institution_groups=institution_groups,
        grand_total=grand_total
    )
