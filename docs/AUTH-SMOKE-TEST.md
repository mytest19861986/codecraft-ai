# Auth Smoke Test

This checklist covers the v0.3 student auth smoke test and production environment readiness for CodeCraft AI.

## Local Prerequisites

- Run commands from `apps/web`.
- Install dependencies with the existing lockfile before testing.
- PostgreSQL must be reachable through `DATABASE_URL`.
- The Prisma schema must already be applied to the target database. Do not run migrations for this smoke test.
- Use a disposable student phone number for duplicate-registration checks.

## Required Env Vars

Local `.env` values needed for auth smoke testing:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `STUDENT_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Use long random values for both session secrets. Do not reuse the admin secret as the student secret, and do not commit real values.

## Run Locally

From `apps/web`:

```bash
npm.cmd run dev -- -p 3001
```

Open `http://127.0.0.1:3001`. Keep CodeCraft AI on port `3001` when testing production-like behavior because Hami Card uses port `3000` on the shared server.

## Manual Student Auth Smoke Test

1. Open `/register`.
2. Register a student with a phone number and password.
3. Register again with the same phone number and confirm duplicate phone handling appears.
4. Open `/login`.
5. Log in with the registered phone number and password.
6. Confirm successful login redirects to `/dashboard`.
7. Refresh `/dashboard` and confirm the session remains authenticated.
8. Use the dashboard logout control.
9. Open `/dashboard` again and confirm it redirects to `/login`.
10. Check `/api/v1/student/me` behavior:
    - When logged out, it should return `401` with `authenticated: false`.
    - When logged in, it should return `200` with `authenticated: true` and the current student user.

## API Spot Checks

Logged-out check:

```bash
curl -i http://127.0.0.1:3001/api/v1/student/me
```

Logged-in check using the browser session:

1. Log in through `/login`.
2. Open `/api/v1/student/me` in the same browser.
3. Confirm the response includes `ok: true`, `authenticated: true`, and the student user.

## Production Deploy Checklist

- Set `STUDENT_SESSION_SECRET` in the production environment with a long random value.
- Confirm `ADMIN_SESSION_SECRET` and `STUDENT_SESSION_SECRET` are different.
- Keep CodeCraft AI bound to `127.0.0.1:3001` on the live VPS.
- Run validation from `apps/web`:
  - `npm.cmd run lint`
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - `npx.cmd prisma validate`
- Restart PM2 after env changes, keeping port `3001`.
- Smoke test public pages and auth pages:
  - `/`
  - `/bootcamp`
  - `/register`
  - `/login`
  - `/dashboard`
  - `/api/v1/health`
  - `/api/v1/student/me`
