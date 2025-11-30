# Security & Data Privacy Checklist: Account Reporting Utility

**Purpose**: To validate the quality, clarity, and completeness of security and data privacy requirements for the Account Reporting Utility feature.
**Created**: 2025-11-30
**Feature**: [spec.md](spec.md)

## Authentication & Authorization

- [ ] CHK001 - Are requirements for secure user authentication (e.g., password hashing algorithm, minimum password complexity) explicitly defined? [Completeness]
- [ ] CHK002 - Are the lifecycle and storage requirements for JWT tokens (e.g., expiration, refresh mechanisms, storage location on frontend) clearly specified? [Completeness]
- [ ] CHK003 - Are authorization requirements for accessing all protected API endpoints explicitly stated? [Completeness, `contracts/openapi.yaml`]
- [ ] CHK004 - Is a clear mechanism defined for preventing Cross-Site Request Forgery (CSRF) and Cross-Site Scripting (XSS) vulnerabilities, especially concerning token handling? [Gap]

## Data Protection

- [ ] CHK005 - Are requirements for encrypting sensitive data (e.g., connection details, API keys) at rest and in transit clearly defined? [Gap]
- [ ] CHK006 - Are requirements for securely storing SnapTrade API credentials (e.g., environment variables, dedicated secret management service) explicitly stated? [Completeness, `plan.md`]
- [ ] CHK007 - Are data sanitization and validation requirements specified for all user inputs to prevent common injection attacks (e.g., SQL injection, XSS)? [Completeness]
- [ ] CHK008 - Are requirements for securing the SQLite database file in development and potential production deployment clearly defined? [Gap]

## Third-Party Integration (SnapTrade)

- [ ] CHK009 - Are requirements for validating the authenticity of callbacks from SnapTrade clearly defined to prevent spoofing? [Completeness, `contracts/openapi.yaml`]
- [ ] CHK010 - Are requirements for handling SnapTrade API key rotation, expiry, and revocation specified? [Gap]
- [ ] CHK011 - Is the scope of data requested from SnapTrade (permissions) explicitly limited to only what is necessary for the application's functionality (Principle of Least Privilege)? [Gap]

## Logging & Auditing

- [ ] CHK012 - Are specific logging requirements for security-sensitive events (e.g., successful/failed login attempts, connection additions/removals) explicitly defined, including what information to log and where? [Completeness, Spec §Clarifications]
- [ ] CHK013 - Are requirements for protecting log data from unauthorized access, tampering, and ensuring its integrity specified? [Gap]

## Error Handling & Information Disclosure

- [ ] CHK014 - Do error message requirements explicitly state that sensitive information must not be leaked to the user or logs? [Clarity, Spec §Clarifications]
- [ ] CHK015 - Are requirements for rate limiting API access specified to prevent brute-force attacks and denial-of-service? [Gap]
