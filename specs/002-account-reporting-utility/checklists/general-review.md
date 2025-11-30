# General Review Checklist: Account Reporting Utility

**Purpose**: To validate the quality, clarity, and completeness of the requirements for the Account Reporting Utility feature before implementation.
**Created**: 2025-11-30
**Feature**: [spec.md](spec.md)

## Frontend / UX Requirements

- [ ] CHK001 - Are loading state requirements defined for the dashboard report while initial data is being fetched? [Gap]
- [ ] CHK002 - Is the specific visual styling for the disabled 'Refresh' button defined? [Clarity, Spec §FR-017]
- [ ] CHK003 - Are the specific icons and text for each connection status ('connected', 'disconnected', 'error') defined or referenced? [Clarity, Spec §FR-011]
- [ ] CHK004 - Are requirements for displaying the specific error messages on the UI clearly defined (e.g., as a toast, inline message)? [Completeness, Spec §FR-018]
- [ ] CHK005 - Is the exact copy and design for the initial empty dashboard state specified? [Clarity, Spec §FR-016]
- [ ] CHK006 - Are requirements for responsive behavior on different screen sizes (e.g., mobile, tablet) documented? [Gap]
- [ ] CHK007 - Is the user flow for handling a failed connection and re-attempting the connection process specified? [Coverage, Spec §User Story 2]
- [ ] CHK008 - Are requirements for sorting the list of institutions on the 'Connections' page defined (e.g., alphabetical, connection status)? [Gap]
- [ ] CHK009 - Is the format for displaying the 'actual as-of date' specified (e.g., 'YYYY-MM-DD', 'Month D, YYYY')? [Clarity, Spec §FR-008]

## Backend / API Requirements

- [ ] CHK010 - Are the schemas for all possible API error responses (e.g., 400, 401, 403, 404, 500) defined in the OpenAPI contract? [Completeness, `contracts/openapi.yaml`]
- [ ] CHK011 - Are data validation rules for all API inputs (query parameters, request bodies) explicitly defined? [Completeness, `contracts/openapi.yaml`]
- [ ] CHK012 - Is the caching strategy for the dashboard data, including cache duration and invalidation logic, clearly specified? [Clarity, plan.md §3]
- [ ] CHK013 - Are requirements for the JWT token lifecycle (e.g., expiration time, refresh token mechanism) defined? [Gap]
- [ ] CHK014 - Is the mechanism for securely passing and verifying the user's identity via the `state` parameter in the SnapTrade callback documented? [Clarity, `contracts/openapi.yaml`]
- [ ] CHK015 - Are specific logging requirements for auditing and debugging API calls detailed (e.g., fields to include/exclude)? [Clarity, Spec §Clarifications]
- [ ] CHK016 - Does the data model account for all fields required to be returned by the `/dashboard` and `/connections` endpoints? [Consistency, `data-model.md`, `contracts/openapi.yaml`]
- [ ] CHK017 - Is the logic for determining the 'latest' data in the absence of an 'as-of-date' filter clearly defined (e.g., latest `as_of_date` across all accounts)? [Clarity, Spec §FR-004]

## General & Consistency

- [ ] CHK018 - Have all `[NEEDS CLARIFICATION]` items from the `plan.md` been resolved in `research.md`? [Traceability, plan.md, research.md]
- [ ] CHK019 - Do the data entities and fields in `data-model.md` perfectly align with the component schemas in `contracts/openapi.yaml`? [Consistency]
- [ ] CHK020 - Can every functional requirement in `spec.md` be traced to a corresponding design component in the `plan.md` and API contract? [Traceability]
- [ ] CHK021 - Are the success criteria for performance (`SC-001`) testable with a clearly defined measurement strategy? [Measurability]
- [ ] CHK022 - Is the definition of "cost-effective" from `SC-004` specific enough to be verifiable? [Clarity, Spec §SC-004]
