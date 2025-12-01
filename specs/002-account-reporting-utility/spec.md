# Feature Specification: Account Reporting Utility

**Feature Branch**: `002-account-reporting-utility`  
**Created**: November 28, 2025  
**Status**: Draft  
**Input**: User description: "Amendment to specs - In the landing page, there should be a left panel with manuals such as Dashboard and Connections. - when the 'Dashboard' is clicked in the left panel, in the right panel i expect to see a filter section. - for the MVP - I should be able to filter by the as-of date field. Note this is optional. If no date is provided, then the as-of date is the latest. - There should also be a refresh button or icon, once clicked it should retrieve the account info from the list of connected institutions and display them with account number, balance amount, actual as-of date. Accounts should be grouped at institution level with subtotal and a grand total as well. - post MVP, I will want to include a list of checkboxes for institutes in the filter section in addition to the as-of date - when the 'Connection' is clicked in the left panel, I would like to see a list of institutions(as listed above) in the right panel, each with a connect icon and a status icon. for unconnected institues, I can click on the 'Connect' icon and be prompted to provide the credential to connect"

## User Scenarios & Testing

### User Story 1 - View Consolidated Account Dashboard (Priority: P1)

A user wants to view a consolidated report of their financial accounts. They navigate to the "Dashboard", which initially displays an empty state prompting them to connect institutions. Once institutions are connected, the dashboard displays a report of their accounts. They can optionally filter by an "as-of date" and refresh the data to get the latest information (the refresh button is disabled if there are no connected institutions). They see a clear, grouped view of their accounts, including account numbers, balances, and the actual as-of date, along with sub-totals per institution and a grand total.

**Why this priority**: This is the core value proposition of the utility, allowing users to quickly see their financial overview.

**Independent Test**: Can be fully tested by configuring at least one financial institution, navigating to the Dashboard, and observing the generated report's accuracy and format.

**Acceptance Scenarios**:

1.  **Given** the user is on the landing page, **When** they click "Dashboard" in the left navigation panel for the first time with no connections, **Then** an empty state is displayed in the right panel prompting the user to connect institutions, and the 'Refresh' button is disabled.
2.  **Given** the user is on the landing page, **When** they click "Dashboard" in the left navigation panel with connected institutions, **Then** the Dashboard view is displayed in the right panel with account data.
3.  **Given** the user is on the Dashboard view, **When** they review the report, **Then** accounts are grouped by institution, each showing account number, balance, and the actual as-of date.
4.  **Given** the user is on the Dashboard view, **When** they review the report, **Then** a sub-total is shown for each institution group and a grand total for all accounts.
5.  **Given** the user is on the Dashboard view, **When** they enter a date in the "as-of date" filter and click "Refresh", **Then** the report updates to show data closest to that date.
6.  **Given** the user is on the Dashboard view, **When** they click "Refresh" without providing an "as-of date", **Then** the report updates to show the latest available data.

### User Story 2 - Manage Financial Institution Connections (Priority: P2)

A user needs to connect their financial institution accounts to the utility. They navigate to the "Connections" page, where they see a list of available institutions, each with its connection status. They can initiate a new connection by clicking a "Connect" icon, which prompts them for the necessary credentials.

**Why this priority**: This directly enables the P1 user story by providing the necessary data sources.

**Independent Test**: Can be fully tested by navigating to the Connections page, clicking "Connect" for an institution, and verifying the system initiates an authentication flow and appropriately handles success or failure.

**Acceptance Scenarios**:

1.  **Given** the user is on the landing page, **When** they click "Connections" in the left navigation panel, **Then** a list of financial institutions is displayed in the right panel.
2.  **Given** the user is viewing the list of institutions, **When** they look at an institution, **Then** a status icon and text indicates whether it is connected, disconnected, or has a connection error.
3.  **Given** an institution is not connected, **When** the user clicks the "Connect" icon next to it, **Then** they are prompted to provide credentials to establish a connection.
4.  **Given** a connection attempt fails (e.g., due to incorrect credentials), **When** the system processes the attempt, **Then** a specific error message is displayed to the user, and the institution's status in the Connections list reflects the failure.

### User Story 3 - Prioritize Cost-Effective Data Retrieval (Priority: P3)

