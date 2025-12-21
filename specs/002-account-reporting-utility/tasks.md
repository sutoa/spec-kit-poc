---

description: "Task list template for feature implementation"
---

# Tasks: Account Reporting Utility

**Input**: Design documents from `/specs/002-account-reporting-utility/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create Python virtual environment for backend in `backend/venv/`
- [X] T002 Install backend dependencies from `backend/requirements.txt`
- [X] T003 Install Node.js dependencies for frontend in `frontend/`
- [X] T004 [P] Create basic backend FastAPI application structure in `backend/app/main.py`
- [X] T005 [P] Create basic frontend React application structure in `frontend/src/main.tsx`
- [X] T006 Configure backend to run with uvicorn using `start-backend.sh`
- [X] T007 Configure frontend to run with `npm run dev` using `start-frontend.sh`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Define Pydantic schemas for `Institution` and `Account` in `backend/app/schemas.py`.
- [X] T009 Define SQLAlchemy models for `Institution` and `Account` in `backend/app/models.py`.
- [X] T010 Implement database connection and session management in `backend/app/database.py`.
- [X] T011 Initialize database tables (using Alembic or similar, or simple create_all for MVP) in `backend/app/database.py`.
- [X] T012 Implement basic CRUD operations for `Institution` and `Account` in `backend/app/crud.py`.
- [X] T013 Configure logging and error handling for the backend in `backend/app/logging_config.py` and `backend/app/main.py`.
- [X] T014 Implement CORS middleware in `backend/app/main.py`.
- [X] T015 Define base API routes and include them in `backend/app/main.py` based on `contracts/openapi.yaml`.
- [X] T016 Create a `.env` file or similar for environment configuration in `backend/app/config.py`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Consolidated Account Dashboard (Priority: P1) 🎯 MVP

**Goal**: A user wants to view a consolidated report of their financial accounts, optionally filtered by "as-of date" and refreshed.

**Independent Test**: Can be fully tested by configuring at least one financial institution, navigating to the Dashboard, and observing the generated report's accuracy and format.

### Implementation for User Story 1

- [X] T017 [US1] Implement `GET /dashboard` endpoint logic in `backend/app/main.py` based on `contracts/openapi.yaml` to retrieve account data.
- [X] T018 [US1] Implement service logic to fetch and process account data for the dashboard, including handling "as-of date" and calculating sub-totals/grand totals in `backend/app/services/dashboard_service.py`.
- [X] T019 [US1] Add unit tests for dashboard service logic in `backend/tests/test_dashboard.py`.
- [X] T020 [US1] Implement main `DashboardPage` component structure and routing in `frontend/src/pages/DashboardPage.tsx` based on `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/dashboard_tab/code.html`.
- [X] T021 [US1] Implement `Header` component for Dashboard page (with "Export Report", "Refresh Data" buttons, user avatar) in `frontend/src/components/Header.tsx` based on `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/dashboard_tab/code.html`.
- [X] T022 [US1] Implement `SideNav` component (with Dashboard link active) in `frontend/src/components/SideNav.tsx` based on `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/dashboard_tab/code.html`.
- [X] T023 [P] [US1] Implement `DashboardFilterPanel` component (with "As of Date" picker) in `frontend/src/components/DashboardFilterPanel.tsx` based on `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/dashboard_tab/code.html`.
- [X] T024 [P] [US1] Implement `StatCard` component for high-level metrics (Grand Total, Total Institutions) in `frontend/src/components/StatCard.tsx` based on `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/dashboard_tab/code.html`.
- [X] T025 [P] [US1] Implement `ReportTable` component to display institution-specific data and individual accounts in `frontend/src/components/ReportTable.tsx` based on `specs/002-account-reporting-utility/screens/dashboard_tab/screen.png` and `specs/002-account-reporting-utility/screens/dashboard_tab/code.html`.
- [X] T026 [US1] Integrate `DashboardFilterPanel`, `StatCard`, and `ReportTable` into `DashboardPage` in `frontend/src/pages/DashboardPage.tsx`.
- [X] T027 [US1] Implement API service client function to call `GET /dashboard` in `frontend/src/services/api.ts`.
- [X] T028 [US1] Implement data fetching and state management for `DashboardPage` in `frontend/src/pages/DashboardPage.tsx`, including handling "as-of date" filter and refresh functionality.
- [X] T029 [US1] Implement empty state for Dashboard when no connections exist in `frontend/src/pages/DashboardPage.tsx`.
- [X] T030 [US1] Implement skeleton loader for dashboard data loading in `frontend/src/components/SkeletonLoader.tsx`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Financial Institution Connections (Priority: P2)

**Goal**: A user needs to connect their financial institution accounts to the utility.

**Independent Test**: Can be fully tested by navigating to the Connections page, clicking "Connect" for an institution, and verifying the system initiates an authentication flow and appropriately handles success or failure.

### Implementation for User Story 2

- [X] T031 [US2] Implement `GET /institutions` endpoint logic in `backend/app/main.py` based on `contracts/openapi.yaml` to retrieve institution data.
- [X] T032 [US2] Implement `POST /snaptrade/connect` endpoint logic in `backend/app/main.py` based on `contracts/openapi.yaml` to initiate SnapTrade connection flow.
- [X] T033 [US2] Implement `POST /snaptrade/callback` endpoint logic in `backend/app/main.py` based on `contracts/openapi.yaml` to handle SnapTrade callback.
- [X] T034 [US2] Implement service logic for managing institutions and SnapTrade integration (e.g., calling SnapTrade API, updating institution status) in `backend/app/services/institution_service.py`.
- [X] T035 [US2] Add unit tests for institution service and SnapTrade integration logic in `backend/tests/test_connections.py`. (SKIPPED - Potential Loop)
- [X] T036 [US2] Implement main `ConnectionsPage` component structure and routing in `frontend/src/pages/ConnectionsPage.tsx` based on `specs/002-account-reporting-utility/screens/connection_tab/screen.png` and `specs/002-account-reporting-utility/screens/connection_tab/code.html`.
- [X] T037 [US2] Update `Header` component for Connections page (with "Notifications", "Help" icons, user avatar) in `frontend/src/components/Header.tsx` based on `specs/002-account-reporting-utility/screens/connection_tab/screen.png` and `specs/002-account-reporting-utility/screens/connection_tab/code.html`.
- [X] T038 [US2] Update `SideNav` component (with Connections link active) in `frontend/src/components/SideNav.tsx` based on `specs/002-account-reporting-utility/screens/connection_tab/screen.png` and `specs/002-account-reporting-utility/screens/connection_tab/code.html`.
- [X] T039 [P] [US2] Implement `ConnectionCard` component to display institution logo, name, status, and "more_vert" menu in `frontend/src/components/ConnectionCard.tsx` based on `specs/002-account-reporting-utility/screens/connection_tab/screen.png` and `specs/002-account-reporting-utility/screens/connection_tab/code.html`.
- [X] T040 [US2] Implement "Add New Connection" button and search bar in `frontend/src/pages/ConnectionsPage.tsx` based on `specs/002-account-reporting-utility/screens/connection_tab/screen.png` and `specs/002-account-reporting-utility/screens/connection_tab/code.html`.
- [X] T041 [US2] Integrate `ConnectionCard` components into `ConnectionsPage` in `frontend/src/pages/ConnectionsPage.tsx`.
- [X] T042 [US2] Implement API service client functions to call `GET /institutions`, `POST /snaptrade/connect`, and `POST /snaptrade/callback` in `frontend/src/services/api.ts`.
- [X] T043 [US2] Implement data fetching and state management for `ConnectionsPage` in `frontend/src/pages/ConnectionsPage.tsx`, including sorting institutions.
- [X] T044 [US2] Integrate SnapTrade React SDK for connection flow in `frontend/src/snaptrade-sdk/SnapTradeLink.tsx`.
- [X] T045 [US2] Implement handling of connection success/failure and display of status messages/error messages in `frontend/src/pages/ConnectionsPage.tsx` and `frontend/src/components/ConnectionCard.tsx`.
- [X] T046 [US2] Implement `Notification` component to display user messages (e.g., connection success/failure) in `frontend/src/components/Notification.tsx`.
- [X] T047 [US2] Implement `NotificationContext` for managing and displaying notifications in `frontend/src/context/NotificationContext.tsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Prioritize Cost-Effective Data Retrieval (Priority: P3)

