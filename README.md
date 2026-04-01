# Smart Expense + Habit Tracker Dashboard

Smart Expense + Habit Tracker Dashboard is a React + TypeScript app that combines personal finance tracking and habit consistency in a single dashboard UX.

## Project Overview

- Landing page with feature marketing and product positioning
- Auth flows: login, register, forgot password
- Dashboard shell MVP with summary cards, transactions, habit progress, and quick actions
- Protected dashboard routing (unauthenticated users redirect to auth login)
- Auth service boundary ready for backend integration (currently mock-backed)

## Feature Status

- Done: Public home page
- Done: Auth forms with validation and feedback states
- Done: Auth context + service boundary
- Done: Token expiry handling with session auto-expiration
- Done: Protected dashboard route
- Done: Dashboard shell + sidebar MVP
- In progress: Wiring quick actions to real data entry flows
- Planned: Backend API integration and persistent data models

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- React Router 7
- Formik + Yup
- Vitest + Testing Library

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Testing

Run all tests:

```bash
npm run test:run
```

Watch mode:

```bash
npm run test
```

Coverage:

```bash
npm run test:coverage
```

Current minimum automated coverage includes:

- Unit tests for AuthContext behavior
- Integration tests for login/register flows
- Route guard test for protected route redirects

## Environment Variables

The app currently runs with mock auth/data and does not require environment variables.

For upcoming API integration, create a `.env` file in project root with:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_AUTH_MODE=mock
```

Notes:

- `VITE_API_BASE_URL` will be used by API service modules.
- `VITE_AUTH_MODE` can be switched from `mock` to `api` after backend wiring.

## Architecture Notes

### Routing

- Route entry lives in `src/App.tsx`
- Public routes: home + auth pages
- Protected route wrapper: `src/components/routing/ProtectedRoute.tsx`
- Dashboard route guarded and redirected to `/auth/login` when unauthenticated

### Authentication

- Context API layer: `src/context/AuthContext.tsx`
- Service boundary: `src/services/authService.ts`
- Service exposes `login`, `register`, `refreshToken`, `restoreSession`, `logout`
- Token expiry timestamp is persisted and enforced in context lifecycle

### UI Components

- Layout shell: `src/components/layout`
- Reusable card primitives: `src/components/ui/Card.tsx`
- Auth-specific reusable container: `src/components/ui/AuthCard.tsx`
- Page modules in `src/pages` with route-level composition

## Roadmap / TODO

- Add dashboard data service and connect quick-action buttons to modals/forms
- Add expenses CRUD flow with categories and monthly trend chart
- Add habit CRUD flow with streak calendar and reminders
- Implement API auth mode with real JWT refresh endpoints
- Add route-level code splitting for dashboard modules
- Add e2e coverage for critical auth and dashboard journeys
- Add CI for lint, build, and test gates