The user wants the system to prioritize minimizing the cost of API calls for data retrieval, opting for free services whenever possible.

**Why this priority**: This is a critical non-functional requirement that impacts the sustainability of the utility.

**Independent Test**: Can be verified by reviewing the system's integration configuration to ensure it prioritizes free or low-cost data sources.

**Acceptance Scenarios**:

1.  **Given** the system needs to retrieve account data, **When** multiple API options exist for an institution, **Then** the system attempts to use the most cost-effective option first.

### Edge Cases

-   What happens when no account data is found for a selected institution for the specified "as-of date"?
    **Clarification**: For accounts with no data for the as-of date, "N/A" or "No data available" will be displayed for balance and balance date.
-   How does the system handle an API call failure for a financial institution (e.g., temporary outage, rate limiting)?
    **Clarification**: The system will display the institution name in the report but show an error message (e.g., "Failed to retrieve data") instead of account details and totals.
-   What if the "as-of date" is in the future or significantly older than available historical data?
    **Clarification**: For accounts with no data on or before the as-of date, "N/A" or "No data available" will be displayed for balance and balance date.

## Requirements

### UI/UX Requirements

The user interface and user experience MUST be implemented to be a "pixel-perfect" match of the provided mockups.

-   **Mockups Location**: `specs/002-account-reporting-utility/screens/`
-   **Styling**: The implementation MUST use Tailwind CSS and the color palette, fonts, and dark mode conventions defined in the mockup `code.html` files.

#### UI-001: Main Application Layout
-   **Reference**: `screens/dashboard_tab/screen.png`, `screens/connection_tab/screen.png`
-   The application MUST feature a primary layout with a collapsible left-side navigation panel and a main content area.
-   The left navigation panel MUST contain links with icons for "Dashboard", "Connections", "Settings", and "Logout".
-   The active navigation link MUST be visually distinct, as shown in the mockups (e.g., background color and filled icon).

#### UI-002: Header
-   **Reference**: `screens/dashboard_tab/screen.png`, `screens/connection_tab/screen.png`
-   A header bar MUST be present at the top of the main content area.
-   The header MUST display the current page's title (e.g., "Connection", "Consolidated Account Report").
-   The header on the Connections page MUST include icons for "Notifications" and "Help", and a circular user avatar.
-   The header on the Dashboard page MUST include "Export Report" and "Refresh Data" buttons, and a circular user avatar.

#### UI-003: Connections Page
-   **Reference**: `screens/connection_tab/screen.png`, `screens/connection_tab/code.html`
-   The page MUST feature a main title ("Manage Financial Institutions") and a subtitle.
-   An "Add New Connection" button MUST be present.
-   A search bar MUST be available to filter institutions.
-   Institutions MUST be displayed in a grid of cards.
-   Each card MUST display the institution's logo, name, and a "more_vert" (three-dot) menu icon.
-   The card MUST display the connection status, including a colored dot (e.g., green for "Connected") and status text.

#### UI-004: Dashboard Page
-   **Reference**: `screens/dashboard_tab/screen.png`, `screens/dashboard_tab/code.html`
-   The main content area MUST be divided into a left-side "Filters" panel and a right-side report section.
-   The "Filters" panel MUST contain an "As of Date" picker and a searchable list of institutions with checkboxes.
-   The report section MUST display high-level metrics in cards ("Grand Total", "Total Institutions").
-   The report section MUST display institution-specific data in distinct cards/tables. Each card MUST have a header with the institution's name and a sub-total.
-   Within each institution card, individual accounts MUST be listed in rows showing account details and balances, matching the multi-column layout in the mockup.

### Functional Requirements

