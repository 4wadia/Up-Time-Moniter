# Sentinel Security & Feature Enhancement Plan

This document outlines the recommended security improvements and feature suggestions for the Sentinel application.

## Part 1: Security Changes Implementation Guide

### 1. Content Security Policy (CSP)

**File:** `index.html`

**Action:** Add a Content Security Policy `<meta>` tag to the `<head>` section to mitigate Cross-Site Scripting (XSS) attacks.

**Code:**
Insert this line inside the `<head>` tag, before the `<title>`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://esm.sh;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://esm.sh https://generativelanguage.googleapis.com;
  img-src 'self' data: https:;
">
```

*Note: You may need to adjust the `connect-src` if your API endpoints change.*

### 2. Secure External Links

**File:** `App.tsx` (and any other component with `<a>` tags)

**Action:** Ensure all external links opening in a new tab (`target="_blank"`) have `rel="noopener noreferrer"`. This prevents the new page from having access to the `window.opener` object, which is a security risk and performance issue.

**Code Example:**

Find:
```tsx
<a href={`https://${service.url}`} target="_blank" className="...">
```

Replace with:
```tsx
<a href={`https://${service.url}`} target="_blank" rel="noopener noreferrer" className="...">
```

### 3. Input Validation for Thresholds

**File:** `components/ThresholdSettingsModal.tsx`

**Action:** Add `min` constraints to numeric inputs to prevent negative values which could cause logic errors.

**Code Example:**

Find the inputs for "Value" and "Duration" and add `min="0"`:

```tsx
{/* Value Input */}
<input
  type="number"
  min="0" // <--- Add this
  value={threshold.value}
  onChange={(e) => handleUpdateThreshold(threshold.id, 'value', Math.max(0, Number(e.target.value)))} // <--- Safety check
  className="..."
/>

{/* Duration Input */}
<input
  type="number"
  min="0" // <--- Add this
  value={threshold.durationMinutes}
  onChange={(e) => handleUpdateThreshold(threshold.id, 'durationMinutes', Math.max(0, Number(e.target.value)))} // <--- Safety check
  className="..."
/>
```

### 4. API Key Security Warning

**File:** `services/geminiService.ts`

**Action:** Add a comment warning developers that storing API keys in the frontend build makes them publicly visible.

**Code:**

```typescript
// SECURITY WARNING:
// The API key below is exposed in the frontend bundle.
// For production, this call should be proxied through a backend server
// to keep the API key secret.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

---

## Part 2: Feature Suggestions for App Improvement

### 1. Data Persistence (High Priority)
Currently, the app loses all data (monitors, alerts, custom thresholds) when the page is reloaded.
*   **Implementation:** Use `localStorage` in `App.tsx` to save the `services` and `alerts` state.
*   **Hook:** `useEffect` to save state on change, and lazy initialization in `useState` to load it.

### 2. Dark Mode Support
The current "Parchment" theme is beautiful but can be bright at night.
*   **Implementation:** Use Tailwind's `dark:` variant. Create a "Midnight" theme using deep blues and warm greys to match the organic feel.
*   **Toggle:** Add a sun/moon icon in the navbar.

### 3. Real Backend / Polling
The app currently uses `generateMockHistory` to create fake data.
*   **Implementation:**
    *   Create a simple backend (Node/Bun/Go) that actually pings the URLs.
    *   Or, implementing a client-side `fetch` pinger (CORS might be an issue for some sites, requiring a proxy).

### 4. Export & Reporting
Allow users to export incident reports for their stakeholders.
*   **Implementation:** Add a "Export CSV" button in the Incidents view that generates a CSV file of all past incidents and their resolution times.

### 5. Maintenance Windows
Prevent false alarms when you know a service will be down.
*   **Implementation:** Add a "Schedule Maintenance" feature. During this time, the app should show the status as "Maintenance" (Blue) instead of "Down" (Red) and suppress alerts.

### 6. Browser Notifications
Alert the user even if they are in another tab.
*   **Implementation:** Use the browser's `Notification` API.
*   **Code:**
    ```typescript
    if (Notification.permission === "granted") {
      new Notification("Service Down", { body: "Payment Gateway is unreachable!" });
    }
    ```

### 7. Custom Refresh Rates
Allow users to define how often to check each service.
*   **Implementation:** Add a "Check Interval" setting in the service configuration (e.g., check every 30s vs 5 mins).
