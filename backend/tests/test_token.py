import pytest
from backend.app import models, schemas, crud # Keep models, schemas, crud for object creation

def test_token_endpoint(mock_httpx_clients, client, db_session, test_user): # Added mock_httpx_clients
    # The _ from mock_httpx_clients is not used directly in this test, but needed for fixture dependency
    _, _ = mock_httpx_clients

    login_data = {"username": test_user.username, "password": "testpassword"} # Use test_user's credentials
    response = client.post("/token", data=login_data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
