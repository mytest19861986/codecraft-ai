# Roadmap

## Task 001: Sprint Zero

- Build production-ready web foundation.
- Add marketing pages and lead capture.
- Add Prisma schema and API contracts.
- Add CI and Docker-ready files.

## Task 002: Real Demo Flow + Landing/Product Polish

- Harden the real demo path from `/bootcamp` lead submission to `/admin/leads` review.
- Polish Persian success, duplicate, validation, empty, and login error states.
- Soften marketing copy so SMS, Telegram, payment, and AI integrations are not presented as live features.
- Keep free lesson as a teaser/preview until real lesson media is published.

### Manual QA

- Lead submission: open `/bootcamp`, submit a valid Iranian mobile number, confirm the Persian success message, then submit the same phone again and confirm the duplicate message. Try an invalid phone and confirm validation copy.
- Admin login: open `/admin/login`, sign in with `ADMIN_PASSWORD`, confirm `/admin/leads` shows submitted leads, then use logout and confirm the login page returns cleanly.
- Required env vars: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `DATABASE_URL`.

### Future Scope Not Yet Implemented

- Real SMS delivery.
- Telegram bot or Telegram mini-app integration.
- Payment provider integration.
- OpenAI API calls or live AI exercise generation.

## Task 003 Candidates

- Lead status transitions and audit logging.
- Database migrations and seed data.
- Approved refund policy content.
- Real lesson playback and progress tracking.

## Later MVP Work


- Rate limiting and abuse protection for public lead intake form.
- Lesson playback and progress tracking.
- Student accounts and parent views.
- Payment integration after product approval.
- Optional SMS/Telegram integrations after provider and compliance review.
- AI-assisted exercises after OpenAI integration design is approved.

