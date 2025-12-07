import logging
import time
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Request
from sqlalchemy.orm import Session
from . import crud, models, schemas, security
from .database import SessionLocal, engine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from .config import settings
import httpx
from datetime import datetime, timedelta

# Import logging_config to apply logging settings
from . import logging_config

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logging.info(f"Request: {request.method} {request.url} - Status: {response.status_code} - Duration: {duration:.4f}s")
    return response

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

async def initiate_snaptrade_connection(user: models.User):
    """
    Calls the SnapTrade API to get a redirect URI for connecting a new institution.
    A state token is generated to prevent CSRF attacks.
    """
    state = security.create_state_token(user.id)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.snaptrade.com/api/v1/snaptrade/login",
                json={
                    "clientId": settings.snaptrade_client_id,
                    "userId": user.snaptrade_user_id,
                    "userSecret": user.snaptrade_user_secret,
                },
            )
            response.raise_for_status()
            data = response.json()
            data['state'] = state
            return data
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"SnapTrade API error: {e.response.text}")

async def handle_snaptrade_callback(db: Session, authorization_id: str, state: str):
    """
    Handles the callback from SnapTrade after a user has connected an institution.
    """
    user_id = security.verify_state_token(state)
    if not user_id:
        raise ValueError("Invalid state")

    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise ValueError("User not found")
        
    # In a real app, you would get more details from SnapTrade about the new connection.
    # For now, we'll create a placeholder connection.
    # Let's assume the authorization object gives us some info.
    # This is a mocked response for what you might get from SnapTrade
    # after exchanging the authorization_id.
    async with httpx.AsyncClient() as client:
        try:
            # This is a hypothetical endpoint. You'd need to check SnapTrade's API docs.
            # For the purpose of this exercise, we will assume the auth id is the connection id
            # and we can get institution details.
            # In a real scenario, you would register the connection with SnapTrade first.
            # For now, we will create a dummy connection.
            
            # This is a simplified placeholder.
            # A real implementation would fetch details from SnapTrade using the authorization_id
            institution_name = "New Connection" # Placeholder
            
            # Check if a connection with this authorization_id already exists
            existing_connection = db.query(models.Connection).filter_by(snaptrade_connection_id=authorization_id).first()
            if existing_connection:
                # Optionally update the status
                existing_connection.status = "active"
                db.commit()
                db.refresh(existing_connection)
                return existing_connection

            connection_data = schemas.ConnectionCreate(
                institution_name=institution_name,
                snaptrade_connection_id=authorization_id,
                status="active"
            )
            return crud.create_connection(db=db, connection=connection_data, user_id=user_id)

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"SnapTrade API error: {e.response.text}")


@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.get("/connections/", response_model=list[schemas.Connection])
def read_connections(skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    connections = crud.get_connections(db, user_id=current_user.id, skip=skip, limit=limit)
    return connections

@app.post("/connections/connect", response_model=schemas.SnapTradeLoginResponse)
async def connect_institution_endpoint(current_user: models.User = Depends(get_current_user)):
    return await initiate_snaptrade_connection(user=current_user)

@app.post("/connections/callback", response_model=schemas.Connection)
async def connections_callback_endpoint(callback_data: schemas.SnapTradeCallback, db: Session = Depends(get_db)):
    try:
        connection = await handle_snaptrade_callback(
            db=db,
            authorization_id=callback_data.authorization_id,
            state=callback_data.state
        )
        return connection
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

from .cache import cache

@app.get("/dashboard", response_model=schemas.Dashboard)
async def get_dashboard(as_of_date: Optional[datetime] = None, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    connections = crud.get_connections(db, user_id=current_user.id)
    
    institutions = []
    grand_total = 0.0

    async with httpx.AsyncClient() as client:
        for conn in connections:
            cache_key = f"connection_{conn.id}_accounts"
            
            # If as_of_date is provided, we cannot use the cache
            if as_of_date:
                cached_data = None
            else:
                cached_data = cache.get(cache_key)

            if cached_data:
                accounts_data = cached_data
            else:
                try:
                    accounts_response = await client.get(
                        f"https://api.snaptrade.com/api/v1/accounts",
                        params={"userId": current_user.snaptrade_user_id, "userSecret": current_user.snaptrade_user_secret},
                        headers={"Authorization": f"Bearer {conn.snaptrade_connection_id}"} # This might be wrong depending on SnapTrade's API
                    )
                    accounts_response.raise_for_status()
                    accounts_data = accounts_response.json()
                    
                    if not as_of_date:
                        cache[cache_key] = accounts_data
                except httpx.HTTPStatusError as e:
                    print(f"Failed to fetch data for connection {conn.id}: {e}")
                    continue

            accounts = []
            if isinstance(accounts_data, list):
                for acc in accounts_data:
                    # Simulate as_of_date by using last_updated.
                    # SnapTrade's sandbox may not provide historical snapshots, so we filter what we get.
                    last_updated_date = acc.get("meta", {}).get("last_updated_at", datetime.utcnow().isoformat())
                    last_updated = datetime.fromisoformat(last_updated_date.replace("Z", "+00:00"))
                    
                    if as_of_date and last_updated > as_of_date:
                        continue

                    if acc.get("balance") and acc["balance"].get("total") is not None:
                        account_balance = acc["balance"]["total"]
                        accounts.append(schemas.Account(
                            id=acc.get("id", "N/A"),
                            snaptrade_account_id=acc.get("id", "N/A"),
                            masked_account_number=acc.get("number", "N/A"),
                            balance=account_balance,
                            currency=acc.get("currency", {}).get("code", "USD"),
                            as_of_date=last_updated,
                            last_updated=last_updated
                        ))
                        grand_total += account_balance
            
            if accounts:
                institutions.append(schemas.Institution(
                    name=conn.institution_name,
                    accounts=accounts
                ))

    return schemas.Dashboard(institutions=institutions, grand_total=grand_total)

    
@app.get("/")
def read_root():
    return {"Hello": "World"}