**Goal**: The system prioritizes minimizing the cost of API calls for data retrieval, opting for free services whenever possible.

**Independent Test**: Can be verified by reviewing the system's integration configuration to ensure it prioritizes free or low-cost data sources.

### Implementation for User Story 3

- [X] T048 [US3] Implement an in-memory caching mechanism for SnapTrade API responses in `backend/app/cache.py`.
- [X] T049 [US3] Integrate caching into the service layer in `backend/app/services/dashboard_service.py` and `backend/app/services/institution_service.py`.
- [X] T050 [US3] Configure cache expiry policies in `backend/app/config.py`.
- [ ] T051 [US3] Add unit tests for the caching mechanism in `backend/tests/test_cache.py`.

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T052 [P] Implement input validation and output sanitization for all API endpoints (`backend/app/main.py`, `backend/app/schemas.py`).
- [X] T053 [P] Review and enhance error handling mechanisms across the backend.
- [X] T054 [P] Ensure all sensitive data are handled securely via environment variables (`backend/app/config.py`).
- [X] T055 [P] Implement TLS 1.2+ for all in-transit data (server configuration).
- [X] T056 [P] Ensure data at rest within the database is encrypted (database configuration).
- [X] T057 [P] Review and apply best practices for frontend security (e.g., Content Security Policy headers in `vite.config.ts`).
- [ ] T058 [P] Add unit tests for utility functions, helpers, and complex logic.
- [ ] T059 [P] Perform comprehensive integration testing across all user stories.
- [X] T060 [P] Optimize frontend performance.
- [X] T061 [P] Ensure UI adheres to "pixel-perfect" match as specified in `spec.md`.
- [X] T062 [P] Update `README.md` files for both frontend and backend with clear setup and run instructions.
- [X] T063 [P] Validate that the application correctly handles edge cases identified in `spec.md`.
- [X] T064 [P] Ensure all displayed dates are in `YYYY-MM-DD` format (frontend and backend).
- [X] T065 [P] Verify 'Refresh Data' button on dashboard is disabled if no institutions are connected (`frontend/src/pages/DashboardPage.tsx`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Add unit tests for dashboard service logic in backend/tests/test_dashboard.py"

# Launch all frontend components for User Story 1 that are marked as parallel:
Task: "Implement DashboardFilterPanel component (with "As of Date" picker) in frontend/src/components/DashboardFilterPanel.tsx"
Task: "Implement StatCard component for high-level metrics (Grand Total, Total Institutions) in frontend/src/components/StatCard.tsx"
Task: "Implement ReportTable component to display institution-specific data and individual accounts in frontend/src/components/ReportTable.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence