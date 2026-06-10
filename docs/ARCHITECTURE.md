# Architecture

CodeCraft AI is a single Next.js App Router application in `apps/web`.

## Runtime

- Next.js App Router handles pages, API routes, metadata, and PWA manifest.
- Tailwind CSS provides the mobile-first RTL cyberpunk interface.
- Prisma ORM targets PostgreSQL and generates the client into `apps/web/src/generated/prisma`.
- Zod validates inbound lead payloads before persistence.

## Boundaries

- Marketing pages are static and do not touch the database.
- Admin pages are skeletons for Task 001 and intentionally avoid real authentication and database reads.
- `POST /api/v1/leads` is the only database-writing route in Sprint Zero.
- No SMS, Telegram bot, payment, or real AI provider calls exist in this sprint.

## Data Flow

1. User submits the bootcamp lead form.
2. The client posts JSON to `/api/v1/leads`.
3. The API validates the body with Zod.
4. Prisma lazily initializes only inside the request path.
5. Duplicate phone numbers return `409`.

## Deployment Shape

The web app can be containerized from `apps/web/Dockerfile`. `infra/docker-compose.yml` wires the web and PostgreSQL services using environment variables only.
