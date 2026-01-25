# Security Changes & Feature Suggestions

## Part 1: Security Changes Implementation Guide

This section outlines the security measures implemented to harden the application.

### 1. Content Security Policy (CSP)
**File**: `index.html`

A Content Security Policy (CSP) has been added to the `<head>` of the `index.html` file. This policy restricts the sources from which the browser is allowed to load resources, mitigating Cross-Site Scripting (XSS) and data injection attacks.

**Implementation Details**:
-   `default-src 'self'`: Only allow resources from the same origin by default.
-   `script-src`: Allow scripts from 'self', `cdn.tailwindcss.com`, and `esm.sh`. 'unsafe-inline' and 'unsafe-eval' are currently permitted for development tools but should be restricted in production.
-   `style-src`: Allow styles from 'self', 'unsafe-inline', and `fonts.googleapis.com`.
-   `font-src`: Allow fonts from 'self' and `fonts.gstatic.com`.
-   `connect-src`: Allow network requests to 'self', `esm.sh`, and `generativelanguage.googleapis.com` (for Gemini API).

### 2. Securing External Links
**File**: `App.tsx`

All external links (using `<a>` tags with `target="_blank"`) have been updated to include `rel="noopener noreferrer"`.
-   `noopener`: Prevents the new page from accessing the `window.opener` property, preventing it from manipulating the originating page.
-   `noreferrer`: Prevents the browser from sending the `Referer` header to the new page, protecting user privacy.

### 3. Input Validation
**File**: `components/ThresholdSettingsModal.tsx`

Input validation has been enforced in the Threshold Settings Modal to prevent invalid data submission.
-   **Validation Rules**:
    -   `Value`: Must be a positive number.
    -   `Duration`: Must be a positive integer.
-   **UX**: Users are shown an error message if they attempt to save invalid inputs, and the save action is blocked.

### 4. API Key Security Notes
**File**: `services/geminiService.ts`

**Warning**: The current implementation initializes the Google GenAI client directly in the frontend code.
-   **Risk**: If the `API_KEY` environment variable is exposed in the client-side bundle (which is common in Vite/React apps without careful config), the API key could be scraped by malicious actors.
-   **Mitigation**: A warning has been added to the service file. The recommended approach for production is to proxy these requests through a backend server so the API key never reaches the client.

---

## Part 2: Feature Suggestions for App Improvement

This section proposes features to enhance functionality, user experience, and scalability.

### 1. Data Persistence
**Goal**: Retain application state across page reloads.
**Strategy**:
-   Use `localStorage` to persist the `services` array (including their thresholds) and the `user` session.
-   On App load, hydrate the state from `localStorage` if it exists.
-   Use a `useEffect` hook to sync state changes back to `localStorage`.

### 2. Theme Customization (Dark Mode)
**Goal**: Allow users to switch between Light and Dark themes.
**Strategy**:
-   Extend `tailwind.config.js` to support `darkMode: 'class'`.
-   Create a `ThemeContext` to manage the current theme state.
-   Add a toggle button in the UI that updates the HTML class (adding/removing `dark`).
-   Update standard colors (e.g., `bg-parchment`) to have dark mode equivalents (e.g., `dark:bg-stone-900`).

### 3. Real Data Integration
**Goal**: Replace mock data with live metrics.
**Strategy**:
-   Replace `generateMockHistory` with real API calls.
-   Create a backend polling service (or use a library like `TanStack Query`) to fetch status endpoints from the actual services (`api.auth.sentinel.dev`, etc.).
-   If the monitored services don't provide health endpoints, set up a "pinger" service on the backend to check them and store the results.

### 4. Export Functionality
**Goal**: Allow users to download incident reports.
**Strategy**:
-   Add an "Export" button to the Alerts/Incidents view.
-   Generate a CSV or JSON file client-side from the `alerts` state.
-   Columns to include: `Service Name`, `Timestamp`, `Severity`, `Message`, `Status`.

### 5. Notifications
**Goal**: Alert users even when the tab is not in focus.
**Strategy**:
-   Request `Notification.requestPermission()` on app load or first interaction.
-   When a new critical alert occurs, dispatch a browser Push Notification.
-   Consider integrating with 3rd party services (PagerDuty, Slack) via backend webhooks for enterprise-grade alerting.

### 6. Maintenance Scheduling
**Goal**: Prevent false positives during known downtime.
**Strategy**:
-   Add a `MaintenanceMode` to the `Service` type.
-   Create a UI modal to "Schedule Maintenance" with Start/End times.
-   During maintenance windows, suppress threshold checks and alerts for that specific service.
