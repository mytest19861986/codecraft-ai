# CodeCraft AI

CodeCraft AI is a Persian RTL web MVP foundation for a cyberpunk/gaming-style coding academy for Iranian teenagers and their parents.

## Sprint Zero Scope

- Landing page
- Bootcamp signup page
- Free lesson page
- Parents page
- Admin login skeleton
- Admin leads skeleton
- `POST /api/v1/leads`
- `GET /api/v1/health`
- Prisma PostgreSQL schema
- PWA manifest
- Docker-ready structure
- CI pipeline

## Local Development

```bash
cd apps/web
npm install
cp .env.example .env
npm run dev
```

Set `DATABASE_URL` before using lead storage or Prisma commands that need a datasource.

## Verification

```bash
cd apps/web
npx prisma validate
npm run lint
npm run typecheck
npm run build
```

## Security Notes

SMS.ir optional lead confirmation is implemented for saved leads and is disabled by default unless `SMS_LEAD_SMS_ENABLED=true`. SMS delivery failure does not block lead creation. Keep SMS.ir keys and all other secrets in `.env` only; do not commit `.env` files or credentials.

No real Telegram bot, payment provider, or OpenAI API integration is implemented in Sprint Zero.
