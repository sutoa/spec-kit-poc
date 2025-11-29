# Feature Specification: Account Reporting Utility

**Feature Branch**: `002-account-reporting-utility`  
**Created**: November 28, 2025  
**Status**: Draft  
**Input**: User description: "I'm building a SLEEk-looking, modern web-based reporting utility for me to collect account information for all my accounts with various financial institutions and present them to me in a consolidate view. There's a main landing page with a left panel that allows me to specify the filter condition. The filter should have an as-of date field. It should also have a list of financial companies that I can choose to report from. There is a 'Report' button next to the as-of date. Once clicked, I should get the report in the right Panel with a consolidated view. The view should include account number, balance in dollar amount, date of the balance closest to the as-of date for each account. Accounts should be grouped by institution as I sometimes have multiple accounts with the same institute. There should be a sub total for institution and a grand total. I have the user ID and password for each of the institutions. But I need you to figure out how to log into those companies and grab the account info , via API calls. Institutions I have accounts include - Fidelity, Vanguard, Janus, TRow Price, UBS Security and Goldman Sachs 401K. It's CRITICAL for me to minimize the cost of calling such APIs. So please find free services whenever possible."

## User Scenarios & Testing

### User Story 1 - View Consolidated Account Report (Priority: P1)

A user wants to view a consolidated report of their financial accounts from various institutions. They specify an "as-of date" and select the financial institutions they wish to include. After generating the report, they see a clear, grouped view of their accounts, including account numbers, balances, and the closest balance date, along with sub-totals per institution and a grand total.

**Why this priority**: This is the core value proposition of the utility, allowing users to quickly see their financial overview. Without this, the utility serves no purpose.

**Independent Test**: Can be fully tested by configuring at least one financial institution, providing credentials, selecting it, specifying a date, and observing the generated report's accuracy and format.

**Acceptance Scenarios**:

1.  **Given** the user is on the main landing page, **When** they select an "as-of date", choose one or more financial institutions, and click "Report", **Then** a consolidated report is displayed in the right panel.
2.  **Given** a consolidated report is displayed, **When** the user reviews it, **Then** accounts are grouped by institution, each showing account number, balance, and the date of the balance closest to the "as-of date".
3.  **Given** a consolidated report is displayed, **When** the user reviews it, **Then** a sub-total is shown for each institution group and a grand total for all accounts.

### User Story 2 - Manage Financial Institution Connections (Priority: P2)

A user needs to connect their financial institution accounts to the utility so that data can be retrieved. They provide their user ID and password (or other required credentials) for each institution.

**Why this priority**: This directly enables the P1 user story by providing the necessary data sources. It is fundamental but can be developed after the reporting display mechanism is in place.

**Independent Test**: Can be fully tested by providing credentials for a single institution and verifying that the system acknowledges the successful connection without necessarily fetching data yet.

**Acceptance Scenarios**:

1.  **Given** the user wants to add a new financial institution, **When** they provide valid credentials for that institution, **Then** the system securely stores these credentials and marks the institution as connected for data retrieval.
2.  **Given** the user provides invalid credentials for an institution, **When** they attempt to connect, **Then** the system informs the user of the failed connection attempt without storing the invalid credentials.

### User Story 3 - Prioritize Cost-Effective Data Retrieval (Priority: P3)

The user wants the system to prioritize minimizing the cost of API calls for data retrieval, opting for free services whenever possible.

**Why this priority**: While not directly a user-facing feature in terms of interaction, it's a critical non-functional requirement that impacts the sustainability and desirability of the utility. It can be optimized after core functionality is established.

**Independent Test**: Can be verified by integrating with multiple institutions and observing that the system attempts to use free or low-cost APIs before resorting to more expensive options, if applicable. This would require specific logging or configuration review.

**Acceptance Scenarios**:

1.  **Given** the system needs to retrieve account data, **When** multiple API options exist for an institution (e.g., free direct API, paid direct API, third-party aggregator), **Then** the system attempts to use the most cost-effective option first.

### Edge Cases

-   What happens when no account data is found for a selected institution for the specified "as-of date"?
    **Clarification**: For accounts with no data for the as-of date, "N/A" or "No data available" will be displayed for balance and balance date.
