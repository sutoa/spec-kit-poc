import pytest
from unittest.mock import patch, AsyncMock
from backend.app.models import Connection
from datetime import datetime # Import datetime for created_at

def test_get_connections_empty(client, auth_headers):
    """Test fetching connections when there are none."""
    response = client.get("/connections", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_get_connections_with_data(client, db_session, test_user, auth_headers):
    """Test fetching connections when some exist."""
    conn1 = Connection(user_id=test_user.id, institution_name="Bank A", status="active", snaptrade_connection_id="snap1")
    conn2 = Connection(user_id=test_user.id, institution_name="Bank B", status="error", snaptrade_connection_id="snap2")
    db_session.add_all([conn1, conn2])
    db_session.commit()

    response = client.get("/connections", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["institution_name"] == "Bank A"
    assert data[1]["status"] == "error"
    
    db_session.delete(conn1)
    db_session.delete(conn2)
    db_session.commit()


def test_initiate_connection(mock_httpx_clients, client, auth_headers, test_user): # Added mock_httpx_clients
    """Test initiating a new connection via SnapTrade."""
    _, mock_async_client_instance = mock_httpx_clients # Get the async client mock
    mock_response = {"redirect_uri": "https://snaptrade.com/mock_login", "state": "mock_state"}
    
    # Configure the mock_async_client_instance for this specific test
    mock_async_client_instance.post.return_value.status_code = 200
    mock_async_client_instance.post.return_value.json.return_value = mock_response
    mock_async_client_instance.post.return_value.raise_for_status = AsyncMock()

    response = client.post("/connections/connect", headers=auth_headers)

    assert response.status_code == 200
    assert response.json() == mock_response
    mock_async_client_instance.post.assert_awaited_once() # Assert that the instance's post was called


@patch("backend.app.main.handle_snaptrade_callback", new_callable=AsyncMock)
def test_connection_callback(mock_handle_callback, client, db_session, test_user):
    """Test the callback endpoint for SnapTrade."""
    mock_connection = Connection(
        id=1, # Explicitly set ID
        user_id=test_user.id,
        institution_name="Newly Connected Bank",
        status="active",
        snaptrade_connection_id="new_auth_id",
        created_at=datetime.utcnow() # Explicitly set created_at
    )
    mock_handle_callback.return_value = mock_connection

    callback_data = {"authorization_id": "new_auth_id", "state": "a_valid_state_jwt"}

    response = client.post("/connections/callback", json=callback_data)

    assert response.status_code == 200
    data = response.json()
    assert data["institution_name"] == "Newly Connected Bank"
    assert data["status"] == "active"
    assert data["id"] == 1 # Assert on ID
    assert "created_at" in data # Assert created_at is present

    mock_handle_callback.assert_awaited_once()
    args, kwargs = mock_handle_callback.call_args
    assert "db" in kwargs
    assert kwargs["authorization_id"] == callback_data["authorization_id"]
    assert kwargs["state"] == callback_data["state"]


@patch("backend.app.main.handle_snaptrade_callback", new_callable=AsyncMock)
def test_connection_callback_invalid_state(mock_handle_callback, client):
    """Test the callback with an invalid state, expecting a 400 error."""
    mock_handle_callback.side_effect = ValueError("Invalid state")

    callback_data = {"authorization_id": "auth_id", "state": "invalid_state"}

    response = client.post("/connections/callback", json=callback_data)

    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid state"}