# Backend - FastAPI Application

This directory contains the FastAPI backend application for the Account Reporting Utility.

## Setup

1.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configuration:**
    Create a `.env` file in this directory with your SnapTrade API credentials and JWT secret key:
    ```
    SNAPTRADE_CLIENT_ID=your_snaptrade_client_id
    SNAPTRADE_CLIENT_SECRET=your_snaptrade_client_secret
    SECRET_KEY=a_very_secret_key_for_jwt # Change this in production
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=15
    REFRESH_TOKEN_EXPIRE_DAYS=7
    ```

## Running the Application

To start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Endpoints

### Authentication

-   **POST /users/**: Register a new user.
-   **POST /token**: Obtain a JWT access token.

### Connections

-   **POST /connections/connect**: Initiate a new SnapTrade connection and get a redirect URI.
-   **POST /connections/callback**: Handle the callback from SnapTrade after user authorization.
-   **GET /connections**: Get a list of the user's connected institutions.

### Dashboard

-   **GET /dashboard**: Get the aggregated financial dashboard data.
    -   Query parameter: `as_of_date` (optional, `YYYY-MM-DD` format)

## Database

This application uses SQLite for local development, with the database file (`account_viewer.db`) created in the `backend` directory.

## Project Structure

-   `app/main.py`: Main FastAPI application, defines API endpoints.
-   `app/crud.py`: CRUD operations for database interactions.
-   `app/models.py`: SQLAlchemy models for database tables.
-   `app/schemas.py`: Pydantic schemas for request/response validation.
-   `app/security.py`: JWT token handling and password hashing.
-   `app/database.py`: Database connection and session management.
-   `app/config.py`: Application settings and environment variable loading.
-   `app/cache.py`: In-memory caching logic.
-   `requirements.txt`: Python dependencies.
