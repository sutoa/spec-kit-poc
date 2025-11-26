# Quickstart

This guide provides the basic steps to get the Account Viewer application running locally for development.

## Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- A Plaid developer account and API keys (sandbox)
- Playwright (`pip install playwright` and `playwright install`) if web scraping fallback is needed.

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
    Create a `.env` file in the `backend` directory with your Plaid API keys:
    ```
    PLAID_CLIENT_ID=your_client_id
    PLAID_SECRET=your_secret
    PLAID_ENV=sandbox
    ```

5.  **Run the backend server:**
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
    The frontend will be running at `http://localhost:5173`.

## Running the Application

1.  Open your web browser and navigate to `http://localhost:5173`.
2.  You should see the main page of the Account Viewer.
3.  Click the "Link Account" button to initiate the Plaid Link flow.
4.  Follow the instructions in the Plaid Link modal to connect a sandbox account.
5.  Once an account is linked, you can select it and generate a report.