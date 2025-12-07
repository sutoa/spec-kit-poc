# Frontend - React Application

This directory contains the React frontend application for the Account Reporting Utility.

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default (check the output of the command for the exact URL).

## Project Structure

-   `src/main.tsx`: The entry point of the application.
-   `src/App.tsx`: The main application component, which sets up routing.
-   `src/pages/`: Page components for different routes (e.g., `DashboardPage`, `ConnectionsPage`, `LoginPage`).
-   `src/components/`: Reusable components used across different pages.
-   `src/services/api.ts`: An Axios instance configured for making API requests to the backend.
-   `src/context/`: React context providers for managing global state (e.g., `AuthContext`, `NotificationContext`).
-   `tailwind.config.js`: Configuration for the Tailwind CSS framework.
-   `vite.config.ts`: Configuration for the Vite build tool.

## Building for Production

To create a production build of the application:

```bash
npm run build
```

The output will be in the `dist/` directory.
