# Architecture

CodeCraft AI is a single Next.js App Router application in `apps/web`.

This document records lightweight foundation rules before v0.3 Auth. It should stay practical for the MVP and avoid adding process or infrastructure that the small VPS does not need yet.

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

## Route Group Plan

- `(marketing)`: public, SEO-friendly, mostly static pages such as landing, bootcamp, and public content.
- Future `(student)` or equivalent: authenticated student area after v0.3 Auth.
- `admin`: admin-only area. Auth and authorization must be explicit before this becomes real production administration.
- API routes should stay versioned. Future authenticated APIs should be separated by audience, for example `/api/v1/student/*` and `/api/v1/admin/*`.

## Data Flow

1. User submits the bootcamp lead form.
2. The client posts JSON to `/api/v1/leads`.
3. The API validates the body with Zod.
4. Prisma lazily initializes only inside the request path.
5. Duplicate phone numbers return `409`.

## Deployment Shape

The web app can be containerized from `apps/web/Dockerfile`. `infra/docker-compose.yml` wires the web and PostgreSQL services using environment variables only.

On the live VPS, CodeCraft AI must stay on port `3001`. Hami Card stays on port `3000`. Do not move CodeCraft to `3000` on that server.

For the MVP, deployment can stay simple: `git pull`, `npm run build`, `pm2 restart`, then smoke test. Artifact builds, staging environments, blue-green deploys, and full CI/CD deployment automation are later improvements, not requirements for the current MVP.

## Image Optimization Note

The current VPS CPU is not compatible with the modern `sharp` prebuilt binary. Do not fight `sharp` on this VPS during the MVP.

If Next image optimization causes runtime errors again, prefer a deliberate Next config decision such as `images.unoptimized` over ad-hoc server package changes.
