# Research & Decisions: Account Reporting Utility

This document summarizes the research and decisions made during Phase 0 of the planning process.

## 1. Financial Data Aggregator

The core of this project relies on a third-party service to aggregate financial data. The options considered were SnapTrade, Plaid, and Yodlee.

### Comparison

| Criteria | SnapTrade | Plaid | Yodlee |
| :--- | :--- | :--- | :--- |
| **Institution Coverage** | Strong focus on investment/brokerage accounts. Covers most requested institutions like Fidelity and other brokerages. | Excellent coverage of US banks and financial institutions (>12,000). | Most comprehensive global coverage, including banks and investments (>17,000). |
| **Pricing Model** | **Ideal for personal use.** Free tier for up to 5 connections. "Pay as you go" is $2/user/month. | Expensive for production. Limited free calls. Pay-per-call pricing with monthly minimums (~$500). | Enterprise-focused and most expensive. Very limited free tier. High scaling costs. |
| **Ease of Integration** | Good. Provides a React SDK for simple, secure iframe-based integration. | Very good. Excellent documentation and developer tools. | More complex, enterprise-oriented API. |

### Decision: SnapTrade

**Rationale**:

1.  **Cost-Effective**: SnapTrade's free tier for up to 5 connections directly meets the user's critical requirement to minimize costs for a personal utility. This is the most significant deciding factor.
2.  **Aligned Coverage**: Its focus on investment and brokerage accounts aligns well with the majority of the institutions specified by the user (Fidelity, Vanguard, etc.).
3.  **Simple Integration**: The availability of a React SDK provides a straightforward and secure method for integrating the connection portal into our chosen frontend stack.

While Plaid and Yodlee offer wider institution coverage, their pricing models are prohibitive for a personal-use project and are better suited for commercial applications.

## 2. SnapTrade Connection Method

As per the user's request, the SnapTrade connection portal documentation was reviewed.

-   **Options Considered**: Redirect, iFrame, React SDK.
-   **Decision**: Use the **SnapTrade React SDK**.
-   **Rationale**: The SDK provides the most seamless user experience by keeping the user within the application. It simplifies development by handling the iFrame implementation and providing clear callbacks for success, error, and other events, which aligns with our goal of simplicity and maintainability.

## 3. Application Stack Best Practices

-   **Frontend/Backend Interaction**: A standard token-based authentication mechanism (e.g., JWT) will be used. The frontend will include the token in the Authorization header for all API requests to the backend. The backend will handle CORS to allow requests from the frontend's domain.
-   **Data Caching**: To meet the performance requirement for fast refreshes (`<3s`), the backend will implement a caching layer.
    -   **Strategy**: An in-memory cache (like a Python dictionary or a more robust library like `cachetools`) will be used to store the results of API calls to the aggregator for a short duration (e.g., 5-10 minutes).
    -   **Justification**: This avoids making expensive, slow network calls to the aggregator on every single refresh, significantly improving responsiveness for the user while staying within the free-tier limits of the aggregator.
