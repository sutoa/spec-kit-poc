# Security & Data Privacy Checklist v2: Account Reporting Utility

**Purpose**: To re-validate the quality and completeness of security and data privacy requirements after recent clarifications.
**Created**: 2025-11-30
**Feature**: [spec.md](spec.md)

## Authentication & Authorization

- [ ] CHK001 - Are the requirements for the JWT-based authentication system, including token expiration and the refresh mechanism, clear and sufficient for implementation? [Clarity, Spec §FR-020]
- [ ] CHK002 - Does the `plan.md` or `tasks.md` specify the secure storage mechanism for JWTs on the frontend (e.g., HttpOnly cookie, in-memory)? [Completeness]
- [ ] CHK003 - Are authorization requirements for all protected API endpoints explicitly stated and checked? [Completeness, `contracts/openapi.yaml`]
- [ ] CHK004 - Are the requirements for implementing anti-CSRF token validation sufficient for a developer to implement correctly? [Clarity, Spec §FR-021]

## Data Protection

- [ ] CHK005 - Are requirements for encrypting sensitive data at rest (e.g., in the database) and in transit (TLS) clearly defined? [Gap]
- [ ] CHK006 - Are requirements for securely storing SnapTrade API credentials (e.g., environment variables, a secrets manager) explicitly stated? [Completeness, `plan.md`]
- [ ] CHK007 - Is the requirement for input sanitization and output escaping sufficiently clear for all relevant fields and components? [Clarity, Spec §FR-022]
- [ ] CHK008 - Are requirements for securing the SQLite database file specified, particularly if it were to be used in a non-development environment? [Gap]

## Third-Party Integration (SnapTrade)

- [ ] CHK009 - Is the requirement for validating the authenticity of callbacks from SnapTrade clearly defined (e.g., checking a signature)? [Gap]
- [ ] CHK010 - Are requirements for handling SnapTrade API key rotation and expiry defined, or has this been explicitly deferred? [Gap]
- [ ] CHK011 - Does the requirement to limit the data scope from SnapTrade provide enough detail for implementation and verification? [Clarity, Spec §FR-026]

## Logging & Auditing

- [ ] CHK012 - Are specific logging requirements for security-sensitive events (e.g., successful/failed login, connection changes, token refresh) explicitly defined? [Completeness, Spec §Clarifications]
- [ ] CHK013 - Are requirements for protecting log data from unauthorized access or tampering specified? [Gap]

## Secure Configuration

- [ ] CHK014 - Is the requirement for a strict Content Security Policy (CSP) defined with enough detail to create an effective policy? [Clarity, Spec §FR-023]
- [ ] CHK015 - Is the decision to defer API rate limiting documented as an accepted risk for the MVP? [Completeness, Spec §Out of Scope]
- [ ] CHK016 - Is the requirement for using secure flags on session cookies clear and testable? [Clarity, Spec §FR-024]