-   **FR-001**: System MUST display a main landing page with a navigation panel on the left as per **UI-001**.
-   **FR-002**: When the "Dashboard" link is clicked, the right panel MUST display the account dashboard view as per **UI-004**.
-   **FR-003**: The dashboard view MUST contain a filter section as per **UI-004**.
-   **FR-004**: The filter section MUST include an optional "as-of date" input field. If no date is provided, the system defaults to the latest available data.
-   **FR-005**: The dashboard header MUST include a "Refresh Data" button as per **UI-002**.
-   **FR-006**: Clicking the "Refresh Data" button MUST trigger a retrieval of account information and update the report display.
-   **FR-007**: The dashboard report MUST group accounts by financial institution in separate cards/tables as per **UI-004**.
-   **FR-008**: The report MUST include masked account number (e.g., "••••1234"), balance amount, and the 'actual as-of date' for each account, where the 'actual as-of date' is the closest date of the account information available from the institution before or on the 'as-of date' provided in the filter.
-   **FR-009**: The report MUST display a sub-total for each financial institution group and a grand total for all accounts, as shown in **UI-004**.
-   **FR-010**: When the "Connections" link is clicked, the right panel MUST display a list of financial institutions as per **UI-003**.
-   **FR-011**: Each institution in the list MUST have a visual status icon (colored dot) and text indicating its connection status (e.g., connected, disconnected, error with a specific message if available), as shown in the `ConnectionCard` design.
-   **FR-012**: Each institution card MUST have a "more_vert" (three-dot) menu.
-   **FR-013**: For an unconnected institution, when the user clicks the "more_vert" menu, it MUST present a "Connect" option. Clicking "Connect" MUST initiate the secure authentication flow for that institution.
-   **FR-014**: System MUST securely handle user credentials by leveraging a third-party aggregator's secure authentication flow.
-   **FR-015**: System SHOULD prioritize free API services for data retrieval whenever possible.
-   **FR-016**: The dashboard MUST initially display an empty state prompting the user to connect institutions if no connections exist.
-   **FR-017**: The 'Refresh Data' button on the dashboard MUST be disabled if no institutions are connected.
-   **FR-018**: When a connection attempt fails, the system MUST display a specific error message to the user, and the institution's status in the Connections list MUST be updated to reflect the failure.
-   **FR-019**: The dashboard report MUST display actual balance amounts and institution names as retrieved from the connected financial institutions.
-   **FR-020**: The system MUST implement a JWT-based authentication system using short-lived access tokens (e.g., 15 minutes expiration) and long-lived refresh tokens. The backend MUST generate and validate these tokens, and the frontend MUST manage their refresh securely.
-   **FR-021**: The backend MUST implement anti-CSRF token validation for all state-changing API endpoints.
-   **FR-022**: The system MUST sanitize all user-provided input and escape all data before rendering it in the UI to prevent XSS attacks.
-   **FR-023**: The application MUST utilize secure HTTP headers, including a strict Content Security Policy (CSP), to mitigate XSS and other injection attacks.
-   **FR-024**: If cookies are used for session management, they MUST be configured with `HttpOnly`, `Secure`, and `SameSite=Strict` flags.
-   **FR-025**: For the MVP, the application MUST be designed for desktop browsers only; mobile and tablet support are explicitly out of scope.
-   **FR-026**: The application MUST adhere to the Principle of Least Privilege by requesting only essential account information (balance amounts and their associated as-of dates) from SnapTrade.
-   **FR-027**: The list of financial institutions on the 'Connections' page MUST be sorted alphabetically by institution name, with all connected institutions appearing before disconnected institutions.
-   **FR-028**: The 'actual as-of date' displayed on the dashboard for account balances MUST use the `YYYY-MM-DD` format (e.g., `2025-11-30`).
-   **FR-029**: While dashboard data is being loaded, the UI MUST display a skeleton loader that mimics the final report table layout.
-   **FR-030**: All application data, especially sensitive user and financial information, MUST be encrypted in transit using TLS 1.2+ and encrypted at rest within the database.
-   **FR-031**: The Connections page MUST have an "Add New Connection" button that, when clicked, initiates a connection flow.
-   **FR-032**: The Connections page MUST feature a search bar that filters the list of displayed institutions in real-time as the user types.

### Out of Scope / Post-MVP

-   A list of checkboxes for institutions in the dashboard filter section will be implemented post-MVP. For the MVP, the dashboard will report on all connected institutions.
-   API rate limiting (e.g., per-user or IP-based limits) will be deferred to a future release.
-   Validating the authenticity of SnapTrade callbacks (e.g., via signature checking) is deferred to a future release. **[CRITICAL RISK - ACCEPTED]**: This introduces a security vulnerability where a malicious actor could spoof callback requests.

