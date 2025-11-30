# Quickstart: Account Reporting Utility

This guide provides the steps to set up and run the project locally for development.

## Prerequisites

-   Python 3.11+
-   Node.js 18+ and npm
-   An account with SnapTrade to get API credentials.

## 1. Backend Setup

### Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: `requirements.txt` will be created during implementation)*

### Configuration

1.  Create a `.env` file in the `backend` directory.
2.  Add your SnapTrade API credentials to the `.env` file:
    ```
    SNAPTRADE_CLIENT_ID=your_client_id
    SNAPTRADE_CLIENT_SECRET=your_client_secret
    ```

### Running the Backend

1.  **Start the FastAPI server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`.

## 2. Frontend Setup

### Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(Note: The React project will be set up during implementation)*

### Running the Frontend

1.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## 3. Database

The backend uses SQLite for local development. The database file (`development.db`) will be created automatically in the `backend` directory when the application is first run.
