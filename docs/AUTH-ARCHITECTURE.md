# Auth Architecture

This document records the v0.3 authentication plan for CodeCraft AI. It is a planning document only; v0.3 Task 001 does not implement auth code, edit the Prisma schema, run migrations, add packages, or change deployment behavior.

## Final v0.3 Decision

- Student auth will use phone number plus password for v0.3.
- OTP is deferred until after the MVP.
- The existing HMAC signed-cookie pattern will be generalized for student sessions.
- The existing Prisma `User` model will be reused.
- No `StudentProfile` model will be added in v0.3.
- No `Session` table will be added in v0.3.
- Admin shared-password auth remains unchanged for now.

## Existing Auth Inventory

- Admin login currently uses an `ADMIN_PASSWORD` environment variable.
- Admin sessions use an HMAC signed cookie.
- Prisma already includes `User` and `UserRole`.
- The leads API already has an MVP rate-limit pattern that can inform register/login protection.
- Existing admin session routes handle admin login/logout/session behavior and remain the current admin auth surface.

## Route Plan

- Public marketing routes remain public.
- Student auth pages will be `/login` and `/register`.
- The student protected route will begin with `/dashboard`.
- Student API routes will live under `/api/v1/student/*`.
- Admin routes remain under `/admin/*`.
- The public leads route remains `/api/v1/leads`.

## Data Model Plan

- Use the existing `User` table.
- Use `phone` as the unique student login identifier.
- Use `passwordHash` for student passwords.
- Keep the `PARENT` role dormant.
- Do not add a `SUPPORT` role yet.
- Do not add `StudentProfile` yet.

## Session And Security Plan

- Reuse and generalize the signed cookie payload to `{ sub, role, iat, exp }`.
- Session cookies must be `httpOnly`, `sameSite: "strict"`, and `secure` in production.
- Secrets must never be logged.
- Add rate limiting to register and login routes when they are implemented.
- Password hashing must use a safe server-side hash.
- Do not use `localStorage` for auth tokens.

## Implementation Phases

1. Shared session core.
2. Student register/login API.
3. Student login/register pages.
4. Protected dashboard shell.
5. Admin guard hardening.
6. Validation and smoke tests.

## Non-goals

- No OTP in v0.3.
- No payment or subscription gating.
- No XP schema.
- No parent account flow.
- No support/admin role matrix.
- No DB-backed sessions.
