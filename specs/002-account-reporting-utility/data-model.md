# Data Model: Account Reporting Utility

This document defines the database schema for the application.

## 1. User

Represents a user of the application.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER | Primary Key |
| `username` | TEXT | The user's unique username. |
| `hashed_password` | TEXT | The user's hashed password. |
| `snaptrade_user_id` | TEXT | The user's ID from SnapTrade. |
| `snaptrade_user_secret` | TEXT | The user's secret from SnapTrade. |
| `created_at` | TIMESTAMP | The timestamp when the user was created. |

## 2. Connection

Represents a user's connection to a financial institution via the SnapTrade aggregator.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER | Primary Key |
| `user_id` | INTEGER | Foreign Key to the `User` table. |
| `snaptrade_connection_id` | TEXT | The unique ID for this connection from SnapTrade. |
| `institution_name` | TEXT | The name of the financial institution. |
| `status` | TEXT | The current status of the connection (e.g., 'active', 'error'). |
| `created_at` | TIMESTAMP | The timestamp when the connection was established. |

## 3. Account

Represents a specific financial account retrieved from a connection. This data is cached and not intended to be the permanent source of truth.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER | Primary Key |
| `connection_id` | INTEGER | Foreign Key to the `Connection` table. |
| `snaptrade_account_id` | TEXT | The unique ID for this account from SnapTrade. |
| `masked_account_number` | TEXT | The masked account number (e.g., '...1234'). |
| `balance` | REAL | The account balance. |
| `currency` | TEXT | The currency of the balance (e.g., 'USD'). |
| `as_of_date` | TIMESTAMP | The date the balance was recorded by the institution. |
| `last_updated` | TIMESTAMP | The timestamp when this account data was last fetched. |

## Relationships

-   A `User` can have many `Connection`s.
-   A `Connection` belongs to one `User`.
-   A `Connection` can have many `Account`s.
-   An `Account` belongs to one `Connection`.
