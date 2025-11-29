# Research & Decisions

This document outlines the research findings and subsequent technical decisions made for the Account Reporting Utility.

## 1. Data Aggregation Service: Plaid vs. SnapTrade

### Research Objective
Per the feature specification, a third-party data aggregation service is required to connect to financial institutions. The primary constraint is to minimize cost (FR-013). The two candidates considered were Plaid and SnapTrade.

### Findings

#### Plaid
- **Pricing Model**: Complex, "pay-as-you-go" model with costs broken down by product (e.g., Auth, Balance, Transactions).
- **Estimated Cost for this Use Case**:
    - **Auth** (one-time, per institution): ~$0.30 - $1.00
    - **Balance** (per request): ~$0.30
    - To get the required data (account number, balance), it would likely require an initial 'Auth' connection and then periodic 'Balance' calls. For 6 institutions, this could be a few dollars upfront and ongoing costs for data freshness.
- **Free Tier**: Plaid offers a free Sandbox environment for development but does not offer a free tier for production usage with live data.

#### SnapTrade
- **Pricing Model**: Simple, user-based subscription model.
- **Free Plan**:
    - **Cost**: $0
    - **Features**: Up to 5 brokerage connections, access to real-time data for positions, orders, and balances.
- **Pay-as-you-go Plan**:
    - **Cost**: $2 per connected user per month.
    - **Features**: Unlimited brokerage connections, unlimited API requests.

### Decision: SnapTrade

**Rationale**:
SnapTrade's **Free Plan** is the most cost-effective solution and aligns perfectly with the primary constraint of minimizing costs.

- The plan allows for up to 5 connections, which nearly covers the user's initial list of 6 institutions. This is acceptable for an MVP.
- The availability of real-time balance data is sufficient for the "as-of date" reporting requirement.
- Should the 5-connection limit be a significant issue, the $2/month "Pay-as-you-go" plan is a predictable and still very low-cost alternative.

This approach directly satisfies **SC-004** by selecting the lowest-cost option available.

## 2. Technical Stack Confirmation

### Research Objective
Confirm the technology stack based on project goals and user requests.

### Findings & Decisions

- **Backend**: **Python 3.11+ with FastAPI**. This choice aligns with the project's existing (though minimal) backend structure and provides a modern, high-performance framework for building the API.
- **Frontend**: **React with Vite and TypeScript**. This meets the user's request for a "SLEEk-looking, modern" application. Vite provides a fast development experience, and TypeScript adds valuable type safety.
- **Database**: **In-memory SQLite**. The user requested an "H2 in-mem database". Since H2 is a Java database, the Python equivalent is an in-memory SQLite database. This honors the user's intent for a simple, non-persistent database for the MVP, eliminating the need for a separate database server.

All "NEEDS CLARIFICATION" items from the `plan.md` are now resolved.