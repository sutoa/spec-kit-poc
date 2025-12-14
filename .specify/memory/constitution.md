<!--
Sync Impact Report:
- Version change: 1.0.0 -> 1.1.0
- Modified principles: "II. Test-Driven Development (TDD)" (added "Verification of Code Quality" sub-point)
- Added sections: None
- Removed sections: None
- Templates requiring updates:
    - .specify/templates/plan-template.md: ✅ updated
    - .specify/templates/spec-template.md: ✅ updated
    - .specify/templates/tasks-template.md: ✅ updated
    - .specify/templates/commands/speckit.implement.md: ⚠ pending
    - .specify/templates/commands/speckit.plan.md: ✅ updated
    - .specify/templates/commands/speckit.specify.md: ✅ updated
    - .specify/templates/commands/speckit.checklist.md: ✅ updated
- Follow-up TODOs: None
-->
# Account Viewer Constitution

## Core Principles

### I. Simplicity and Maintainability
- Code must be clear, concise, and easy to understand.
- Prioritize maintainability and long-term viability over short-term gains.

### II. Test-Driven Development (TDD)
- **Mandatory Testing**: All new features and bug fixes, for both backend and frontend components, *must* be accompanied by a comprehensive suite of tests.
- **Test Coverage**: Strive for high test coverage, especially for critical business logic, API endpoints, and complex UI components.
- **Test Types**: Implement unit tests for individual functions/components, integration tests for component interactions and API flows, and end-to-end (E2E) tests for critical user journeys.
- **TDD Workflow**: Adopt a Test-Driven Development approach: write failing tests *before* writing the code necessary to make them pass, then refactor.
- **Verification of Code Quality**: For frontend implementations, `npm run build` MUST be executed to ensure successful compilation and catch build-time errors before considering a task complete.

### III. User Experience (UX) Focus
- Design decisions must prioritize a seamless and intuitive user experience.
- Accessibility standards must be met for all user-facing components.

### IV. Performance Optimization
- Applications must be optimized for speed and responsiveness.
- Performance bottlenecks should be identified and addressed proactively.

## Development Workflow

All development will follow a trunk-based development model. Code changes are introduced through Pull Requests (PRs) from feature branches. Each PR must be reviewed and approved by at least one other developer before being merged. Automated CI/CD pipelines (using GitHub Actions) will be used to run linters, tests, and builds on every PR to maintain code quality.

## Quality & Maintainability

Code must adhere to a strict style guide enforced by Prettier and ESLint. All public APIs, complex business logic, and component props must be documented using JSDoc. The goal is to create a self-documenting, clean, and easily navigable codebase that can be scaled effectively.

## Governance

This constitution serves as the foundational guide for all technical decisions. Any proposed deviation must be documented in a Request for Comments (RFC), reviewed by the team, and formally approved before implementation. The guiding principle is to favor simplicity and adhere to these standards unless a compelling, long-term benefit for a deviation can be proven.

**Version**: 1.1.0 | **Ratified**: 2025-11-26 | **Last Amended**: 2025-12-13