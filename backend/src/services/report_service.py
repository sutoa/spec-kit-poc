from typing import List
from sqlalchemy.orm import Session

from ..models.item import Item
from ..services.security import decrypt_data
from ..services.plaid_service import PlaidService

class ReportService:
    def __init__(self, db: Session, plaid_service: PlaidService):
        self.db = db
        self.plaid_service = plaid_service

    async def get_transactions_for_item(self, item_id: int):
        db_item = self.db.query(Item).filter(Item.id == item_id).first()
        if not db_item:
            return None # Or raise an exception

        access_token = decrypt_data(db_item.access_token)

        # In a real application, you'd handle date ranges, pagination, etc.
        # For simplicity, we'll fetch recent transactions.
        transactions_response = await self.plaid_service.get_transactions(access_token)
        return transactions_response.transactions
