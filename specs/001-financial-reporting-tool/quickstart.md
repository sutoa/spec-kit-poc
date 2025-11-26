# Quickstart

This guide provides the basic steps to get the Account Viewer application running locally for development.

## Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL database)
- A Plaid developer account and API keys (sandbox)

## Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory with the following content. Replace the placeholders with your actual Plaid keys and choose a strong encryption key.

    ```env
    # Plaid API Keys
    PLAID_CLIENT_ID=your_plaid_client_id
    PLAID_SECRET=your_plaid_sandbox_secret
    PLAID_ENV=sandbox

    # Database Configuration
    DATABASE_URL="postgresql://user:password@localhost:5432/account_viewer_db"

    # Encryption Key for Access Tokens (MUST be a 32-byte URL-safe base64-encoded string)
    # You can generate one using: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
    ENCRYPTION_KEY=your_32_byte_encryption_key
    ```

5.  **Run the database:**
    From the repository root, start the PostgreSQL database using Docker Compose:
    ```bash
    docker-compose up -d
    ```

6.  **Run database migrations:**
    (Assuming Alembic is used, this step will be added once tasks are generated).
    `alembic upgrade head`

7.  **Run the backend server:**
    From the `backend` directory:
    ```bash
    uvicorn src.main:app --reload
    ```
    The backend will be running at `http://localhost:8000`.

## Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173` (or another port if 5173 is in use).

## Running the Application

1.  Ensure the database and backend server are running.
2.  Start the frontend development server.
3.  Open your web browser and navigate to `http://localhost:5173`.
4.  You should see the main page of the Account Viewer. Click "Link Account" to initiate the Plaid Link flow.
5.  Use Plaid's sandbox credentials to connect a test institution (e.g., username: `user_good`, password: `pass_good`).
6.  Once an account is linked, it will appear in the list. You can then select it and generate a report.
