# Account Reporting Utility - Backend

This document provides instructions on how to set up and run the backend of the Account Reporting Utility.

## Prerequisites

-   Python 3.11+

## Setup and Run

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**
    -   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
    -   On Windows:
        ```bash
        venv\Scripts\activate
        ```

4.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory with your SnapTrade API credentials:
    ```
    SNAPTRADE_CLIENT_ID=your_snaptrade_client_id
    SNAPTRADE_CLIENT_SECRET=your_snaptrade_consumer_key
    ```
    Replace `your_snaptrade_client_id` and `your_snaptrade_consumer_key` with your actual credentials.

6.  **Run the application:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.