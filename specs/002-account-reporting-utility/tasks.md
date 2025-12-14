# Tasks: Account Reporting Utility

This file breaks down the implementation of the Account Reporting Utility into actionable, dependency-ordered tasks.

## Implementation Strategy

The implementation will follow a phased approach, prioritizing foundational components and then building features based on user story priority. The MVP is defined as the completion of **User Story 2 (Connection Management)** and **User Story 1 (Dashboard View)**. Each user story is designed to be an independently testable increment.

## Dependencies

The completion of user stories must follow this order:

1.  **[US2] Connection Management**: Must be completed first, as the dashboard requires connected institutions to display any data.
2.  **[US1] Dashboard View**: Depends on the ability to create connections and fetch account data.

---

## Phase 1: Project Setup

These tasks focus on initializing the project structure, installing dependencies, and creating the basic scaffolding for both the frontend and backend.

- [X] T001 Create backend project structure and virtual environment in `backend/`
- [X] T002 Create `backend/requirements.txt` with initial dependencies: `fastapi`, `uvicorn[standard]`, `pydantic`, `sqlalchemy`, `python-dotenv`
- [X] T003 Run `pip install -r backend/requirements.txt`
- [X] T004 Initialize frontend React+TypeScript project using Vite in `frontend/`
- [X] T005 Run `npm install` in `frontend/` and add dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`
- [X] T006 Configure Tailwind CSS in `frontend/tailwind.config.js` and `frontend/postcss.config.js`
- [X] T007 Create initial database schema and connection logic in `backend/app/database.py`

## Phase 2: [US2] Connection Management

This phase focuses on implementing the ability for users to connect their financial institution accounts.

- [X] T008 [US2] Implement Institution and Account models in `backend/app/models.py`
- [X] T009 [US2] Implement Institution and Account schemas in `backend/app/schemas.py`
- [X] T010 [US2] Implement CRUD operations for Institutions and Accounts in `backend/app/crud.py`
- [X] T011 [US2] Implement /institutions GET endpoint in `backend/app/main.py` to list all institutions
- [X] T012 [US2] Implement /snaptrade/connect POST endpoint in `backend/app/main.py` to initiate SnapTrade connection and return the `redirect_uri`
- [X] T013 [US2] Implement /snaptrade/callback POST endpoint in `backend/app/main.py` to handle SnapTrade's success callback
- [X] T014 [US2] Create `ConnectionsPage.tsx` component in `frontend/src/pages/ConnectionsPage.tsx`
- [X] T015 [US2] Create `ConnectionCard.tsx` component in `frontend/src/components/ConnectionCard.tsx` to display institution details and status
- [X] T016 [P] [US2] Implement frontend logic in `ConnectionsPage.tsx` to fetch and display connections from the API
- [X] T017 [P] [US2] Implement frontend logic to call /snaptrade/connect and use the SnapTrade React SDK to handle the connection flow
- [X] T018 [US2] Write backend tests for Connection endpoints in `backend/tests/test_connections.py`

## Phase 3: [US1] Dashboard View

This phase implements the primary feature: the consolidated account dashboard.

- [X] T019 [US1] Implement /dashboard GET endpoint in `backend/app/main.py` to fetch, aggregate, and return account data for all connected institutions
- [X] T020 [US1] Implement caching logic in the `/dashboard` endpoint in `backend/app/cache.py`
- [X] T021 [US1] Add support for the `as_of_date` filter in the /dashboard endpoint
- [X] T022 [US1] Create `DashboardPage.tsx` component in `frontend/src/pages/DashboardPage.tsx`
- [X] T023 [US1] Create `DashboardFilterPanel.tsx` component in `frontend/src/components/DashboardFilterPanel.tsx`
- [X] T024 [P] [US1] Create `ReportTable.tsx` component in `frontend/src/components/ReportTable.tsx` to display accounts grouped by institution
- [X] T025 [P] [US1] Create `StatCard.tsx` component in `frontend/src/components/StatCard.tsx` for "Grand Total" and other metrics
- [X] T026 [US1] Implement frontend logic in `DashboardPage.tsx` to fetch and display dashboard data
- [X] T027 [US1] Implement frontend logic for the "as-of-date" filter and "Refresh" button in `DashboardPage.tsx`
- [X] T028 [US1] Display an empty state or skeleton loader in `DashboardPage.tsx` while data is loading
- [X] T029 [US1] Write backend tests for the Dashboard endpoint in `backend/tests/test_dashboard.py`

## Phase 4: Polish & Cross-Cutting Concerns

This final phase addresses UI/UX polish, error handling, and other non-functional requirements.

- [X] T030 [P] Create shared `Layout.tsx`, `SideNav.tsx`, and `Header.tsx` components in `frontend/src/components/` to match mockups
- [X] T031 [P] Implement global notification system for API errors or success messages (e.g., "Connection successful") in `frontend/src/context/NotificationContext.tsx`
- [X] T032 Implement logging middleware in `backend/app/logging_config.py`
- [X] T033 Review and ensure all UI components are a "pixel-perfect" match to the mockups in `specs/002-account-reporting-utility/screens/`
- [X] T034 Write `README.md` files for both `frontend/` and `backend/` with setup and run instructions
- [X] T035 Final validation of all acceptance criteria from `spec.md`

## Parallel Execution Examples

-   **Phase 2**: `T016` (Frontend Fetching) and `T017` (Frontend Connection Flow) can be worked on in parallel after the backend endpoints are defined.
-   **Phase 3**: `T024` (ReportTable component) and `T025` (StatCard component) can be developed in parallel.
-   **Phase 4**: `T030` (Layout components) and `T031` (Notification system) can be implemented in parallel.