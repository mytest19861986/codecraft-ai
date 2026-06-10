# Security

## Secrets

Secrets must never be committed. Keep values in local or deployment environment variables:

- `DATABASE_URL`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

`.env`, `.env.local`, and `.env*.local` are ignored.

## Sprint Zero Constraints

- No real SMS provider is integrated.
- No real Telegram bot is integrated.
- No payment provider is integrated.
- No real OpenAI API calls are integrated.
- Admin pages are skeletons and must not be treated as protected production surfaces.

## API Hardening Needed Next

- Add rate limiting to `/api/v1/leads`.
- Add CSRF/session strategy once admin actions exist.
- Add structured audit logs for admin mutations.
- Add centralized request logging with sensitive-field redaction.
