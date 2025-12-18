from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import httpx
import os
from dotenv import load_dotenv
from datetime import date
from typing import Optional

from . import crud, models, schemas
from .database import SessionLocal, engine
from .cache import cache
from .logging_config import configure_logging # Import logging configuration

load_dotenv()

configure_logging() # Configure logging at startup

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


async def _fetch_snaptrade_accounts(session_token: str):
    accounts_headers = {
        "Authorization": f"Bearer {session_token}",
    }
    async with httpx.AsyncClient() as client:
        accounts_response = await client.get("https://api.snaptrade.com/api/v1/accounts", headers=accounts_headers)
        accounts_response.raise_for_status()
        return accounts_response.json()


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

            # Store the session_token associated with the user/institution
            # For MVP, we'll assume a single user and store against the institution
            # In a multi-user setup, this needs to be tied to a specific user
            
            # First, fetch the accounts to get the institution_id
            accounts = await _fetch_snaptrade_accounts(session_token)

            for acc in accounts:
                institution_external_id = acc["institution"]["id"]
                institution = crud.get_institution_by_external_id(db, external_id=institution_external_id)

                if institution:
                    # Update existing institution status and session token (simplified)
                    institution.status = "connected"
                    # In a real app, you would store the session_token securely
                    # and associate it with the institution and user.
                    # For MVP, we are not storing session tokens in DB yet.
                    db.add(institution)
                    db.commit()
                    db.refresh(institution)
                else:
                    # Create new institution
                    institution_data = schemas.InstitutionCreate(
                        external_id=institution_external_id,
                        name=acc["institution"]["name"],
                        status="connected",
                    )
                    institution = crud.create_institution(db, institution=institution_data)

                # Store accounts
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


@app.get("/dashboard/", response_model=schemas.Dashboard)
async def get_dashboard(
    as_of_date: Optional[date] = Query(None, description="Filter accounts as of a specific date"),
    db: Session = Depends(get_db)
):
    cache_key = f"dashboard_{as_of_date}" # as_of_date can be None
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    all_institutions_data = []
    grand_total = 0.0

    institutions = crud.get_institutions(db)
    if not institutions:
        return schemas.Dashboard(grand_total=0.0, institutions=[])
    for inst in institutions:
        if inst.status == "connected":
            # For MVP, we are assuming we can get accounts directly from SnapTrade
            # In a real app, this would involve retrieving a stored session token
            # and using it to fetch accounts.
            # For now, we'll use a dummy session_token if we need one for the call.
            dummy_session_token = "dummy_session_token" # This would be retrieved from DB in a real app

            try:
                accounts_data_from_snaptrade = await _fetch_snaptrade_accounts(dummy_session_token)
            except httpx.HTTPStatusError as e:
                # Handle API error for this institution, e.g., set status to error
                all_institutions_data.append(
                    schemas.Institution(
                        id=inst.id,
                        external_id=inst.external_id,
                        name=inst.name,
                        status="error", # Update status to error
                        accounts=[],
                        sub_total=0.0
                    )
                )
                continue # Skip to next institution

            institution_accounts = []
            sub_total = 0.0
            for acc_data in accounts_data_from_snaptrade:
                # Apply as_of_date filter
                if as_of_date and date.fromisoformat(acc_data["balance"]["date"]) > as_of_date:
                    continue

                account = schemas.Account(
                    external_id=acc_data["id"],
                    masked_account_number=f"••••{acc_data['number'][-4:]}" if acc_data["number"] else "••••",
                    balance=acc_data["balance"]["amount"],
                    as_of_date=acc_data["balance"]["date"],
                    institution_id=inst.id
                )
                institution_accounts.append(account)
                sub_total += acc_data["balance"]["amount"]
            
            all_institutions_data.append(
                schemas.Institution(
                    id=inst.id,
                    external_id=inst.external_id,
                    name=inst.name,
                    status=inst.status,
                    accounts=institution_accounts,
                    sub_total=sub_total
                )
            )
            grand_total += sub_total
        else:
            # If not connected, add to list with 0 accounts and 0 sub_total
            all_institutions_data.append(
                schemas.Institution(
                    id=inst.id,
                    external_id=inst.external_id,
                    name=inst.name,
                    status=inst.status,
                    accounts=[],
                    sub_total=0.0
                )
            )
            
    dashboard_data = schemas.Dashboard(grand_total=grand_total, institutions=all_institutions_data)
    cache.set(cache_key, dashboard_data)
    return dashboard_data