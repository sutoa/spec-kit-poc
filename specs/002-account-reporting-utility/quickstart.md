# Quickstart Guide: Account Reporting Utility

This guide provides instructions to quickly set up and run the Account Reporting Utility locally.

## Prerequisites

-   Python 3.11+
-   Node.js (LTS recommended)
-   npm (Node Package Manager)
-   Git

## Setup

1.  **Clone the Repository**:
    ```bash
    git clone [repository_url]
    cd account-viewer
    ```

2.  **Backend Setup**:
    Navigate to the `backend/` directory, create a Python virtual environment, install dependencies, and run the FastAPI application.

    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
    The backend server will typically run on `http://localhost:8000`.

3.  **Frontend Setup**:
    Open a new terminal, navigate to the `frontend/` directory, install Node.js dependencies, and start the React development server.

    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173`.

## Accessing the Application

-   Once both the backend and frontend servers are running, open your web browser and navigate to `http://localhost:5173`.
-   The application will be accessible, allowing you to view the dashboard and manage connections.

## Running Tests

### Backend Tests (Python)
```bash
cd backend
pytest
```

### Frontend Tests (TypeScript/React)
```bash
cd frontend
npm test # For Vitest unit tests
npx playwright test # For Playwright visual regression tests
```

## Important Notes

-   The application uses an in-memory SQLite database for local development. Data will not persist across restarts unless explicitly configured.
-   Ensure both backend and frontend servers are running simultaneously for full application functionality.
-   For connecting to financial institutions, the application integrates with SnapTrade. You will need to interact with their authentication flow.
-   The current MVP is designed for desktop web browsers only.