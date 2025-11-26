# Research & Decisions: Financial Data Aggregation

This document outlines the research findings and technical decisions for the method of connecting to financial institutions for the Consolidated Financial Account Viewer.

## 1. Financial Data Aggregation Strategy

**Decision**: Use a third-party financial data aggregation service. Plaid is the recommended choice due to its extensive documentation, broad institution support (including those managed by Alight, which covers UBS and Goldman Sachs 401k from the spec), and developer-friendly API.

**Rationale**:
- The user's request involves connecting to multiple, distinct financial institutions. Building and maintaining individual integrations or web scrapers for each is brittle, time-consuming, and complex.
- A data aggregator like Plaid abstracts away the specifics of each institution's API or login process.
- Plaid provides a secure "Link" module for handling user credentials, which aligns with the requirement not to store user passwords.
- It provides a unified API for fetching account and balance information, simplifying the backend implementation significantly.

**Risks & Mitigation**:
- **Risk**: Plaid's integration with a specific institution might be temporarily down or deprecated.
- **Mitigation**: The application will handle this gracefully by reporting the failure for that specific institution in-line in the report, as clarified in the spec.
- **Risk**: Plaid is a paid service.
- **Mitigation**: For development, Plaid offers a free Sandbox environment. For production, the cost would need to be evaluated, but it is likely far less than the cost of developing and maintaining custom integrations.

## 2. Alternatives Considered

### Alternative 1: Direct API Integration

- **Description**: Connecting directly to each financial institution's official API.
- **Rejected Because**: Most financial institutions do not offer public, developer-friendly APIs for individual customer data access. Those that do often have a prohibitive vetting process. This approach is not feasible.

### Alternative 2: Custom Web Scraping

- **Description**: Building custom web scrapers for each institution's web portal using a browser automation tool like Playwright or Selenium.
- **Rejected Because**:
    - **Brittleness**: Web scrapers break frequently due to minor UI changes on the target websites. This would create a significant maintenance burden.
    - **Complexity**: Handling logins, multi-factor authentication (MFA), and navigating modern single-page applications (SPAs) for each site is highly complex.
    - **Security**: Handling user credentials directly for scraping is a high-risk security practice.
- **Note**: While rejected as a primary strategy, web scraping could have been a last-resort fallback if no aggregator existed. However, given Plaid's existence, this alternative is not recommended.
