# Data Model: Account Reporting Utility

**Status**: Draft
**Date**: 2025-12-21

## Entities

### Account

Represents a user's financial account at an institution.

-   **`external_id` (String)**: Unique identifier for the account, provided by the external API (e.g., SnapTrade).
    -   *Validation*: Required, unique.
-   **`masked_account_number` (String)**: A partially obscured account number for display purposes (e.g., "••••1234").
    -   *Validation*: Required.
-   **`balance` (Decimal)**: The current balance of the account in USD.
    -   *Validation*: Required, non-negative.
-   **`as_of_date` (Date)**: The date the `balance` was valid.
    -   *Validation*: Required.
-   **`institution_id` (String)**: Foreign key referencing the `external_id` of the associated Institution.
    -   *Relationship*: Many-to-one with Institution.

### Institution

Represents a financial institution that a user can connect to.

-   **`external_id` (String)**: Unique identifier for the institution, provided by the external API (e.g., SnapTrade).
    -   *Validation*: Required, unique.
-   **`name` (String)**: The official name of the financial institution.
    -   *Validation*: Required.
-   **`connection_status` (Enum: `connected`, `disconnected`, `error`, `pending`)**: The current status of the user's connection to this institution.
    -   *Validation*: Required.

### DashboardView (Conceptual)

A consolidated view that aggregates data from multiple `Account` and `Institution` entities for display. This is a computed view, not a stored entity.

-   **Groups**: Accounts are grouped by Institution.
-   **Aggregations**: Sub-totals per institution, grand total across all institutions.
-   **Filtering**: By `as_of_date`.
-   **Sorting**: Institutions on Connections page sorted alphabetically, connected first.

## Relationships

-   An `Institution` can have many `Account`s.
-   An `Account` belongs to one `Institution`.

## Validation Rules (from `spec.md`)

-   `balance` is non-negative.
-   `external_id` for both `Account` and `Institution` are unique and required.
-   `connection_status` must be one of the defined enum values.
-   Date formats for `as_of_date` (YYYY-MM-DD)
-   Input sanitization and output escaping for all user-provided input.