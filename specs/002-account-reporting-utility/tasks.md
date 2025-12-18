# Tasks: Account Reporting Utility

This file outlines the implementation tasks for the Account Reporting Utility feature, focusing on the frontend. The tasks are generated based on the feature specification and are organized into phases for incremental development.

## Implementation Strategy

The implementation will follow a phased approach, starting with foundational components and then implementing user stories incrementally. Each user story phase is designed to be independently testable. The primary goal is to achieve a pixel-perfect implementation of the provided UI mockups.

**MVP Scope**: The Minimum Viable Product will consist of User Story 1 (Dashboard) and User Story 2 (Connections), as they are codependent.

## Dependencies

The user stories are sequential. The successful completion of the Connections page (US2) is a prerequisite for the Dashboard (US1) to display any meaningful data.

-   **US1 (Dashboard)** depends on **US2 (Connections)**

---

## Phase 1: Setup & Configuration

This phase focuses on setting up the frontend environment and installing necessary dependencies.

-   [ ] T001 Install additional frontend dependencies: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `date-fns`, and `react-day-picker`.
-   [ ] T002 Configure Tailwind CSS with the color palette and fonts specified in the mockup `code.html` files (`specs/002-account-reporting-utility/screens/dashboard_tab/code.html`).

---

## Phase 2: Foundational UI Components

This phase involves creating the core, reusable UI components that form the application's layout and are shared across different pages.

-   [ ] T003 [P] Implement the main application layout with a collapsible left-side navigation panel and a main content area in `frontend/src/components/SideNav.tsx`. This component should match the navigation section of the mockup: `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png`.
-   [ ] T004 [P] Implement the header component in `frontend/src/components/Header.tsx`. It should conditionally display titles and action buttons as seen in both mockups: `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/connection_tab/screen.png`.
-   [ ] T005 [P] Implement a generic `StatCard` component in `frontend/src/components/StatCard.tsx` for displaying key metrics like "Grand Total". See the top of the dashboard mockup: `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png`.
-   [ ] T006 [P] Create a `NotificationProvider` and context in `frontend/src/context/NotificationContext.tsx` to handle application-wide notifications.
-   [ ] T007 Implement basic routing structure in `frontend/src/App.tsx` to handle navigation between the Dashboard and Connections pages.

---

## Phase 3: User Story 2 - Manage Connections (US2)

**Goal**: Allow users to view and manage connections to financial institutions.
**Reference**: `specs/002-account-reporting-utility/screens/connection_tab/screen.png`

-   [ ] T008 [US2] Create the `ConnectionsPage` component in `frontend/src/pages/ConnectionsPage.tsx` based on `specs/002-account-reporting-utility/screens/connection_tab/screen.png`.
-   [ ] T009 [US2] Implement the main title, subtitle, "Add New Connection" button, and search bar for the Connections page within `frontend/src/pages/ConnectionsPage.tsx`, matching `specs/002-account-reporting-utility/screens/connection_tab/screen.png`.
-   [ ] T010 [US2] Create the `ConnectionCard` component in `frontend/src/components/ConnectionCard.tsx`. This card must be a pixel-perfect match of the institution cards in `specs/002-account-reporting-utility/screens/connection_tab/screen.png`, displaying the logo, name, status dot, status text, and a "more_vert" menu.
-   [ ] T011 [US2] Implement the API service call in `frontend/src/services/api.ts` to fetch the list of financial institutions from the backend.
-   [ ] T012 [US2] In `frontend/src/pages/ConnectionsPage.tsx`, fetch the list of institutions and render them in a grid of `ConnectionCard` components. The list must be sorted alphabetically, with connected institutions appearing first.
-   [ ] T013 [US2] Implement the real-time search functionality in `frontend/src/pages/ConnectionsPage.tsx` that filters the displayed institutions based on user input in the search bar.
-   [ ] T014 [US2] Implement the connection flow initiation. Clicking "Connect" from the `ConnectionCard`'s menu should trigger the SnapTrade React SDK's connection flow. This will likely be handled within `frontend/src/pages/ConnectionsPage.tsx` or a dedicated hook.
-   [ ] T015 [US2] Add a unit test for the `ConnectionCard` component in `frontend/src/components/ConnectionCard.test.tsx` to verify it renders all props correctly.
-   [ ] T016 [US2] Add an integration test for the `ConnectionsPage` in `frontend/src/pages/ConnectionsPage.test.tsx` to verify that it correctly fetches and displays a list of institutions, and that its visual presentation matches `specs/002-account-reporting-utility/screens/connection_tab/screen.png`.

---

## Phase 4: User Story 1 - View Dashboard (US1)

**Goal**: Allow users to view a consolidated report of their financial accounts.
**Reference**: `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png`

-   [ ] T017 [US1] Create the `DashboardPage` component in `frontend/src/pages/DashboardPage.tsx` based on `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png`.
-   [ ] T018 [US1] Implement the `DashboardFilterPanel` component in `frontend/src/components/DashboardFilterPanel.tsx`. This panel must contain the "As of Date" picker and a disabled placeholder for the institution checklist, matching `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png`.
-   [ ] T019 [US1] Implement the `ReportTable` component in `frontend/src/components/ReportTable.tsx`. This component will display the accounts grouped by institution, with sub-totals and a grand total, as detailed in `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png`.
-   [ ] T020 [US1] Implement the API service call in `frontend/src/services/api.ts` to fetch the consolidated account report data from the backend, including filtering by "as-of date".
-   [ ] T021 [US1] In `frontend/src/pages/DashboardPage.tsx`, integrate the `DashboardFilterPanel` and `ReportTable`. Implement the logic to fetch and display the report data when the "Refresh Data" button is clicked.
-   [ ] T022 [US1] Implement the empty state for the dashboard. If no institutions are connected, the page should display a message prompting the user to go to the Connections page, and the "Refresh Data" button in the `Header` should be disabled.
-   [ ] T023 [US1] Implement the skeleton loader. While report data is being fetched, the UI must display a skeleton loader that mimics the `ReportTable` layout. This should be implemented in `frontend/src/components/SkeletonLoader.tsx` and used in `frontend/src/pages/DashboardPage.tsx`.
-   [ ] T024 [US1] Add a unit test for the `ReportTable` component in `frontend/src/components/ReportTable.test.tsx` to verify it correctly calculates and displays totals.
-   [ ] T025 [US1] Add an integration test for the `DashboardPage` in `frontend/src/pages/DashboardPage.test.tsx` to simulate filtering and refreshing the report, and to visually confirm it matches `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png`.

---

## Phase 5: Polish & Cross-Cutting Concerns

This phase addresses final touches and system-wide concerns.

-   [ ] T026 Ensure all UI components are fully responsive for desktop screen sizes.
-   [ ] T027 [P] Review and add input sanitization to all user input fields to prevent XSS vulnerabilities.
-   [ ] T028 [P] Perform a final review of the entire frontend application against the mockups `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/connection_tab/screen.png` to ensure pixel-perfect implementation.
-   [ ] T029 Write end-to-end tests covering the flow from connecting an institution to viewing its data on the dashboard.
