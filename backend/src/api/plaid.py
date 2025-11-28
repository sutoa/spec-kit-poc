from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import logging

from ..services.plaid_service import PlaidService
from ..services.security import encrypt_data
from ..database import get_db
from ..models.item import Item

logger = logging.getLogger(__name__)
router = APIRouter()

class LinkTokenCreateResponse(BaseModel):
    link_token: str
    expiration: str
    request_id: str

class PublicTokenExchangeRequest(BaseModel):
    public_token: str

class PublicTokenExchangeResponse(BaseModel):
    item_id: int # The ID of the item in our database

@router.post("/plaid/create_link_token", response_model=LinkTokenCreateResponse)
async def create_link_token(plaid_service: Annotated[PlaidService, Depends(PlaidService)]):
    logger.info("Received request to create Plaid link token.")
    try:
        response = await plaid_service.create_link_token(user_id="user-id") # TODO: Replace with actual user ID
        logger.info("Successfully created Plaid link token.")
        return response
    except Exception as e:
        logger.error(f"Error creating Plaid link token: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create link token: {e}")

@router.post("/plaid/exchange_public_token", response_model=PublicTokenExchangeResponse)
async def exchange_public_token(
    request: PublicTokenExchangeRequest,
    plaid_service: Annotated[PlaidService, Depends(PlaidService)],
    db: Annotated[Session, Depends(get_db)]
):
    logger.info(f"Received request to exchange public token: {request.public_token}")
    try:
        exchange_response = await plaid_service.exchange_public_token(request.public_token)
        logger.info(f"Successfully exchanged public token for item_id: {exchange_response.item_id}")
    except Exception as e:
        logger.error(f"Failed to exchange public token: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to exchange public token: {e}")

    encrypted_access_token = encrypt_data(exchange_response.access_token)
    logger.info("Access token encrypted successfully.")

    # TODO: Fetch institution details using institution_id from exchange_response
    # For now, using placeholders
    institution_id = "ins_100000" # Placeholder
    institution_name = "Plaid Test Bank" # Placeholder
    logger.warning("Using placeholder institution_id and institution_name.")

    db_item = Item(
        plaid_item_id=exchange_response.item_id,
        access_token=encrypted_access_token,
        institution_id=institution_id,
        institution_name=institution_name,
    )

    try:
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        logger.info(f"Item {db_item.id} saved to database with plaid_item_id: {db_item.plaid_item_id}")
    except IntegrityError:
        db.rollback()
        logger.warning(f"Attempted to link an item that is already linked (plaid_item_id: {exchange_response.item_id}).")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Item already linked.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to save item to database: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to save item: {e}")

    return PublicTokenExchangeResponse(item_id=db_item.id)
