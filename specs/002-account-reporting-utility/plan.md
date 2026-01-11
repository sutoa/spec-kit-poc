# Implementation Plan: Account Reporting Utility

**Branch**: `002-account-reporting-utility` | **Date**: 2025-12-21 | **Spec**: `specs/002-account-reporting-utility/spec.md`
**Input**: Feature specification from `/specs/002-account-reporting-utility/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the implementation of the Account Reporting Utility. The primary requirement is to build a web application that allows a user to connect to financial institutions, and view a consolidated report of their accounts. The technical approach involves a Python/FastAPI backend and a TypeScript/React frontend. This planning effort focuses on outlining the architecture, tech stack, and task breakdown for the feature.

## Technical Context

**Language/Version**: Python 3.11+, TypeScript/ES2022
**Primary Dependencies**:
- **Backend**: FastAPI, SQLAlchemy, Uvicorn, Pydantic
- **Frontend**: React, Vite, Axios, Tailwind CSS, SnapTrade React SDK (custom implementation), `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `date-fns`, `react-day-picker`
**Storage**: SQLite (for local development and MVP)
**Testing**: Pytest (Backend), Playwright (Frontend Visual Regression), Vitest (Frontend Unit)
**Target Platform**: Desktop web browsers
**Project Type**: Web application (frontend/backend)
**Performance Goals**: Initial dashboard load < 10 seconds; subsequent refreshes < 3 seconds.
**Constraints**: MVP is for desktop browsers only. No user authentication for the application itself.
**Scale/Scope**: MVP to support < 10 institutions and < 30 accounts per user.

### UI Visual Fidelity Strategy
To ensure pixel-perfect UI/UX alignment with design mockups, a visual feedback loop will be implemented.
- **Tooling**: Playwright for browser automation and screenshot capture.
- **Mechanism for Capturing Rendered Screens**: The `playwright.config.ts` utilizes the `webServer` configuration to launch the frontend development server (`npm run dev` by default). This allows Playwright to interact with and capture screenshots of UI components within an isolated test environment. This mechanism effectively serves as the "server" for rendered screens, enabling Playwright's native screenshot capabilities for visual comparison.
- **Reference**: Snitch mockups (from `specs/**/screens`) will serve as the single source of truth for visual comparison.
- **Verification**: Frontend tasks will include a `[VISUAL LOOP]` verification step, which involves:
    1. Rendering the UI component in an isolated Playwright test environment.
    2. Capturing a screenshot of the rendered component.
    3. Performing an automated visual comparison against the corresponding Snitch mockup.
    4. Adhering to a 'Very Close' standard (5px layout tolerance) as defined in the project constitution.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

-   **I. Simplicity and Maintainability**: PASS. The chosen stack (FastAPI, React, SQLite) and MVP scope prioritize simplicity.
-   **II. Test-Driven Development (TDD)**: PASS. Testing is planned with Pytest, Vitest, and Playwright, and the spec defines acceptance criteria.
-   **III. User Experience (UX) Focus**: PASS. The specification emphasizes a "pixel-perfect" UI/UX match to mockups, directly addressing the user's feedback.
-   **IV. Performance Optimization**: PASS. Specific performance goals for dashboard load and refresh are defined in the technical context.
-   **V. UI & Visual Fidelity Standards**: PASS. Playwright is chosen for visual regression against Snitch mockups, adhering to a 5px layout tolerance.

## Project Structure

### Documentation (this feature)

```text
specs/002-account-reporting-utility/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

backend/
├── app/
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   └── services/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── snaptrade-sdk/
│   └── types/
└── tests/

**Structure Decision**: The project uses a clear `frontend` and `backend` directory structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |