# Security

## Secrets

Secrets must never be committed. Keep values in local or deployment environment variables:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `SMSIR_API_KEY`
- `SMS_LEAD_SMS_ENABLED`
- `SMS_LEAD_TEMPLATE_ID`

`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` must be strong values configured outside Git.
SMS.ir credentials and flags must stay in `.env` or deployment environment variables only.
`.env`, `.env.local`, and `.env*.local` are ignored.

## Sprint Zero Constraints

- SMS.ir optional lead confirmation is integrated for saved leads, disabled by default, and controlled by `SMS_LEAD_SMS_ENABLED`.
- SMS.ir delivery failure must not block lead creation.
- No real Telegram bot is integrated.
- No payment provider is integrated.
- No real OpenAI API calls are integrated.
- Admin pages are skeletons and must not be treated as protected production surfaces.

## API Hardening Needed Next

- Replace `/api/v1/leads` in-memory MVP rate limiting with Redis, Valkey, or an equivalent shared store before public production scale.
- Sprint Zero admin logout has no CSRF token. This is acceptable only for the MVP because logout is a low-risk action; add CSRF protection before introducing sensitive admin mutations.
- Add structured audit logs for admin mutations.
- Add centralized request logging with sensitive-field redaction.
