# Backend Application (FastAPI)

This directory contains the FastAPI backend application for the Account Viewer.

## Setup

1.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the `backend/` directory with the following variables.
    *Replace `YOUR_PLAID_CLIENT_ID` and `YOUR_PLAID_SECRET` with your actual Plaid API credentials.*
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/account_viewer
    ENCRYPTION_KEY=<generated_fernet_key>
    PLAID_CLIENT_ID=YOUR_PLAID_CLIENT_ID
    PLAID_SECRET=YOUR_PLAID_SECRET
    PLAID_ENV=sandbox # or development, production
    ```
    You can generate a Fernet key using Python:
    ```python
    from cryptography.fernet import Fernet
    print(Fernet.generate_key().decode())
    ```

## Database Migrations

This project uses Alembic for database migrations.

1.  **Ensure PostgreSQL is running** (e.g., via `docker-compose up -d` from the project root).
2.  **Apply migrations:**
    ```bash
    alembic upgrade head
    ```

## Running the Application

1.  **Ensure PostgreSQL is running** (e.g., `docker-compose up -d`).
2.  **Run the FastAPI application:**
    ```bash
    uvicorn src.main:app --reload
    ```
    The API documentation will be available at `http://127.0.0.1:8000/docs`.

## Running Tests

1.  **Ensure PostgreSQL is running**.
2.  **Run pytest:**
    ```bash
    pytest tests/
    ```
