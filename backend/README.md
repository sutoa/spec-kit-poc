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
    ## Running with HTTPS (for development)

For a production-like environment, it is recommended to run the application with HTTPS. You can use `uvicorn` with SSL options:

```bash
uvicorn app.main:app --reload --ssl-keyfile ./key.pem --ssl-certfile ./cert.pem
```

You can generate a self-signed certificate for development purposes using `openssl`:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=XX/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
```

The backend will be running at `https://127.0.0.1:8000`.


## Database Encryption

For production use, it is highly recommended to encrypt the database file at rest. The default SQLite database used in this MVP is not encrypted.

You can achieve this by:
-   **File-system level encryption:** Use tools like BitLocker (Windows), FileVault (macOS), or dm-crypt (Linux).
-   **SQLite Encryption Extension (SEE):** This is a commercial extension from the SQLite developers.
-   **Other third-party libraries:** Libraries like `sqlcipher` provide a free and open-source solution for SQLite encryption. This would require changes in the application's database connection logic.