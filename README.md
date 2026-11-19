# CRM Assistant: Frontend (Next.js)

Next.js (App Router, TypeScript, Tailwind) interface for the CRM Assistant backend.

Backend repository: `<link to your backend repo>`. It must be running first.

## Requirements
- Node.js 20+
- The Laravel backend running (see its README)

## Setup
```bash
npm install
```
Create `.env.local`:

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |

The backend's `FRONTEND_URL` must match the URL this app runs on (default `http://localhost:3000`), otherwise the browser blocks requests (CORS).

## Run
```bash
npm run dev
```
Open `http://localhost:3000` and sign in with `demo@example.com` / `password`.

## Pages
- `/customers`, `/customers/[id]`: list with search and pagination, details with deals and an AI summary button
- `/deals`, `/deals/[id]`: list with stage filter and pagination, details with the customer link
- `/report`: database-calculated sales statistics and an AI performance summary
- `/assistant`: chat about deals, answers show which data source was used

## Structure
```
src/app/            pages (the (app) group shares the nav bar and login guard)
src/components/ui/  reusable pieces: loading, error and empty states, badge, pagination, markdown
src/hooks/          useFetch: one hook for loading, error and retry handling
src/lib/            api client (token, errors), formatting helpers, constants
src/types/          shared TypeScript types
```

## Notes
- The API token is kept in `localStorage`. See the security section of the backend's technical documentation for the trade-off.
- There are no automated frontend tests. The interface was tested manually against the checklist in the technical documentation.