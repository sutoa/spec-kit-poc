# Tasks: Account Reporting Utility

**Input**: Design documents from `/specs/002-account-reporting-utility/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are included as per the TDD principle in the project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **backend/**: Python FastAPI application
- **frontend/**: React TypeScript application

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both frontend and backend.

- [ ] T001 Create project directories: `backend/` and `frontend/`
- [ ] T002 [P] In `backend/`, initialize Python virtual environment and `requirements.txt`
- [ ] T003 [P] In `frontend/`, initialize a new React + TypeScript project using Vite
- [ ] T004 [P] In `frontend/`, install core dependencies: `npm install @mui/material @emotion/react @emotion/styled axios`
- [ ] T005 [P] In `backend/`, create basic FastAPI app structure in `backend/app/main.py`
- [ ] T006 [P] In `frontend/`, create basic folder structure: `src/components/`, `src/pages/`, `src/services/`
- [ ] T007 Configure `.env` file handling in `backend/app/config.py` for SnapTrade credentials

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T008 [P] In `backend/`, implement `User` model in `backend/app/models.py` and database table setup in `backend/app/database.py`
- [ ] T009 [P] In `backend/`, implement JWT-based authentication logic in `backend/app/security.py`
- [ ] T010 Implement user registration and `/token` login endpoints in `backend/app/main.py`
- [ ] T011 [P] In `frontend/`, implement a secure token storage and retrieval mechanism in `frontend/src/services/authService.ts`
- [ ] T012 [P] In `frontend/`, create a basic App layout component with a left navigation panel and main content area in `frontend/src/App.tsx`
- [ ] T013 [P] In `frontend/`, set up basic routing for `/dashboard` and `/connections` pages in `frontend/src/App.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 2 - Manage Financial Institution Connections (Priority: P2)

**Goal**: Allow users to connect their financial institution accounts to the application.
**Independent Test**: A user can navigate to the 'Connections' page, see a list of institutions, and initiate a connection flow that successfully creates a connection record in the database upon completion.

### Tests for User Story 2
- [ ] T014 [P] [US2] Write an integration test for the `/connections/connect` and `/connections/callback` flow in `backend/tests/test_connections.py`

### Implementation for User Story 2
- [ ] T015 [P] [US2] Implement `Connection` model in `backend/app/models.py` and update database setup
- [ ] T016 [US2] Implement `/connections/connect` endpoint in `backend/app/main.py` to generate the SnapTrade redirect URL
- [ ] T017 [US2] Implement `/connections/callback` endpoint in `backend/app/main.py` to handle SnapTrade authorization and save the connection
- [ ] T018 [US2] Implement `/connections` endpoint in `backend/app/main.py` to list a user's connections with their status
- [ ] T019 [P] [US2] In `frontend/`, create the `ConnectionsPage` component in `frontend/src/pages/ConnectionsPage.tsx`
- [ ] T020 [P] [US2] In `frontend/`, create an API client function to fetch the list of connections in `frontend/src/services/api.ts`
- [ ] T021 [US2] Implement the UI in `frontend/src/pages/ConnectionsPage.tsx` to display institutions, status icons, and 'Connect' buttons
- [ ] T022 [US2] Implement the frontend logic to handle the redirect to SnapTrade when 'Connect' is clicked

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently.

---

## Phase 4: User Story 1 - View Consolidated Account Dashboard (Priority: P1) 🎯 MVP

**Goal**: Display a consolidated report of a user's financial accounts from all connected institutions.
**Independent Test**: After connecting at least one institution, a user can navigate to the 'Dashboard' and see their accounts grouped by institution with correct balances and totals.

### Tests for User Story 1
- [ ] T023 [P] [US1] Write an integration test for the `/dashboard` endpoint in `backend/tests/test_dashboard.py`

### Implementation for User Story 1
- [ ] T024 [P] [US1] Implement `Account` model for caching in `backend/app/models.py` and update database setup
- [ ] T025 [P] [US1] Implement in-memory caching logic in the backend (`backend/app/cache.py`) for financial data
- [ ] T026 [US1] Implement the `/dashboard` endpoint in `backend/app/main.py`, including logic to fetch from SnapTrade, update the cache, and aggregate data
- [ ] T027 [P] [US1] In `frontend/`, create the `DashboardPage` component in `frontend/src/pages/DashboardPage.tsx`
- [ ] T028 [P] [US1] In `frontend/`, create the `ReportTable` and `FilterSection` components in `frontend/src/components/`
- [ ] T029 [US1] Implement the initial empty state UI in `frontend/src/pages/DashboardPage.tsx` per `Spec §FR-016`
- [ ] T030 [US1] Implement API client function to fetch dashboard data in `frontend/src/services/api.ts`
- [ ] T031 [US1] Implement UI in `frontend/src/pages/DashboardPage.tsx` to display the filter section and the report table with grouped data and totals
- [ ] T032 [US1] Implement frontend logic to disable the 'Refresh' button if no connections exist, per `Spec §FR-017`

**Checkpoint**: All user stories for the MVP should now be independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T033 [P] Write comprehensive README.md files for `backend/` and `frontend/`
- [ ] T034 Implement detailed, structured logging for all backend endpoints
- [ ] T035 [P] Implement comprehensive frontend error handling and user-facing notifications
- [ ] T036 Conduct a final review against the `security.md` and `general-review.md` checklists

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Phase 5)**: Depends on all user stories being complete.

### User Story Dependencies
- **User Story 2 (P2)**: Can start after Foundational. This is a prerequisite for US1.
- **User Story 1 (P1)**: Depends on User Story 2 completion.

### Within Each User Story
- **Backend**: Models → Services/Endpoints → Tests
- **Frontend**: Services → Components → Pages

---

## Implementation Strategy

### MVP First
The Minimum Viable Product (MVP) consists of completing all tasks for **User Story 2** and then all tasks for **User Story 1**.

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 2 (Manage Connections)
4. **STOP and VALIDATE**: Ensure users can create connections successfully.
5. Complete Phase 4: User Story 1 (View Dashboard)
6. **STOP and VALIDATE**: Ensure the dashboard displays data correctly.
7. Complete Phase 5: Polish
8. Deploy MVP.
