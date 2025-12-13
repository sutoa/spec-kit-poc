from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
import httpx
import os
from dotenv import load_dotenv

from . import crud, models, schemas
from .database import SessionLocal, engine

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/institutions/", response_model=list[schemas.Institution])
def read_institutions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    institutions = crud.get_institutions(db, skip=skip, limit=limit)
    return institutions


@app.post("/snaptrade/connect")
async def snaptrade_connect(request: schemas.SnapTradeConnectRequest, db: Session = Depends(get_db)):
    client_id = os.getenv("SNAPTRADE_CLIENT_ID")
    consumer_key = os.getenv("SNAPTRADE_CLIENT_SECRET")
    
    if not client_id or not consumer_key:
        raise HTTPException(status_code=500, detail="SnapTrade credentials not configured")

    headers = {
        "Content-Type": "application/json",
        "clientId": client_id,
        "consumerKey": consumer_key,
    }
    
    # In a real application, you would get the user_id from the session
    user_id = "test-user-id"

    data = {
        "institutionId": request.institution_id,
        "userId": user_id,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post("https://api.snaptrade.com/api/v1/snapTrade/login", headers=headers, json=data)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error from SnapTrade API: {e.response.text}")


@app.post("/snaptrade/callback")
async def snaptrade_callback(public_token: str, db: Session = Depends(get_db)):
    client_id = os.getenv("SNAPTRADE_CLIENT_ID")
    consumer_key = os.getenv("SNAPTRADE_CLIENT_SECRET")

    if not client_id or not consumer_key:
        raise HTTPException(status_code=500, detail="SnapTrade credentials not configured")

    headers = {
        "Content-Type": "application/json",
        "clientId": client_id,
        "consumerKey": consumer_key,
    }

    data = {
        "public_token": public_token,
    }

    async with httpx.AsyncClient() as client:
        try:
            # Exchange public token for session token
            response = await client.post("https://api.snaptrade.com/api/v1/snapTrade/token", headers=headers, json=data)
            response.raise_for_status()
            session_token = response.json()["snapTradeSessionToken"]

            # Get user accounts
            accounts_headers = {
                "Authorization": f"Bearer {session_token}",
            }
            accounts_response = await client.get("https://api.snaptrade.com/api/v1/accounts", headers=accounts_headers)
            accounts_response.raise_for_status()
            accounts = accounts_response.json()

            for acc in accounts:
                institution = crud.get_institution_by_external_id(db, external_id=acc["institution"]["id"])
                if not institution:
                    institution_data = schemas.InstitutionCreate(
                        external_id=acc["institution"]["id"],
                        name=acc["institution"]["name"],
                        status="connected",
                    )
                    institution = crud.create_institution(db, institution=institution_data)

                account_data = schemas.AccountCreate(
                    external_id=acc["id"],
                    masked_account_number=acc["number"],
                    balance=acc["balance"]["amount"],
                    as_of_date=acc["balance"]["date"],
                )
                crud.create_institution_account(db, account=account_data, institution_id=institution.id)

            return {"success": True}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Error from SnapTrade API: {e.response.text}")