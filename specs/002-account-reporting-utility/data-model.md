# Data Model

This data model is based on the entities defined in the feature specification.

## Entities

### Institution

Represents a financial institution.

-   **id**: `integer` (primary key)
-   **external_id**: `string` (unique identifier from the external API)
-   **name**: `string`
-   **status**: `string` (one of: `connected`, `disconnected`, `error`, `pending`)

### Account

Represents a financial account.

-   **id**: `integer` (primary key)
-   **external_id**: `string` (unique identifier from the external API)
-   **masked_account_number**: `string`
-   **balance**: `float`
-   **as_of_date**: `date`
-   **institution_id**: `integer` (foreign key to `Institution.id`)

## Relationships

-   An **Institution** can have multiple **Accounts**.
-   An **Account** belongs to one **Institution**.