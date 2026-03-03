# Project Folder Structure Explained

This document explains the purpose of each folder in your Next.js project and what files or features should be placed inside.

---

## Root Level
- **next.config.js**: Next.js configuration file.
- **tsconfig.json**: TypeScript configuration file.
- **package.json**: Project dependencies and scripts.
- **.env.local**: Environment variables (API URLs, secrets, etc.).
- **README.md**: Project overview and setup instructions.
- **structure.md**: This file, describing the folder structure.

---

## public/
Static assets served directly by Next.js.
- **images/**: Store all image files (logos, icons, etc.).
- **favicon.ico**: App favicon.
- Other static files (robots.txt, etc.).

---

## src/
Main source code folder.

### src/app/
Next.js App Router. Contains all screens/pages and their logic.
- **page.tsx**: Home/Landing page.
- **auth/**: Authentication screens (sign-in, sign-up) and related components.
  - **sign-in/page.tsx**: Sign-in screen.
  - **sign-up/page.tsx**: Sign-up screen.
  - **components/**: Auth-specific UI (forms, etc.).
- **dashboard/**: Dashboard screen and related logic.
  - **page.tsx**: Dashboard main page.
  - **components/**: Dashboard-specific UI.
  - **hooks/**: Dashboard-specific hooks.
  - **services/**: Dashboard-specific API/service logic.
- **notification/**, **profile/**, **residential/**, **commercial/**, **workers/**, **visitors/**, **vehicle/**, **luggage/**, **cp-agent/**, **bank-account/**, **employee/**, **vendor-supplier/**, **package-type/**, **phase/**, **zone/**: Each folder contains a feature screen (page.tsx) and a components/ folder for feature-specific UI.

### src/components/
Global reusable UI components (Button, Modal, Table, etc.) used across the app.

### src/hooks/
Global custom React hooks (useAuth, useDebounce, etc.) used across the app.

### src/context/
Global React Context Providers (AuthContext, ThemeContext, etc.).

### src/services/
Global API/service logic (apiClient, auth service, etc.).

### src/types/
TypeScript types and interfaces for the entire app (User, API responses, etc.).

### src/lib/
Utility/helper functions (validators, constants, fetchers, etc.).

### src/store/
Global state management (Zustand/Redux stores).

### src/styles/
Global styles and theme files (globals.css, theme.ts).

### src/config/
App-wide configuration and constants (API endpoints, app name, etc.).

---

## tests/
Unit and integration tests.
- **features/**: Feature-specific tests (e.g., auth/sign-in.test.tsx).

---

## How to Use This Structure
- Place each feature's logic, UI, and API code in its respective folder under src/app/.
- Use src/components/ for UI elements reused across multiple features.
- Store global hooks, context, services, types, and utilities in their respective folders under src/.
- Add new screens/features by creating a new folder under src/app/ with a page.tsx and components/ as needed.
- Write tests in the tests/ folder, mirroring the feature structure.

This structure keeps your codebase organized, scalable, and easy to maintain.