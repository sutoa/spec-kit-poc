import os
from datetime import datetime, timedelta
from plaid import Client, environments
from dotenv import load_dotenv

load_dotenv()

PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")

if PLAID_CLIENT_ID is None:
    raise ValueError("PLAID_CLIENT_ID not found in environment variables.")
if PLAID_SECRET is None:
    raise ValueError("PLAID_SECRET not found in environment variables.")

# Determine Plaid environment
if PLAID_ENV == "sandbox":
    plaid_env = environments.Sandbox
elif PLAID_ENV == "development":
    plaid_env = environments.Development
elif PLAID_ENV == "production":
    plaid_env = environments.Production
else:
    raise ValueError("PLAID_ENV must be 'sandbox', 'development', or 'production'.")

client = Client(
    client_id=PLAID_CLIENT_ID,
    secret=PLAID_SECRET,
    environment=plaid_env,
    api_version='2020-09-14'
)

class PlaidService:
    def __init__(self):
        self.client = client

    async def create_link_token(self, user_id: str):
        # In a real application, you would store this `user_id` and associate it with the link token.
        # For simplicity, we'll use it as a client_user_id.
        response = await self.client.link_token_create({
            'user': {
                'client_user_id': user_id,
            },
            'client_name': 'Account Viewer',
            'products': ['transactions'],
            'country_codes': ['US'],
            'language': 'en',
            'redirect_uri': 'http://localhost:3000/oauth-redirect', # This should be configured for your frontend
            'webhook': 'https://webhook.example.com', # Optional: for receiving asynchronous updates
        })
        return response.link_token_create_response

    async def exchange_public_token(self, public_token: str):
        response = await self.client.item_public_token_exchange(public_token)
        return response.item_public_token_exchange_response

    async def get_transactions(self, access_token: str, start_date: str = None, end_date: str = None):
        if start_date is None or end_date is None:
            today = datetime.now()
            start_date = (today - timedelta(days=30)).strftime('%Y-%m-%d')
            end_date = today.strftime('%Y-%m-%d')

        transactions_response = await self.client.transactions_get({
            'access_token': access_token,
            'start_date': start_date,
            'end_date': end_date,
        })
        return transactions_response.transactions
