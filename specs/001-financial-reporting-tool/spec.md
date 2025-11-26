# Feature Specification: Consolidated Financial Account Viewer

**Feature Branch**: `001-financial-reporting-tool`  
**Created**: 2025-11-26  
**Status**: Draft  
**Input**: User description: "I'm building a SLEEk-looking, modern web-based reporting utility for me to collect account information for all my accounts with various financial institutions and present them to me in a consolidated view. There's a main landing page with a left panel that allows me to specify the filter condition. The filter should have an as-of date field. It should also have a list of financial companies that I can choose to report from. There is a 'Report' button next to the as-of date. Once clicked, I should get the report in the right Panel with a consolidated view. The view should include account number, balance in dollar amount, date of the balance closest to the as-of date for each account. Accounts should be grouped by institution as I sometimes have multiple accounts with the same institute. There should be a sub total for institution and a grand total. I have the user ID and password for each of the institutions. But I need you to figure out how to log into those companies and grab the account info , via API calls. Institutions I have accounts include - Fidelity (https://digital.fidelity.com/ftgw/digital/portfolio/positions), UBS Security (https://worklife.alight.com/ah-angular-afirst-web/#/web/ubsfinancialservicesinc./worklife-slp), and Goldman Sachs 401K (https://worklife.alight.com/ah-angular-afirst-web/#/web/goldmansachs/worklife-slp)."

## User Scenarios & Testing

### User Story 1 - View Consolidated Financial Report (Priority: P1)

As a user, I want to see a combined and filterable view of all my financial accounts, so that I can understand my financial position at a glance.

**Why this priority**: This is the core value proposition of the application, providing immediate insight into a user's aggregated financial data.

**Independent Test**: Can be fully tested by selecting institutions, an as-of date, clicking "Report", and verifying the consolidated report content, delivering a snapshot of financial health.

**Acceptance Scenarios**:

1.  **Given** I am on the main landing page, **When** I select one or more financial institutions from a list, enter an "as-of" date, provide my credentials when prompted, and click the "Report" button, **Then** a consolidated report is displayed in the right panel.
2.  **Given** a consolidated report is displayed, **When** I review the report, **Then** I see account number, balance, and date of balance closest to the "as-of" date for each account.
3.  **Given** a consolidated report is displayed, **When** I review the report, **Then** accounts are grouped by institution with sub-totals and a grand total.
4.  **Given** I am on the main landing page, **When** I select only "Fidelity" from the list of institutions and click "Report", **Then** the report panel displays accounts only from Fidelity.
5.  **Given** I am on the main landing page, **When** I enter a historical "as-of" date, **Then** the report shows balances and their closest dates reflecting that historical date.

### Edge Cases

-   What happens when an institution selected by the user does not have an available direct API, and web scraping fails or returns incomplete data? The system should clearly indicate which institutions failed to retrieve data and why.
-   How does the system handle invalid credentials entered by the user? The system should prompt for re-entry and provide clear error messages.
-   What happens if no accounts are found for a selected institution? The institution should still be listed in the report with a clear indication of "No accounts found".
-   What happens if the "as-of" date is far in the past or the future? The system should attempt to find the closest available balance date for historical data; for future dates, it should default to the most recent available data.

## Requirements

### Functional Requirements

-   **FR-001**: The system MUST provide a user interface consisting of a left filter panel and a right reporting panel.
-   **FR-002**: The filter panel MUST contain a date picker for specifying an "as-of" date.
-   **FR-003**: The filter panel MUST display a multi-select list of supported financial institutions (Fidelity, UBS Security, Goldman Sachs 401K). The URLs for these institutions are provided in the Input section.
-   **FR-004**: The filter panel MUST include a "Report" button.
-   **FR-005**: Upon clicking the "Report" button, the system MUST prompt the user for credentials (User ID and Password) for each selected financial institution. The system MUST NOT persistently store these credentials.
-   **FR-006**: The system MUST connect to the selected financial institutions to retrieve account data. The primary method will be direct API integration. If direct API integration is not available or feasible for a given institution, web scraping will be used as a fallback.
-   **FR-007**: The system MUST display a consolidated report in the right panel upon successful data retrieval.
-   **FR-008**: The report MUST list individual accounts, showing Account Number, Balance in dollar amount, and the Date of the Balance closest to the specified "as-of" date for each account.
-   **FR-009**: The report MUST group accounts by their respective financial institution.
-   **FR-010**: The report MUST display a sub-total of balances for each institution group.
-   **FR-011**: The report MUST display a grand total of all balances from all selected institutions.

### Key Entities

-   **User**: The individual interacting with the application.
-   **Financial Institution**: A supported entity like Fidelity, UBS Security, Goldman Sachs 401K. URLs for these are in the input description.
-   **Account**: A user's financial account held at a Financial Institution, characterized by Account Number, Balance, and Balance Date.
-   **Credential**: User ID and Password required for authentication with a Financial Institution (provided on-the-fly).

## Success Criteria

### Measurable Outcomes

-   **SC-001**: A user can successfully generate a consolidated report for at least two selected institutions within 60 seconds of providing credentials and clicking the "Report" button, assuming successful data retrieval.
-   **SC-002**: The displayed account balances in the report are accurate to within $0.01 of the data provided by the source institution for the specified "as-of" date.
-   **SC-003**: The user task completion rate for generating a report for pre-configured institutions (Fidelity, UBS Security, Goldman Sachs 401K) is above 95%.
-   **SC-004**: The system successfully retrieves account data from a minimum of 2 out of 3 specified financial institutions (Fidelity, UBS Security, Goldman Sachs 401K) using either direct API integration or web scraping, where APIs are available or web scraping is feasible.
-   **SC-005**: All sensitive user credentials are processed securely and not persistently stored by the application.

## Assumptions

-   The user will provide valid and current credentials for their accounts when prompted.
-   Direct APIs are the preferred method for connecting to financial institutions, but if unavailable, web scraping will be technically and legally permissible as a fallback.
-   I will perform necessary research to identify the availability of direct APIs for Fidelity, UBS Security, and Goldman Sachs 401K.
-   The "as-of" date functionality will aim to retrieve the closest available balance date from the institutions if an exact match is not possible.
-   The application will run in a modern web browser environment.