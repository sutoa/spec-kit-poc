import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from snaptrade_client.model.login_redirect_uri import LoginRedirectURI
from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import Query
from .logging_config import logger # Import the configured logger

from . import crud, models, schemas, security
from .database import SessionLocal, engine
from .config import settings
from .cache import cache # Import the cache

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.logger = logger # Attach logger to the app object


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = security.get_username_from_token(token, credentials_exception)
    if username is None:
        raise credentials_exception
    user = crud.get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    app.logger.info("Attempting to create a new user", extra={"username": user.username})
    db_user = crud.get_user(db, username=user.username)
    if db_user:
        app.logger.warning("User registration failed: Username already registered", extra={"username": user.username})
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = crud.create_user(db=db, user_data=user)
    app.logger.info("User created successfully", extra={"username": new_user.username, "user_id": new_user.id})
    return new_user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    app.logger.info("Attempting user login", extra={"username": form_data.username})
    user = crud.get_user(db, username=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        app.logger.warning("Login failed: Invalid credentials", extra={"username": form_data.username})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(
        data={"sub": user.username}
    )
    app.logger.info("User logged in successfully", extra={"username": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/connections/connect", response_model=schemas.LoginRedirectURI)
async def create_connection(current_user: models.User = Depends(get_current_user)):
    app.logger.info("Initiating new connection process", extra={"user_id": current_user.id})
    # Configure API key authorization: clientId
    configuration = snaptrade_client.Configuration()
    configuration.client_id = settings.SNAPTRADE_CLIENT_ID
    configuration.consumer_key = settings.SNAPTRADE_CLIENT_SECRET
    
    api_instance = snaptrade_client.AuthenticationApi(snaptrade_client.ApiClient(configuration))
    
    # Generate a redirect URI for the user to authorize a connection
    redirect_uri_response = api_instance.login_and_get_redirect_uri(
        user_id=str(current_user.id),
        user_secret=security.create_user_secret(current_user.id) # A secure way to identify the user
    )
    app.logger.info("Successfully generated SnapTrade redirect URI", extra={"user_id": current_user.id})
    return {"redirect_uri": redirect_uri_response.redirect_uri}

@app.post("/connections/callback")
async def connection_callback(callback_data: schemas.SnapTradeCallback, db: Session = Depends(get_db)):
    app.logger.info("Received SnapTrade callback", extra={"authorization_id": callback_data.authorization_id, "state": callback_data.state})
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user_id = int(security.get_username_from_token(callback_data.state, credentials_exception))
        app.logger.info("Successfully extracted user_id from state token", extra={"user_id": user_id})
    except ValueError:
        app.logger.error("Failed to extract user_id from state token during callback", extra={"state": callback_data.state})
        raise credentials_exception

    configuration = snaptrade_client.Configuration()
    configuration.client_id = settings.SNAPTRADE_CLIENT_ID
    configuration.consumer_key = settings.SNAPTRADE_CLIENT_SECRET
    
    api_instance = snaptrade_client.AuthenticationApi(snaptrade_client.ApiClient(configuration))
    
    try:
        # Obtain the authorization ID and details
        api_response = api_instance.register_snap_trade_user(
            authentication_register_user_request=snaptrade_client.models.AuthenticationRegisterUserRequest(
                authorization_id=callback_data.authorization_id
            )
        )
        
        # Assume the first connection is the new one
        # In a real-world scenario, you might need more robust logic
        # to identify the newly added institution if multiple are possible.
        new_connection = api_response.connections[0]

        connection_data = schemas.ConnectionCreate(
            institution_name=new_connection.institution.name,
            status="active",
            snaptrade_connection_id=new_connection.id
        )
        crud.create_connection(db=db, connection_data=connection_data, user_id=user_id)
        app.logger.info("New connection successfully created via SnapTrade callback", extra={"user_id": user_id, "institution_name": new_connection.institution.name})
        
        return {"status": "success", "institution": new_connection.institution.name}

    except snaptrade_client.ApiException as e:
        app.logger.error("SnapTrade API error during callback", extra={"user_id": user_id, "error": str(e)})
        raise HTTPException(status_code=500, detail=f"SnapTrade API error: {e.reason}")


@app.get("/connections", response_model=List[schemas.Connection])
async def get_connections(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    app.logger.info("Fetching connections for user", extra={"user_id": current_user.id})
    connections = crud.get_connections(db=db, user_id=current_user.id)
    app.logger.info("Successfully fetched connections for user", extra={"user_id": current_user.id, "connection_count": len(connections)})
    return connections

@app.get("/dashboard", response_model=schemas.Dashboard)
async def get_dashboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
    as_of_date: datetime | None = Query(None, description="Filter data as of this date. Latest data if not provided.")
):
    app.logger.info("Fetching dashboard data for user", extra={"user_id": current_user.id, "as_of_date": as_of_date})
    user_connections = crud.get_connections(db, current_user.id)
    if not user_connections:
        app.logger.info("No connections found for user, returning empty dashboard", extra={"user_id": current_user.id})
        return schemas.Dashboard(institutions=[], grand_total=0.0)

    aggregated_data: Dict[str, schemas.Institution] = {}
    grand_total = 0.0

    configuration = snaptrade_client.Configuration()
    configuration.client_id = settings.SNAPTRADE_CLIENT_ID
    configuration.consumer_key = settings.SNAPTRADE_CLIENT_SECRET
    
    snaptrade_transactions_api = snaptrade_client.TransactionsApi(snaptrade_client.ApiClient(configuration))

    for connection in user_connections:
        app.logger.debug("Processing connection for dashboard", extra={"user_id": current_user.id, "connection_id": connection.id})
        if connection.status != "active":
            app.logger.info("Skipping inactive connection for dashboard", extra={"user_id": current_user.id, "connection_id": connection.id, "status": connection.status})
            continue # Skip inactive connections

        cache_key = f"user_{current_user.id}_connection_{connection.id}_accounts"
        cached_data = cache.get(cache_key)
        
        snaptrade_accounts = []
        if cached_data:
            app.logger.debug("Serving accounts from cache", extra={"user_id": current_user.id, "connection_id": connection.id})
            snaptrade_accounts = cached_data
        else:
            try:
                app.logger.info("Fetching accounts from SnapTrade API", extra={"user_id": current_user.id, "connection_id": connection.id})
                # Fetch accounts from SnapTrade
                snaptrade_response = snaptrade_transactions_api.get_all_user_accounts(
                    user_id=str(current_user.id),
                    user_secret=security.create_user_secret(current_user.id),
                    holdings=True # We need holdings to get balances
                )
                snaptrade_accounts = snaptrade_response.accounts
                cache.set(cache_key, snaptrade_accounts, ttl=300) # Cache for 5 minutes
                app.logger.info("Successfully fetched and cached accounts from SnapTrade API", extra={"user_id": current_user.id, "connection_id": connection.id, "account_count": len(snaptrade_accounts)})
            except snaptrade_client.ApiException as e:
                app.logger.error("SnapTrade API error fetching accounts", extra={"user_id": current_user.id, "connection_id": connection.id, "error": str(e)})
                # Add an error institution to the dashboard
                aggregated_data[connection.institution_name] = schemas.Institution(
                    name=connection.institution_name,
                    accounts=[
schemas.Account(
                        masked_account_number="N/A",
                        balance=0.0,
                        currency="USD",
                        as_of_date=datetime.utcnow(),
                        last_updated=datetime.utcnow(),
                        status="Error: Failed to fetch accounts"
                    )],
                    sub_total=0.0
                )
                continue

        institution_total = 0.0
        accounts_for_institution: List[schemas.Account] = []

        for snaptrade_account in snaptrade_accounts:
            # Assuming cash is the primary balance for now, might need more complex logic for different account types
            balance_amount = snaptrade_account.cash_balance if snaptrade_account.cash_balance is not None else 0.0
            
            # For simplicity, using current time as as_of_date if not provided by SnapTrade
            # In a real scenario, SnapTrade provides balance history
            account_as_of_date = snaptrade_account.last_sync_time if snaptrade_account.last_sync_time else datetime.utcnow()

            # Apply as_of_date filter
            if as_of_date and account_as_of_date > as_of_date:
                continue

            # Mask account number
            masked_number = f"•••• {str(snaptrade_account.account_number)[-4:]}" if snaptrade_account.account_number else "N/A"

            account_schema = schemas.Account(
                masked_account_number=masked_number,
                balance=balance_amount,
                currency="USD", # Assuming USD for MVP
                as_of_date=account_as_of_date,
                last_updated=datetime.utcnow(),
                status="Active" # Assuming active for fetched accounts
            )
            accounts_for_institution.append(account_schema)
            institution_total += balance_amount
        
        if accounts_for_institution:
            aggregated_data[connection.institution_name] = schemas.Institution(
                name=connection.institution_name,
                accounts=accounts_for_institution,
                sub_total=institution_total
            )
            grand_total += institution_total

    # Sort institutions: connected first, then alphabetically
    sorted_institutions = sorted(
        aggregated_data.values(),
        key=lambda x: (x.name) # For simplicity, only sorting by name for now
    )
    app.logger.info("Successfully aggregated dashboard data", extra={"user_id": current_user.id, "grand_total": grand_total, "institution_count": len(sorted_institutions)})
    return schemas.Dashboard(institutions=sorted_institutions, grand_total=grand_total)



@app.get("/")
def read_root():
    app.logger.info("Root endpoint accessed")
    return {"Hello": "World"}