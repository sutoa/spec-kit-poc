# Tasks: Account Reporting Utility

**Input**: Design documents from `/specs/002-account-reporting-utility/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification or if user requests TDD approach.

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

---
**IMPORTANT NOTE ON CURRENT FOCUS**:
As per user instruction, this task list prioritizes frontend development, specifically to ensure the Visual Loop is enforced for UI components. Backend implementation tasks (including foundational and backend-specific user story tasks) are assumed to be either already completed or sufficiently stable to support frontend development. They will only be revisited if absolutely necessary to unblock a frontend task or visual verification.
---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure based on implementation plan (Python backend, React frontend)
- [X] T002 Initialize Python backend with FastAPI, SQLAlchemy, Uvicorn, Pydantic in `backend/`
- [X] T003 Initialize TypeScript frontend with React, Vite, Axios, Tailwind CSS, SnapTrade React SDK dependencies in `frontend/`
- [X] T004 Configure linting (Ruff for Python, ESLint/Prettier for TypeScript) and formatting tools in `backend/` and `frontend/`
- [X] T005 Set up Playwright for frontend visual regression testing in `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup database (SQLite) schema and migrations framework (`backend/app/database.py`, `backend/app/models.py`)
- [ ] T007 Implement basic security considerations: input sanitization, data escaping for UI (`backend/app/security.py`, `frontend/src/utils/security.ts`)
- [ ] T008 Setup API routing and middleware structure in FastAPI (`backend/app/main.py`, `backend/app/routers/`)
- [ ] T009 Configure error handling and logging infrastructure (`backend/app/logging_config.py`)
- [ ] T010 Create base models/entities (Account, Institution) that all stories depend on (`backend/app/models.py`, `backend/app/schemas.py`, `frontend/src/types/connection.ts`, `frontend/src/types/dashboard.ts`)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Consolidated Account Dashboard (Priority: P1) 🎯 MVP

**Goal**: A user can view a consolidated report of their financial accounts, optionally filtered by an "as-of date" and refreshed, with grouped accounts, sub-totals, and a grand total.

**Independent Test**: Can be fully tested by configuring at least one financial institution, navigating to the Dashboard, and observing the generated report's accuracy and format, including UI/UX fidelity (with 5px layout tolerance).

### Implementation for User Story 1

- [ ] T011 [US1] Create backend service for dashboard data retrieval and aggregation (`backend/app/services/dashboard_service.py`)
- [ ] T012 [US1] Implement backend API endpoint for fetching dashboard data (`backend/app/routers/dashboard.py`)
- [ ] T013 [P] [US1] Implement frontend API service for dashboard data (`frontend/src/services/api.ts`)
- [ ] T014 [P] [US1] Create frontend `StatCard` component (`frontend/src/components/StatCard.tsx`)
- [ ] T015 [P] [US1] Create Playwright visual regression test for `StatCard` component (`[VISUAL LOOP]` 5px tolerance) (`frontend/tests/visual/StatCard.spec.ts`)
- [ ] T016 [P] [US1] Create frontend `ReportTable` component (`frontend/src/components/ReportTable.tsx`)
- [ ] T017 [P] [US1] Create Playwright visual regression test for `ReportTable` component (`[VISUAL LOOP]` 5px tolerance) (`frontend/tests/visual/ReportTable.spec.ts`)
- [ ] T018 [P] [US1] Create frontend `DashboardFilterPanel` component (as-of date picker, institutions checkboxes - *initially hidden/post-MVP for institutions*) (`frontend/src/components/DashboardFilterPanel.tsx`)
- [ ] T019 [P] [US1] Create Playwright visual regression test for `DashboardFilterPanel` component (`[VISUAL LOOP]` 5px tolerance) (`frontend/tests/visual/DashboardFilterPanel.spec.ts`)
- [ ] T020 [P] [US1] Create frontend `SkeletonLoader` component for dashboard data (`frontend/src/components/SkeletonLoader.tsx`)
- [ ] T021 [P] [US1] Create Playwright visual regression test for `SkeletonLoader` component (`[VISUAL LOOP]` 5px tolerance) (`frontend/tests/visual/SkeletonLoader.spec.ts`)
- [ ] T022 [US1] Implement `DashboardPage` assembling `DashboardFilterPanel`, `StatCard`s, `ReportTable`, and integrating API calls (`frontend/src/pages/DashboardPage.tsx`)
- [ ] T023 [US1] Create Playwright visual regression test for `DashboardPage` (`[VISUAL LOOP]` 5px tolerance) covering empty state, loading state, and data display (`frontend/tests/visual/DashboardPage.spec.ts`)
- [ ] T024 [P] [US1] Implement the "Refresh Data" button functionality on the dashboard, including disabling when no institutions are connected (`frontend/src/pages/DashboardPage.tsx`)
- [ ] T025 [P] [US1] Implement the empty state logic for the Dashboard page prompting users to connect institutions (`frontend/src/pages/DashboardPage.tsx`)
- [ ] T026 [P] [US1] Implement `Header` component for Dashboard page (title, export, refresh, avatar) (`frontend/src/components/Header.tsx`)
- [ ] T027 [P] [US1] Create Playwright visual regression test for `Header` component (Dashboard variant) (`[VISUAL LOOP]` 5px tolerance) (`frontend/tests/visual/HeaderDashboard.spec.ts`)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Financial Institution Connections (Priority: P2)

