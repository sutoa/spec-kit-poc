# Tasks: Account Reporting Utility

**Input**: Design documents from `/specs/002-account-reporting-utility/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, screens/

**Tests**: Test tasks are included as per the TDD principle in the project constitution.

**Organization**: Tasks are grouped by phase and user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **backend/**: Python FastAPI application
- **frontend/**: React TypeScript application

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and basic structure.

- [x] T001 Create project directories: `backend/` and `frontend/`
- [x] T002 [P] In `backend/`, initialize Python virtual environment and `requirements.txt`
- [x] T003 [P] In `frontend/`, initialize a new React + TypeScript project using Vite
- [x] T004 [P] In `frontend/`, install core dependencies: `npm install axios react-router-dom`
- [x] T005 [P] In `frontend/`, install and configure Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
- [x] T006 [P] In `backend/`, create basic FastAPI app structure in `backend/app/main.py`
- [x] T007 [P] In `frontend/`, create basic folder structure: `src/components/`, `src/pages/`, `src/services/`
- [x] T008 Configure `.env` file handling in `backend/app/config.py` for SnapTrade credentials

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**Backend**
- [x] T009 [P] In `backend/`, implement `User` model in `backend/app/models.py` and database table setup in `backend/app/database.py`
- [x] T010 [P] In `backend/`, implement JWT-based authentication logic in `backend/app/security.py`
- [x] T011 Implement user registration and `/token` login endpoints in `backend/app/main.py`

**Frontend**
- [x] T012 [P] In `frontend/`, implement a secure token storage and retrieval mechanism in `frontend/src/services/authService.ts`
- [x] T013 [P] In `frontend/`, create the main `Layout.tsx` component containing the shared `SideNav` and `Header`, based on mockups.
- [x] T014 [P] In `frontend/src/components/`, create the `SideNav.tsx` component with navigation links and icons as per the mockups.
- [x] T015 [P] In `frontend/src/components/`, create the generic `Header.tsx` component structure.
- [x] T016 In `frontend/src/App.tsx`, set up routing using `react-router-dom` to render `DashboardPage` and `ConnectionsPage` within the main `Layout`.

---

## Phase 3: User Story 2 - Manage Financial Institution Connections (P2)

**Goal**: Implement the UI and logic for managing financial connections, pixel-perfect to the mockups.

### Tests for User Story 2
- [x] T017 [P] [US2] Write an integration test for the `/connections/connect` and `/connections/callback` flow in `backend/tests/test_connections.py`

### Backend Implementation for User Story 2
- [x] T018 [P] [US2] Implement `Connection` model in `backend/app/models.py` and update database setup.
- [x] T019 [US2] Implement `/connections/connect` endpoint in `backend/app/main.py` to generate the SnapTrade redirect URL.
- [x] T020 [US2] Implement `/connections/callback` endpoint in `backend/app/main.py` to handle SnapTrade authorization and save the connection.
- [x] T021 [US2] Implement `/connections` endpoint in `backend/app/main.py` to list a user's connections with their status.

### Frontend Implementation for User Story 2
- [x] T022 [P] [US2] In `frontend/`, create an API client function to fetch the list of connections in `frontend/src/services/api.ts`.
- [x] T023 [P] [US2] Create the `ConnectionsPage.tsx` component in `frontend/src/pages/`.
- [x] T024 [US2] In `ConnectionsPage.tsx`, implement the header, title, "Add New Connection" button, and search bar as per the mockup.
- [x] T025 [P] [US2] Create the `ConnectionCard.tsx` component in `frontend/src/components/`.
- [x] T026 [US2] In `ConnectionCard.tsx`, implement the different visual states: 'Connected' (green dot), 'Disconnected' (gray dot), and 'Error' (red dot).
- [x] T027 [US2] In `ConnectionCard.tsx`, implement the "more_vert" menu. For unconnected items, this menu must show a "Connect" option.
- [x] T028 [US2] In `ConnectionsPage.tsx`, fetch and display the list of institutions using the `ConnectionCard` component.
- [x] T029 [US2] Implement the frontend logic to handle the "Connect" action from the `ConnectionCard` menu, which should call the backend to get a redirect URL.

---

## Phase 4: User Story 1 - View Consolidated Account Dashboard (P1) 🎯 MVP

**Goal**: Implement the dashboard UI and logic, pixel-perfect to the mockups.

### Tests for User Story 1
- [x] T030 [P] [US1] Write an integration test for the `/dashboard` endpoint in `backend/tests/test_dashboard.py`

### Backend Implementation for User Story 1
- [x] T031 [P] [US1] Implement `Account` model for caching in `backend/app/models.py` and update database setup.
- [x] T032 [P] [US1] Implement in-memory caching logic in the backend (`backend/app/cache.py`) for financial data.
- [x] T033 [US1] Implement the `/dashboard` endpoint in `backend/app/main.py`, including logic to fetch from SnapTrade, update cache, and aggregate data.

### Frontend Implementation for User Story 1
- [x] T034 [P] [US1] In `frontend/`, create an API client function to fetch dashboard data in `frontend/src/services/api.ts`.
- [x] T035 [P] [US1] Create the `DashboardPage.tsx` component in `frontend/src/pages/`.
- [x] T036 [US1] In `DashboardPage.tsx`, implement the three-column layout (Filters, Report, Stats) as per the mockup.
- [x] T037 [P] [US1] Create the `DashboardFilterPanel.tsx` component in `frontend/src/components/`, including the date picker and institution search/checklist.
- [x] T038 [P] [US1] Create the `StatCard.tsx` component for "Grand Total" and "Total Institutions".
- [x] T039 [P] [US1] Create the `ReportTable.tsx` component for displaying accounts grouped by institution.
- [x] T040 [US1] Implement the initial empty state UI in `DashboardPage.tsx` per `Spec §FR-016`.
- [x] T041 [US1] In `DashboardPage.tsx`, fetch and display the dashboard data using the `StatCard` and `ReportTable` components.
- [x] T042 [US1] Implement frontend logic to disable the 'Refresh Data' button if no connections exist, per `Spec §FR-017`.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T043 [P] Write comprehensive README.md files for `backend/` and `frontend/`.
- [x] T044 Implement detailed, structured logging for all backend endpoints.
- [x] T045 [P] Implement comprehensive frontend error handling and user-facing notifications.
- [x] T046 Conduct a final review against the `security-v2.md` and `general-review-v2.md` checklists.
