# Tasks: Consolidated Financial Account Viewer

**Input**: Design documents from `/specs/001-financial-reporting-tool/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included as per the TDD (Test-Driven Development) principle in the constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Paths are based on the `frontend/` and `backend/` structure defined in `plan.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both frontend and backend.

- [ ] T001 Create project structure: `backend/src`, `backend/tests`, `frontend/src`, `frontend/tests`
- [ ] T002 [P] Initialize Python project in `backend/` with FastAPI, Pydantic, psycopg2-binary, sqlalchemy, alembic, cryptography
- [ ] T003 [P] Initialize React project in `frontend/` with Vite, TypeScript, react-plaid-link, @mui/material
- [ ] T004 [P] Configure linting and formatting for frontend and backend
- [ ] T005 [P] Create `docker-compose.yml` for PostgreSQL service
- [ ] T006 [P] Configure environment variable handling for `DATABASE_URL` and `ENCRYPTION_KEY` in `backend/.env`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for database and security that MUST be complete before user stories.

- [ ] T007 [Backend] Configure SQLAlchemy and database connection in `backend/src/database.py`
- [ ] T008 [Backend] Set up Alembic for database migrations in `backend/`
- [ ] T009 [Backend] Create an `Item` model using SQLAlchemy ORM in `backend/src/models/item.py`
- [ ] T010 [Backend] Generate initial Alembic migration for the `items` table
- [ ] T011 [P] [Backend] Implement an encryption service for tokens in `backend/src/services/security.py` using the `cryptography` library
- [ ] T012 [P] [Backend] Implement Plaid API client service in `backend/src/services/plaid_service.py`
- [ ] T013 [P] [Frontend] Create an API service module to communicate with the backend in `frontend/src/services/api.ts`

**Checkpoint**: Foundation ready. Database, security, and basic API services are in place.

---

## Phase 3: User Story 1 - Link Financial Accounts (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to connect my financial accounts so the application can retrieve my data.

**Independent Test**: User can link an account via Plaid, and a corresponding `Item` with an encrypted access token is created in the database.

### Implementation for User Story 1

- [ ] T014 [P] [US1] [Backend] Implement `/api/v1/plaid/create_link_token` endpoint in `backend/src/api/plaid.py`
- [ ] T015 [US1] [Backend] Implement `/api/v1/plaid/exchange_public_token` endpoint, ensuring it uses the security service to encrypt the token before saving to the DB in `backend/src/api/plaid.py` (depends on T011)
- [ ] T016 [P] [US1] [Frontend] Implement a `PlaidLink` component using `react-plaid-link` in `frontend/src/components/PlaidLink.tsx`
- [ ] T017 [US1] [Frontend] Add a "Link New Account" button (using Material-UI) to the main UI that triggers the Plaid Link flow in `frontend/src/pages/HomePage.tsx`
- [ ] T018 [US1] [Frontend] On Plaid success, send the `public_token` to the backend and store the returned `item_id` in `frontend/src/pages/HomePage.tsx`

**Checkpoint**: User can link accounts. `items` table is populated.

---

## Phase 4: User Story 2 - Generate Consolidated Report (Priority: P1)

**Goal**: As a user, I want to generate a report from my linked accounts, filtered by institution and date.

**Independent Test**: After linking accounts, user can generate a report and see correct, masked account data. Failed institutions appear in-line with an error.

### Implementation for User Story 2

- [ ] T019 [US2] [Backend] Implement logic to fetch an `Item` from the DB, decrypt its access token, and use it to call Plaid in `backend/src/services/report_service.py` (depends on T011)
- [ ] T020 [US2] [Backend] Implement `/api/v1/report` endpoint. It should use the report service and return data as defined in `openapi.yaml` in `backend/src/api/report.py`
- [ ] T021 [P] [US2] [Frontend] Implement filter panel UI (`FilterPanel.tsx`) with institution selector and date picker using Material-UI components.
- [ ] T022 [P] [US2] [Frontend] Implement report display UI (`ReportView.tsx`) using Material-UI components (e.g., Table, Paper). It must handle the in-line display of failed institutions.
- [ ] T023 [US2] [Frontend] On "Report" button click, call the `/api/v1/report` endpoint and display the data, ensuring account numbers are shown masked as they are received from the backend in `frontend/src/pages/HomePage.tsx`

**Checkpoint**: End-to-end MVP is functional. User can link accounts and generate a report.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements for logging, testing, and documentation.

- [ ] T024 [P] [Backend] Implement structured logging for all endpoints as per FR-013 (INFO/WARN/ERROR) in `backend/src/api/`
- [ ] T025 [P] [Frontend] Add loading indicators (e.g., Material-UI `CircularProgress`) for all async operations in `frontend/src/pages/HomePage.tsx`
- [ ] T026 [P] [Frontend] Add user-friendly error handling (e.g., Material-UI `Alert`) for API call failures in `frontend/src/pages/HomePage.tsx`
- [ ] T027 [P] [Testing] Add a test to validate report generation is completed within the 60-second performance goal (SC-001)
- [ ] T028 [P] [Testing] Add a test to verify accuracy of report balances to $0.01 (SC-002)
- [ ] T029 Review and add/update `README.md` files for both `frontend/` and `backend/`
- [ ] T030 Validate the entire workflow as described in `quickstart.md`