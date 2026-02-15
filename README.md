# Sentinel - Uptime Monitoring Dashboard

Sentinel is a modern, responsive dashboard application designed for monitoring service uptime and status pages. It features a clean, professional UI with a focus on readability, consistent design tokens, and a seamless user experience.

## Features

-   **Authentication System**: Secure signup and login flow with form validation.
-   **Protected Routes**: robust route guarding to separate public and private access.
-   **Session Persistence**: Automatic session restoration via local storage.
-   **Dashboard Layout**: Responsive sidebar navigation with dynamic active states.
-   **Reusable Components**: Modular architecture for Buttons, Inputs, Cards, and Toasts.
-   **Refined UI**: Consistent 4px spacing scale and 12px border radius system.
-   **Toast Notifications**: Global context for success and error feedback.
-   **Mock Data Integration**: Simulated API delays and loading skeletons for realistic UX.

## Tech Stack

-   **Framework**: React 18
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Routing**: Custom State-based Routing (SPA)
-   **Font**: Inter (Google Fonts)
-   **Language**: TypeScript

## Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, Layout wrapper
│   └── ui/           # Button, Input, Toast, Charts
├── context/          # AuthContext, ToastContext
├── hooks/            # Custom hooks (useDashboard)
├── pages/            # Page components (Login, Overview, Settings)
├── services/         # API services
└── types/            # TypeScript interfaces
```

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/4wadia/Up-Time-Moniter.git
    cd Up-Time-Moniter
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    # or
    bun run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## Environment Setup

This project currently uses a mock backend architecture and `localStorage` for data persistence. No external backend or environment variables are required to run the application locally.

## Authentication Flow

1.  **Signup**: User accounts are created and stored locally. Validation ensures unique emails.
2.  **Login**: Credentials are verified against stored users. A session token (mock) is saved.
3.  **Persistence**: On refresh, `AuthContext` initializes state from `localStorage`.
4.  **Protection**: Unauthenticated users accessing private routes are redirected to `/signin`. Authenticated users accessing auth pages are redirected to `/dashboard`.

## Design System

-   **Typography**: Inter font family with weights 400 (Regular), 500 (Medium), and 600 (SemiBold).
-   **Theme**: Light theme with high-contrast text (`gray-900`) and subtle backgrounds (`gray-50`).
-   **Radius**: `rounded-xl` (12px) for inputs/buttons, `rounded-2xl` (16px) for cards/modals.
-   **Spacing**: Strict 4px scale (e.g., `p-4`, `gap-3`, `m-6`).

## Future Improvements

-   Integration with a real backend (Node.js/Express or Supabase).
-   Real-time data visualization for uptime metrics.
-   Dark mode support.
-   User profile image upload.

## License

MIT License
