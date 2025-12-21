from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.app.database import get_db
from backend.app import crud, schemas
from backend.app.config import settings

class SnapTradeClient:
    def get_snaptrade_connect_url(self, user_id: str):
        # In a real scenario, this would call SnapTrade's API to get a connection portal link.
        # The user_id is the id of the user in SnapTrade's system.
        # For MVP, we'll return a placeholder.
        return f"https://app.snaptrade.com/trade/connect?client_id={settings.SNAPTRADE_CLIENT_ID}&redirect_uri={settings.SNAPTRADE_REDIRECT_URI}&user_id={user_id}"

snaptrade_client = SnapTradeClient()

router = APIRouter()

class SnapTradeConnectRequest(BaseModel):
    institution_id: str

class SnapTradeConnectResponse(BaseModel):
    redirect_uri: str

@router.post("/connect", response_model=SnapTradeConnectResponse)
def connect_snaptrade(request: SnapTradeConnectRequest, db: Session = Depends(get_db)):
    institution = crud.get_institution_by_external_id(db, external_id=request.institution_id)
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    # In a real app, you would use a user_id from your system that is registered with SnapTrade
    # For MVP, we pass the institution's external_id as the user_id
    redirect_url = snaptrade_client.get_snaptrade_connect_url(
        user_id=institution.external_id
    )
    return SnapTradeConnectResponse(redirect_uri=redirect_url)

class SnapTradeCallbackRequest(BaseModel):
    public_token: str

class SnapTradeCallbackResponse(BaseModel):
    success: bool
    message: str = "Callback processed successfully"

@router.post("/callback", response_model=SnapTradeCallbackResponse)
def snaptrade_callback(request: SnapTradeCallbackRequest, db: Session = Depends(get_db)):
    try:
        # In a real SnapTrade integration, you would exchange the public_token
        # for a permanent access_token and refresh_token.
        print(f"Received SnapTrade callback with public_token: {request.public_token}")

        # Simulate updating an institution status to connected.
        # This logic needs to be properly implemented in a real-world scenario
        # where the public token is exchanged for account information.
        
        # For now, we'll just return success.
        return SnapTradeCallbackResponse(success=True)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process callback: {e}")