**Goal**: A user can connect their financial institution accounts to the utility, manage existing connections, and view their status.

**Independent Test**: Can be fully tested by navigating to the Connections page, initiating a connection, and verifying the system handles authentication flow and updates connection status correctly, including UI/UX fidelity (with 5px layout tolerance).

### Implementation for User Story 2

- [ ] T028 [US2] Create backend service for managing institution connections (`backend/app/services/institution_service.py`)
- [ ] T029 [US2] Implement backend API endpoints for fetching institutions and managing connection status (`backend/app/routers/institutions.py`)
- [ ] T030 [P] [US2] Implement frontend API service for institution data and connection management (`frontend/src/services/api.ts`)
- [ ] T031 [P] [US2] Create frontend `ConnectionCard` component (institution logo, name, status, `more_vert` menu) (`frontend/src/components/ConnectionCard.tsx`)
- [ ] T032 [P] [US2] Create Playwright visual regression test for `ConnectionCard` component (`[VISUAL LOOP]` 5px tolerance) covering different connection states (`frontend/tests/visual/ConnectionCard.spec.ts`)
- [ ] T033 [P] [US2] Implement `SideNav` component (Dashboard, Connections, Settings, Logout links) (`frontend/src/components/SideNav.tsx`)
- [ ] T034 [P] [US2] Create Playwright visual regression test for `SideNav` component (`[VISUAL LOOP]` 5px tolerance) covering active states (`frontend/tests/visual/SideNav.spec.ts`)
- [ ] T035 [P] [US2] Create frontend `Notification` component (`frontend/src/components/Notification.tsx`, `frontend/src/context/NotificationContext.tsx`)
- [ ] T036 [P] [US2] Create Playwright visual regression test for `Notification` component (`[VISUAL LOOP]` 5px tolerance) (`frontend/tests/visual/Notification.spec.ts`)
- [ ] T037 [US2] Implement `ConnectionsPage` assembling `ConnectionCard`s, "Add New Connection" button, search bar, and integrating API calls (`frontend/src/pages/ConnectionsPage.tsx`)
- [ ] T038 [US2] Create Playwright visual regression test for `ConnectionsPage` (`[VISUAL LOOP]` 5px tolerance) covering list display, search, and connection states (`frontend/tests/visual/ConnectionsPage.spec.ts`)
- [ ] T039 [P] [US2] Implement the "Add New Connection" button functionality, initiating the secure authentication flow via SnapTrade SDK (`frontend/src/pages/ConnectionsPage.tsx`)
- [ ] T040 [P] [US2] Implement the search bar functionality to filter institutions in real-time (`frontend/src/pages/ConnectionsPage.tsx`)
- [ ] T041 [P] [US2] Implement sorting logic for institutions on Connections page (connected first, then alphabetical) (`backend/app/services/institution_service.py` or `frontend/src/pages/ConnectionsPage.tsx`)
- [ ] T042 [P] [US2] Implement `Header` component for Connections page (title, notifications, help, avatar) (`frontend/src/components/Header.tsx`)
- [ ] T043 [P] [US2] Create Playwright visual regression test for `Header` component (Connections variant) (`[VISUAL LOOP]` 5px tolerance) (`frontend/tests/visual/HeaderConnections.spec.ts`)
- [ ] T044 [P] [US2] Integrate SnapTrade React SDK for connection flows (`frontend/src/snaptrade-sdk/SnapTradeLink.tsx`, `frontend/src/snaptrade-sdk/useSnapTrade.ts`)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Prioritize Cost-Effective Data Retrieval (Priority: P3)

