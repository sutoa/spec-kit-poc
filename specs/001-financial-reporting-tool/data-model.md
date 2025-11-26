# Data Model

This document describes the key data entities for the Consolidated Financial Account Viewer, primarily based on the data structures provided by the Plaid API.

## Core Entities

### User
Represents the individual using the application. This is an internal concept in our application and is not directly represented in Plaid's model for our use case.

- **id**: string (unique identifier for the user)

### Item
Represents a login to a financial institution. This is a core entity in Plaid's system.

- **id**: string (unique identifier for the item)
- **institution_id**: string (identifier for the financial institution)
- **access_token**: string (stored securely in our backend, used to fetch data for this item)

### Institution
Represents a financial institution that Plaid supports.

- **id**: string (unique identifier for the institution)
- **name**: string (e.g., "Fidelity")
- **logo**: string (URL to the institution's logo)

### Account
Represents a financial account associated with an `Item`.

- **id**: string (unique identifier for the account)
- **item_id**: string (foreign key to the Item)
- **name**: string (e.g., "Brokerage Account")
- **mask**: string (last 4 digits of the account number)
- **type**: string (e.g., "brokerage", "401k")
- **subtype**: string (e.g., "individual", "ira")
- **balance**: number (current balance)
- **balance_as_of**: date (date of the balance)

## Relationships

- A `User` can have multiple `Items`. (Implicit relationship, managed by our application)
- An `Item` belongs to one `Institution`.
- An `Item` can have multiple `Accounts`.

## State Transitions

1.  **Initiate Link**: The user indicates they want to link a new financial institution.
2.  **Get Link Token**: The backend requests a `link_token` from the Plaid API.
3.  **User Links Account**: The frontend uses the `link_token` to initialize the Plaid Link UI. The user selects their institution and enters their credentials.
4.  **Exchange Public Token**: Plaid Link provides a `public_token`. The frontend sends this to the backend.
5.  **Get Access Token**: The backend exchanges the `public_token` for an `access_token` and an `item_id`. The `access_token` is stored securely.
6.  **Fetch Account Data**: The backend can now use the `access_token` to fetch account information for the `Item`.

## Validation Rules

- All validation of financial institution credentials is handled by Plaid.
- Our backend must validate that the `public_token` received from the frontend is not empty before attempting to exchange it.
- The `access_token` must be stored securely and never exposed to the frontend.