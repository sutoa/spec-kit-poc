# Data Model

This document defines the data structures for the Account Reporting Utility, based on the entities identified in the feature specification.

## 1. Core Entities

### 1.1. Institution

Represents a financial institution that the user has an account with.

-   **`id`**: `string` (unique identifier, e.g., "fidelity")
-   **`name`**: `string` (display name, e.g., "Fidelity")
-   **`logo_url`**: `string` (Optional, URL to the institution's logo)

**Example**:
```json
{
  "id": "fidelity",
  "name": "Fidelity",
  "logo_url": "https://example.com/logos/fidelity.png"
}
```

### 1.2. Account

Represents a single financial account held at an Institution.

-   **`id`**: `string` (unique identifier for the account)
-   **`institution_id`**: `string` (foreign key to `Institution.id`)
-   **`account_number_masked`**: `string` (masked account number, e.g., "••••1234")
-   **`balance`**: `number | null` (the monetary value of the account, or null if not available)
-   **`balance_date`**: `string | null` (ISO 8601 date string, e.g., "2025-11-28", or null if not available)

**Example**:
```json
{
  "id": "acc_123xyz",
  "institution_id": "fidelity",
  "account_number_masked": "••••5678",
  "balance": 12345.67,
  "balance_date": "2025-11-27"
}
```

## 2. Report Structures

These are not persistent database models but represent the data structures used in the API and frontend to display reports.

### 2.1. ReportRequest

Represents the user's filter criteria for generating a report.

-   **`as_of_date`**: `string` (ISO 8601 date string, e.g., "2025-11-28")
-   **`institution_ids`**: `string[]` (list of institution IDs to include in the report)

**Example**:
```json
{
  "as_of_date": "2025-11-28",
  "institution_ids": ["fidelity", "vanguard"]
}
```

### 2.2. Report

Represents the consolidated report returned to the user.

-   **`grand_total`**: `number`
-   **`institutions`**: `ReportInstitution[]` (list of institution-specific report groups)

**Example**:
```json
{
  "grand_total": 78345.67,
  "institutions": [
    {
      "id": "fidelity",
      "name": "Fidelity",
      "sub_total": 12345.67,
      "accounts": [
        {
          "account_number_masked": "••••5678",
          "balance": 12345.67,
          "balance_date": "2025-11-27"
        }
      ],
      "error": null
    },
    {
      "id": "vanguard",
      "name": "Vanguard",
      "sub_total": 66000.00,
      "accounts": [
        {
          "account_number_masked": "••••1111",
          "balance": 25000.00,
          "balance_date": "2025-11-26"
        },
        {
          "account_number_masked": "••••2222",
          "balance": 41000.00,
          "balance_date": "2025-11-28"
        }
      ],
      "error": null
    },
    {
        "id": "janus",
        "name": "Janus",
        "sub_total": 0,
        "accounts": [],
        "error": "Failed to retrieve data"
    }
  ]
}
```

### 2.3. ReportInstitution

A sub-structure within the `Report` that groups accounts by institution.

-   **`id`**: `string`
-   **`name`**: `string`
-   **`sub_total`**: `number`
-   **`accounts`**: `ReportAccount[]`
-   **`error`**: `string | null` (An error message if data retrieval failed for this institution)

### 2.4. ReportAccount

A sub-structure within `ReportInstitution` representing a single account's data for the report.

-   **`account_number_masked`**: `string`
-   **`balance`**: `number | "N/A"`
-   **`balance_date`**: `string | "N/A"`