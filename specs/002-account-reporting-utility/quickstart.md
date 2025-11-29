# Quickstart Guide

This guide provides the basic steps to get the Account Reporting Utility up and running on a local development machine.

## Prerequisites

-   **Node.js**: v18 or later
-   **Python**: 3.11 or later
-   **`pip` and `venv`** for Python package management

## 1. Backend Setup

The backend is a Python application powered by FastAPI.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies (a requirements.txt will be created)
pip install -r requirements.txt
```

### Running the Backend

With the virtual environment activated:

```bash
# Run the FastAPI development server
uvicorn src.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## 2. Frontend Setup

The frontend is a React application built with Vite.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### Running the Frontend

```bash
# Start the Vite development server
npm run dev
```

The web application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## 3. First-Time Use

1.  Start both the backend and frontend servers as described above.
2.  Open your web browser to the frontend URL.
3.  On the main page, you will see a list of available financial institutions.
4.  To connect to an institution, you will need to click a "Connect" button, which will redirect you to SnapTrade's secure authentication portal.
5.  Once connected, you can navigate back to the reporting page, select the institutions you've connected, choose an as-of date, and generate a report.