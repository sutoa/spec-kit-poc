# Research & Decisions

This document outlines the research findings and technical decisions for the Consolidated Financial Account Viewer feature, updated with the latest information about the target financial institutions.

## 1. Financial Data Aggregation

**Decision**: Use a third-party financial data aggregation service. Plaid is the recommended choice due to its extensive documentation, broad institution support, and developer-friendly API.

**Rationale**:
- The new information provided shows that both "UBS Security" and "Goldman Sachs 401K" are administered through Alight. Research confirms that Plaid has integrations with many Alight-managed accounts.
- Using a data aggregator like Plaid is still the most robust and scalable approach, abstracting away the specifics of each institution.
- Direct API access is not a viable primary strategy.

**Risks & Mitigation**:
- There is a risk that Plaid's integration with the specific Alight instances for UBS and Goldman Sachs may be unstable or unavailable.
- **Mitigation**: The fallback strategy will be to use web scraping. Given that the Alight platform is a single-page application (SPA), this would require a browser automation tool like Playwright. This adds complexity and should only be pursued if the Plaid integration fails. For Fidelity, which does not use Alight, web scraping would also be the fallback.

**Alternatives considered**:
- **Direct API Integration**: Rejected due to lack of availability for individual users.
- **Custom Web Scraping (Primary)**: Rejected as a primary strategy due to its brittle nature. It is retained as a fallback.

## 2. Technology Stack

### Backend

**Decision**: Python 3.11+ with FastAPI.
**Rationale**:
- FastAPI's asynchronous support is well-suited for handling API calls to Plaid.
- The Python ecosystem provides excellent libraries for both interacting with Plaid (`plaid-python`) and for web scraping (`playwright`) if the fallback is needed.

### Frontend

**Decision**: TypeScript with React, bootstrapped with Vite.
**Rationale**:
- React is a mature and popular choice for building dynamic user interfaces.
- TypeScript provides type safety, which is valuable for an application handling financial data.
- Vite offers a superior development experience.

## 3. Data Caching

**Decision**: No server-side caching of financial data in the initial version.
**Rationale**:
- Simplicity and ensuring data freshness are the main priorities.
- The performance of Plaid's API will be monitored, and caching can be added as a future optimization if necessary.

## 4. Testing Strategy

### Backend (pytest)

- **Unit Tests**: For all business logic and data transformations.
- **Integration Tests**: Mocking the Plaid API and any web scraping targets.
- **API Tests**: Testing the FastAPI endpoints.

### Frontend (Jest/Vitest with React Testing Library)

- **Unit Tests**: For individual components and logic.
- **Integration Tests**: For component compositions and state management.
- **E2E Tests**: (Out of scope for initial build) Could be added later with a tool like Playwright, which could also be used for scraping.