### Assumptions

-   **ASM-001**: For the initial version, the system assumes all connected financial accounts are denominated in United States Dollars (USD).

### Key Entities

-   **Account**: Represents a financial account. Key attributes include: masked account number, balance, as-of date, and associated institution.
-   **Institution**: Represents a financial institution. Key attributes include: name and connection status.
-   **Dashboard**: A consolidated view of account information.

## Success Criteria

### Measurable Outcomes

-   **SC-001**: From the landing page, a user can navigate to the Dashboard and view a consolidated report for all connected institutions within 10 seconds (initial load). Subsequent refreshes without changing the "as-of date" filter should complete within 3 seconds.
-   **SC-002**: The dashboard report accurately displays account numbers, balances, and as-of dates, with correct sub-totals and a grand total for 100% of reported accounts.
-   **SC-003**: From the Connections page, a user can successfully initiate a connection process for at least 3 specified financial institutions.
-   **SC-004**: The system minimizes the use of paid APIs, favoring cost-effective solutions for at least 80% of integrated institutions.

## Clarifications

### Session 2025-11-30
- Q: What should the dashboard display when a user views it for the very first time? → A: An empty state that instructs the user to go to the "Connections" page to add an institution. The 'Refresh' button should be disabled if there is no active connection.
- Q: On the "Connections" page, if a user tries to connect to a new institution and the authentication fails, how should the failure be communicated? → A: Display a specific error message reflecting the failure. The status for that institution in the Connection tab should also reflect the failure with the message.
- Q: What exactly does "actual as-of date" mean for an account balance in the report? → A: The closest date of the account information available from the institution before or on the as-of date provided in the filter.
- Q: Should subsequent refreshes of the dashboard report have a faster performance expectation than the initial load? → A: Yes, subsequent refreshes without changing the "as-of date" filter should be significantly faster (e.g., under 3 seconds).
- Q: Besides masking account numbers, are there any other data privacy requirements for the information displayed on the dashboard? → A: Display actual balance amounts and institution names as retrieved.
- Q: What should the lifecycle for user authentication tokens (JWTs) be? → A: Short-lived access tokens (e.g., 15 minutes) with a long-lived refresh token mechanism.
- Q: What are the primary mechanisms we should implement to prevent CSRF and XSS vulnerabilities in the application? → A: A combination of CSRF tokens, input/output sanitization, and secure cookie/token handling (including HttpOnly cookies and a Content Security Policy).
- Q: What is the requirement for responsive design on smaller screens (tablet and mobile)? → A: Desktop Only. Mobile and tablet support are not required for the MVP and can be deferred.
- Q: Should we implement rate limiting on the API, and if so, what should the limits be? → A: No rate limiting required for the MVP. Defer this requirement for a future release.
- Q: What is the explicit scope of data we should request from SnapTrade? → A: Request only account information that consists of balance in USD amount, the as-of date of the balance.
- Q: How should the list of financial institutions on the 'Connections' page be sorted? → A: Alphabetically by institution name, with connected institutions listed first.
- Q: What date format should be used when displaying the 'actual as-of date' on the dashboard? → A: `YYYY-MM-DD`.
- Q: How should the authenticity of callbacks from SnapTrade be validated? → A: No explicit validation is required for the MVP. The user accepts the associated security risk for the initial release.

### Session 2025-11-28
- Q: How should the report display an institution if its data cannot be fetched (e.g., API is down or credentials failed)? → A: Display the institution name in the report but show an error message (e.g., "Failed to retrieve data") instead of account details and totals.
- Q: How should the application handle authentication for data retrieval sessions? → A: Leverage the third-party aggregator's (SnapTrade) secure authentication flow, where the user authenticates directly with the aggregator via a redirect, and the aggregator manages the connection securely.
- Q: What should be displayed for an account if there is no balance available on or before the selected "as-of date"? → A: Display "N/A" or "No data available" for the balance and balance date for that specific account.
- Q: How should account numbers be displayed in the report? → A: Mask the account number (e.g., "••••1234").
- Q: What level of logging is required for the application? → A: Log all requests and responses for auditing purposes.