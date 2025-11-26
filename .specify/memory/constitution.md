# Account Viewer Constitution

## Core Principles

### I. Component-Driven & Design System-Centric UI
The user interface will be constructed from a library of reusable, independently testable components, managed and visualized using Storybook. A utility-first CSS framework like Tailwind CSS will be used for styling to ensure consistency, scalability, and a "sleek" aesthetic without custom CSS bloat.

### II. Decoupled Architecture & API-First Design
The application will be split into two distinct parts: a frontend client and a backend API server. All communication between them will occur over a well-defined RESTful or GraphQL API. This separation allows for independent development, deployment, and scaling.

### III. Comprehensive Automated Testing
To ensure reliability and ease of maintenance, a multi-layered testing strategy is mandatory. This includes unit tests for individual functions and components (using Vitest/Jest & React Testing Library), integration tests for API endpoints, and end-to-end tests for critical user flows (using Playwright or Cypress).

### IV. Predictable State Management
The frontend will utilize a centralized state management library (e.g., Zustand or Redux Toolkit) to handle global application state. This ensures data flows in a unidirectional and predictable manner, simplifying debugging and scaling the complexity of the UI.

### V. Simplicity instead of Over Engineering. 
An easy to maintain and grow codebase for the application is a MUST.

## Development Workflow

All development will follow a trunk-based development model. Code changes are introduced through Pull Requests (PRs) from feature branches. Each PR must be reviewed and approved by at least one other developer before being merged. Automated CI/CD pipelines (using GitHub Actions) will be used to run linters, tests, and builds on every PR to maintain code quality.

## Quality & Maintainability

Code must adhere to a strict style guide enforced by Prettier and ESLint. All public APIs, complex business logic, and component props must be documented using JSDoc. The goal is to create a self-documenting, clean, and easily navigable codebase that can be scaled effectively.

## Governance

This constitution serves as the foundational guide for all technical decisions. Any proposed deviation must be documented in a Request for Comments (RFC), reviewed by the team, and formally approved before implementation. The guiding principle is to favor simplicity and adhere to these standards unless a compelling, long-term benefit for a deviation can be proven.

**Version**: 1.0.0 | **Ratified**: 2025-11-26 | **Last Amended**: 2025-11-26