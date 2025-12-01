# Frontend - React Application

This directory contains the React TypeScript frontend application for the Account Reporting Utility.

## Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configuration:**
    Create a `.env` file in this directory if you need to override the default API base URL:
    ```
    VITE_API_BASE_URL=http://localhost:8000
    ```
    (Ensure this matches your backend's running address if not default)

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

-   `src/App.tsx`: Main application component, sets up routing and layout.
-   `src/main.tsx`: Entry point for the React application.
-   `src/index.css`: Tailwind CSS imports and base styles.
-   `src/components/`: Reusable UI components (e.g., `Layout`, `SideNav`, `Header`, `ConnectionCard`, `StatCard`, `ReportTable`, `DashboardFilterPanel`).
-   `src/pages/`: Page-level components (e.g., `DashboardPage`, `ConnectionsPage`).
-   `src/services/api.ts`: API client for interacting with the backend.
-   `src/services/authService.ts`: Handles token storage and authentication related logic.
-   `tailwind.config.js`: Tailwind CSS configuration.
-   `postcss.config.js`: PostCSS configuration for Tailwind CSS.