-   How does the system handle an API call failure for a financial institution (e.g., temporary outage, rate limiting)?
    **Clarification**: The system will display the institution name in the report but show an error message (e.g., "Failed to retrieve data") instead of account details and totals.
-   What if the "as-of date" is in the future or significantly older than available historical data?
    **Clarification**: For accounts with no data on or before the as-of date, "N/A" or "No data available" will be displayed for balance and balance date.
-   How does the system handle financial institutions that do not offer public APIs, or only offer paid APIs?

## Requirements

### Functional Requirements

-   **FR-001**: System MUST display a main landing page with a filter panel on the left and a report display area on the right.
-   **FR-002**: Filter panel MUST include an "as-of date" input field.
-   **FR-003**: Filter panel MUST include a selectable list of financial institutions.
-   **FR-004**: User MUST be able to select one or more financial institutions from the list.
-   **FR-005**: Filter panel MUST include a "Report" button to trigger report generation.
-   **FR-006**: System MUST present a consolidated account report in the display area upon user request.
-   **FR-007**: Consolidated report MUST group accounts by financial institution.
-   **FR-008**: Consolidated report MUST include masked account number (e.g., "••••1234"), balance in USD (or "N/A" if no data), and the date of the **last known balance on or before** the "as-of date" for each account (or "N/A" if no data).
-   **FR-009**: Consolidated report MUST display a sub-total for each financial institution group.
-   **FR-010**: Consolidated report MUST display a grand total for all accounts.
-   **FR-011**: System MUST securely handle user credentials for financial institutions by leveraging the third-party aggregator's (SnapTrade) secure authentication flow, where the user authenticates directly with the aggregator via a redirect, and the aggregator manages the connection securely.
-   **FR-012**: System MUST retrieve account information by utilizing a third-party aggregation service (e.g., Plaid, SnapTrade) which handles connections and authentication with financial institutions.
-   **FR-013**: System SHOULD prioritize free API services for data retrieval whenever possible.
-   **FR-014**: System MUST log all incoming requests and outgoing responses for auditing purposes.

### Assumptions

-   **ASM-001**: For the initial version, the system assumes all connected financial accounts are denominated in United States Dollars (USD). Accounts in other currencies will not be supported or will be ignored.

### Key Entities

-   **Account**: Represents a financial account. Key attributes include: masked account number (e.g., "••••1234"), current balance, date of balance, and associated institution.
-   **Institution**: Represents a financial institution (e.g., Fidelity, Vanguard). Key attributes include: name, and associated user credentials for API access.
-   **Report**: A consolidated view of account information, generated based on user-defined filters.

## Success Criteria

### Measurable Outcomes

-   **SC-001**: Users can successfully generate and view a consolidated report for selected institutions and a specified as-of date within 5 seconds for up to 5 institutions.
-   **SC-002**: The consolidated report accurately displays account numbers, balances, and balance dates, with correct sub-totals and a grand total for 100% of reported accounts.
-   **SC-003**: The system successfully connects and retrieves data from at least 3 specified financial institutions (e.g., Fidelity, Vanguard, TRow Price) using their APIs.
-   **SC-004**: The system minimizes the use of paid APIs for data retrieval, favoring solutions that offer the lowest cost, including free tiers of direct APIs, Open Banking APIs, or cost-effective third-party aggregation services (like Plaid or SnapTrade) for at least 80% of integrated institutions.

## Clarifications

### Session 2025-11-28
- Q: How should the report display an institution if its data cannot be fetched (e.g., API is down or credentials failed)? → A: Display the institution name in the report but show an error message (e.g., "Failed to retrieve data") instead of account details and totals.
- Q: How should the application handle authentication for data retrieval sessions? → A: Leverage the third-party aggregator's (SnapTrade) secure authentication flow, where the user authenticates directly with the aggregator via a redirect, and the aggregator manages the connection securely.
- Q: What should be displayed for an account if there is no balance available on or before the selected "as-of date"? → A: Display "N/A" or "No data available" for the balance and balance date for that specific account.
- Q: How should account numbers be displayed in the report? → A: Mask the account number (e.g., "••••1234").
- Q: What level of logging is required for the application? → A: Log all requests and responses for auditing purposes.

## Requirements