**Goal**: The system prioritizes minimizing the cost of API calls for data retrieval, opting for free services whenever possible.

**Independent Test**: Can be verified by reviewing the system's integration configuration to ensure it prioritizes free or low-cost data sources, and by monitoring API usage.

### Implementation for User Story 3

- [ ] T045 [US3] Implement logic in backend services to prioritize cost-effective API calls for data retrieval (`backend/app/services/dashboard_service.py`, `backend/app/services/institution_service.py`)

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T046 Implement robust error handling for all API endpoints and frontend interactions
- [ ] T047 Enhance logging for all critical operations and errors across backend and frontend (`backend/app/logging_config.py`, `frontend/src/utils/logging.ts`)
- [ ] T048 [P] Code cleanup and refactoring for all components and services
- [ ] T049 [P] Ensure all frontend `npm run build` passes without errors as a "Definition of Done" criteria
- [ ] T050 Review and update documentation (`README.md`, `quickstart.md`)
- [ ] T051 Implement data encryption in transit (TLS 1.2+) for all communications (Verification of system configuration)
- [ ] T052 Implement data encryption at rest for sensitive data in SQLite (`backend/app/database.py`)
- [ ] T053 Conduct end-to-end testing for critical user journeys (Dashboard view, Connection flow)
- [ ] T054 Final verification of `quickstart.md` to ensure it's up-to-date and executable

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
Task: "Create Playwright visual regression test for StatCard component ([VISUAL LOOP] 5px tolerance) (frontend/tests/visual/StatCard.spec.ts)"
Task: "Create Playwright visual regression test for ReportTable component ([VISUAL LOOP] 5px tolerance) (frontend/tests/visual/ReportTable.spec.ts)"
Task: "Create Playwright visual regression test for DashboardFilterPanel component ([VISUAL LOOP] 5px tolerance) (frontend/tests/visual/DashboardFilterPanel.spec.ts)"
Task: "Create Playwright visual regression test for SkeletonLoader component ([VISUAL LOOP] 5px tolerance) (frontend/tests/visual/SkeletonLoader.spec.ts)"
Task: "Create Playwright visual regression test for DashboardPage ([VISUAL LOOP] 5px tolerance) covering empty state, loading state, and data display (frontend/tests/visual/DashboardPage.spec.ts)"
Task: "Create Playwright visual regression test for Header component (Dashboard variant) ([VISUAL LOOP]` 5px tolerance) (frontend/tests/visual/HeaderDashboard.spec.ts)"

# Launch all frontend API services for User Story 1 together:
Task: "Implement frontend API service for dashboard data (frontend/src/services/api.ts)"

# Launch all components for User Story 1 together (after API service is ready):
Task: "Create frontend StatCard component (frontend/src/components/StatCard.tsx)"
Task: "Create frontend ReportTable component (frontend/src/components/ReportTable.tsx)"
Task: "Create frontend DashboardFilterPanel component (as-of date picker, institutions checkboxes - *initially hidden/post-MVP for institutions*) (frontend/src/components/DashboardFilterPanel.tsx)"
Task: "Create frontend SkeletonLoader component for dashboard data (frontend/src/components/SkeletonLoader.tsx)"
Task: "Implement Header component for Dashboard page (title, export, refresh, avatar) (frontend/src/components/Header.tsx)"
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