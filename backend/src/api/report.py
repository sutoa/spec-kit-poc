from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Annotated, List, Optional
from datetime import date
import logging

from sqlalchemy.orm import Session

from ..database import get_db
from ..services.plaid_service import PlaidService
from ..services.report_service import ReportService

logger = logging.getLogger(__name__)
router = APIRouter()

# Pydantic models based on openapi.yaml
class Account(BaseModel):
    name: str
    mask: str
    balance: float
    balance_as_of: date

class InstitutionReport(BaseModel):
    institution_name: str
    accounts: List[Account]
    sub_total: float
    status: str # "succeeded" or "failed"
    error_message: Optional[str] = None

class Report(BaseModel):
    institutions: List[InstitutionReport]
    grand_total: float

class ReportRequest(BaseModel):
    item_ids: List[int]
    as_of_date: date

@router.post("/report", response_model=Report)
async def generate_report(
    request: ReportRequest,
    db: Annotated[Session, Depends(get_db)],
    plaid_service: Annotated[PlaidService, Depends(PlaidService)]
):
    logger.info(f"Received request to generate report for item_ids: {request.item_ids}, as_of_date: {request.as_of_date}")
    report_service = ReportService(db, plaid_service)
    
    all_institutions_report = []
    grand_total = 0.0

    for item_id in request.item_ids:
        logger.info(f"Processing report for item_id: {item_id}")
        institution_report = InstitutionReport(
            institution_name="Unknown Institution", # Will be updated with actual data
            accounts=[],
            sub_total=0.0,
            status="succeeded"
        )
        try:
            # For simplicity, we're fetching all transactions and not just balances as of a date.
            # A more robust implementation would call Plaid's /accounts/balance/get or similar.
            transactions = await report_service.get_transactions_for_item(item_id)
            
            if transactions:
                accounts_data = {}
                for transaction in transactions:
                    account_id = transaction['account_id']
                    if account_id not in accounts_data:
                        accounts_data[account_id] = {
                            'name': transaction['account_name'], # Plaid often provides account name in transactions
                            'mask': transaction['account_mask'],
                            'balance': 0.0, # Will be calculated
                            'balance_as_of': request.as_of_date # Placeholder
                        }
                    # Sum up transaction amounts to simulate account balance
                    # This is a simplification; a real balance needs proper account balance endpoints
                    accounts_data[account_id]['balance'] += transaction['amount']
                
                # Convert accounts_data to list of Account models
                institution_accounts: List[Account] = []
                institution_sub_total = 0.0
                for acc_id, acc_data in accounts_data.items():
                    account_model = Account(**acc_data)
                    institution_accounts.append(account_model)
                    institution_sub_total += acc_data['balance']
                
                institution_report.accounts = institution_accounts
                institution_report.sub_total = institution_sub_total
                
                # Try to get institution name from Plaid
                # This requires an additional Plaid API call (e.g. /institutions/get) or storing it during linking.
                # For now, let's use the first account's institution name if available, or keep "Unknown"
                if transactions and 'institution_name' in transactions[0]:
                    institution_report.institution_name = transactions[0]['institution_name']
                elif transactions and 'institution_id' in transactions[0]:
                    # In a real app, you'd fetch institution details using institution_id
                    institution_report.institution_name = f"Institution ID: {transactions[0]['institution_id']}"
                else:
                    institution_report.institution_name = "Linked Account"

                grand_total += institution_sub_total
                logger.info(f"Successfully processed report for item {item_id}. Institution: {institution_report.institution_name}, Subtotal: {institution_sub_total}")
            else:
                institution_report.institution_name = f"Item ID: {item_id}"
                institution_report.status = "failed"
                institution_report.error_message = "No transactions found or item not accessible."
                logger.warning(f"No transactions found or item not accessible for item {item_id}.")

        except HTTPException as e:
            institution_report.status = "failed"
            institution_report.error_message = str(e.detail)
            logger.warning(f"Error fetching report for item {item_id}: {e.detail}")
        except Exception as e:
            institution_report.status = "failed"
            institution_report.error_message = f"An unexpected error occurred: {e}"
            logger.error(f"Unexpected error for item {item_id}: {e}", exc_info=True)
        
        all_institutions_report.append(institution_report)

    final_report = Report(
        institutions=all_institutions_report,
        grand_total=grand_total
    )
    logger.info("Report generation complete.")
    return final_report
