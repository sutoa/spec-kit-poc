# account-viewer Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-28

## Active Technologies
- SQLite (in-memory, as a stand-in for the user-requested H2 database in a Python environment) (002-account-reporting-utility)
- Python 3.11+, TypeScript/ES2022 (002-account-reporting-utility)
- SQLite (for local development and MVP) (002-account-reporting-utility)

- Python 3.11+ (Backend), TypeScript/ES2022 (Frontend) (002-account-reporting-utility)

## Project Structure

```text
src/
tests/
```

## Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `browser_navigate` to visit each changed view
3. **Check for errors** - Run `browser_console_messages`
4**Take screen shot** - Use `browser_take_screenshot` to capture and save the screen shots
5. **Validate feature implementation** - Ensure the captured screenshots match the corresponding mockups in the specs/**/screens folder 

## Commands

PYTHONPATH=. pytest backend/tests
ruff check backend/

## Code Style

Python 3.11+ (Backend), TypeScript/ES2022 (Frontend): Follow standard conventions

## Recent Changes
- 002-account-reporting-utility: Added Python 3.11+, TypeScript/ES2022
- 002-account-reporting-utility: Added Python 3.11+, TypeScript/ES2022
- 002-account-reporting-utility: Added Python 3.11+, TypeScript/ES2022


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
