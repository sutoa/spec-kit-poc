# Tasks: Consolidated Financial Account Viewer

**Input**: Design documents from `/specs/001-financial-reporting-tool/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included as per the TDD (Test-Driven Development) principle mentioned in the constitution.

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
- [ ] T002 [P] Initialize Python project in `backend/` with FastAPI, Pydantic, plaid-python, and pytest
- [ ] T003 [P] Initialize React project in `frontend/` with Vite, TypeScript, react-plaid-link, and Vitest
- [ ] T004 [P] Configure linting (ESLint) and formatting (Prettier) for the frontend in `frontend/`
- [ ] T005 [P] Configure linting (e.g., ruff) and formatting (e.g., black) for the backend in `backend/`
- [ ] T006 Configure environment variable handling for Plaid API keys in `backend/.env`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented. This focuses on establishing the API communication for Plaid.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T007 [P] [Backend] Define data models for Plaid integration (LinkToken, PublicToken) in `backend/src/models/plaid.py`
- [ ] T008 [P] [Backend] Implement Plaid API client service in `backend/src/services/plaid_service.py` to manage interaction with the Plaid API
- [ ] T009 [Backend] Implement API endpoint `/api/v1/plaid/create_link_token` in `backend/src/api/plaid.py`
- [ ] T010 [Backend] Implement API endpoint `/api/v1/plaid/exchange_public_token` in `backend/src/api/plaid.py` (depends on T008)
- [ ] T011 [P] [Frontend] Create an API service module to communicate with the backend in `frontend/src/services/api.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Link Financial Accounts (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to connect my financial accounts using a secure interface so the application can retrieve my data.

**Independent Test**: A user can click a "Link Account" button, complete the Plaid Link flow, and the application silently receives and stores an access token on the backend.

### Tests for User Story 1 (Write these tests FIRST) ⚠️

- [ ] T012 [P] [US1] [Backend] Write integration test for the `/create_link_token` endpoint in `backend/tests/test_api_plaid.py`
- [ ] T013 [P] [US1] [Backend] Write integration test for the `/exchange_public_token` endpoint in `backend/tests/test_api_plaid.py`
- [ ] T014 [P] [US1] [Frontend] Write unit test for the Plaid Link component in `frontend/src/components/PlaidLink.test.tsx`

### Implementation for User Story 1

- [ ] T015 [US1] [Frontend] Create state management for Plaid Link flow (e.g., storing link token) in `frontend/src/pages/HomePage.tsx`
- [ ] T016 [US1] [Frontend] Implement a `PlaidLink` component in `frontend/src/components/PlaidLink.tsx` that uses `react-plaid-link`
- [ ] T017 [US1] [Frontend] Add a "Link New Account" button to the main UI that triggers the Plaid Link flow in `frontend/src/pages/HomePage.tsx` (depends on T016)
- [ ] T018 [US1] [Frontend] On successful Plaid Link, send the `public_token` to the backend via the service created in T011 in `frontend/src/components/PlaidLink.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional. A user can link their bank accounts.

---

## Phase 4: User Story 2 - Generate Consolidated Report (Priority: P1)

**Goal**: As a user, I want to generate a consolidated report from my linked accounts, filtered by institution and date.

**Independent Test**: After linking accounts, a user can select institutions, pick a date, click "Report", and see a correctly formatted report with totals.

### Tests for User Story 2 (Write these tests FIRST) ⚠️

- [ ] T019 [P] [US2] [Backend] Write unit test for report generation logic in `backend/tests/test_report_service.py`
- [ ] T020 [P] [US2] [Backend] Write integration test for the `/api/v1/report` endpoint in `backend/tests/test_api_report.py`
- [ ] T021 [P] [US2] [Frontend] Write unit test for the Report view component in `frontend/src/components/ReportView.test.tsx`

### Implementation for User Story 2

- [ ] T022 [P] [US2] [Backend] Define data models for the report structure (Report, InstitutionReport, Account) in `backend/src/models/report.py`
- [ ] T023 [US2] [Backend] Implement `ReportService` to fetch account data via Plaid and build the report in `backend/src/services/report_service.py` (depends on T008)
- [ ] T024 [US2] [Backend] Implement the `/api/v1/report` endpoint in `backend/src/api/report.py` (depends on T023)
- [ ] T025 [P] [US2] [Frontend] Implement the filter panel UI with institution selector and date picker in `frontend/src/components/FilterPanel.tsx`
- [ ] T026 [P] [US2] [Frontend] Implement the report display UI (`ReportView`) in `frontend/src/components/ReportView.tsx`
- [ ] T027 [US2] [Frontend] On "Report" button click, call the backend `/api/v1/report` endpoint and display the data in `ReportView` in `frontend/src/pages/HomePage.tsx`

**Checkpoint**: At this point, User Story 2 should be fully functional. A user can generate a complete report.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T028 [P] Add loading indicators for all asynchronous operations in `frontend/src/pages/HomePage.tsx`
- [ ] T029 [P] Implement comprehensive error handling and display user-friendly error messages in `frontend/src/pages/HomePage.tsx`
- [ ] T030 [P] [Backend] Add structured logging for all API endpoints in `backend/src/api/`
- [ ] T031 Review and add documentation (e.g., READMEs) for both `frontend/` and `backend/`
- [ ] T032 Validate the entire workflow as described in `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion.
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (must be able to link an account before viewing a report).
- **Polish (Phase 5)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (Link Accounts)**: Can start after Foundational (Phase 2).
- **US2 (Generate Report)**: Depends on US1. You need linked accounts to generate a report.

### Parallel Opportunities

- Most setup tasks (T002-T005) can run in parallel.
- Backend and Frontend foundational work (T007-T011) can proceed in parallel to a large extent.
- Within each user story, backend tests and frontend tests can be written in parallel.
- Within US2, the filter panel UI (T025) and report view UI (T026) can be developed in parallel with placeholder data.

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Account Linking)
4. **STOP and VALIDATE**: Ensure accounts can be linked successfully.
5. Complete Phase 4: User Story 2 (Report Generation)
6. **STOP and VALIDATE**: Ensure a report can be generated for linked accounts.
7. Complete Phase 5: Polish
8. Deploy/demo.
