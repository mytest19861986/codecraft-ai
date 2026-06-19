# Production Deploy

This guide deploys CodeCraft AI on a VPS with Docker Compose or PM2, PostgreSQL, host-level Nginx, and Certbot SSL.

Live VPS note: `codecraft-ai` runs on `127.0.0.1:3001` behind Nginx because Hami Card runs separately on port `3000` on the same server. Do not bind CodeCraft to port `3000` on that host.

Do not commit real `.env` files, passwords, session secrets, database dumps, or server IP addresses.

## Assumptions

- The app runs from `apps/web`.
- The live PM2 app name is `codecraft-ai`.
- The expected live server path is `/var/www/codecraft-ai`.
- Docker and the Docker Compose plugin are installed on the VPS.
- Nginx and Certbot run on the VPS host, outside Docker.
- DNS for `codecraftai.ir` already points to the VPS before requesting SSL.
- `cccai.ir` is optional and should only be added after its DNS points to the same server.
- PostgreSQL data is stored in the Compose named volume `infra_postgres-data`.

## Required Environment Variables

- `DATABASE_URL`: Prisma PostgreSQL URL for the web container. Use `postgres` as the hostname inside Docker Compose, for example `postgresql://USER:PASSWORD@postgres:5432/DB?schema=public`.
- `POSTGRES_DB`: Database name created by the Postgres container.
- `POSTGRES_USER`: Database user created by the Postgres container.
- `POSTGRES_PASSWORD`: Strong database password. Keep it in the VPS env file only.
- `ADMIN_PASSWORD`: Strong admin login password.
- `ADMIN_SESSION_SECRET`: Long random secret used to sign admin sessions.
- `STUDENT_SESSION_SECRET`: Long random secret used to sign student sessions. Use a different value from `ADMIN_SESSION_SECRET`.
- `NEXT_PUBLIC_SITE_URL`: Public origin, for example `https://codecraftai.ir`.
- `NODE_ENV`: Set to `production` for PM2 or other host-level process managers.
- `PORT`: Set to `3001` for PM2 or other host-level process managers. Never use `3000` for CodeCraft on the live VPS.
- `POSTGRES_PORT`: Optional host port for local administrative access to Postgres. Keep it bound to `127.0.0.1` unless there is a specific operations reason to expose it.

Optional port binding variables:

- `WEB_BIND_ADDRESS`: Defaults to `127.0.0.1`, which is suitable when Nginx reverse proxies from the host.
- `WEB_PORT`: Defaults to `3000` for generic Docker use. On the live VPS, set it to `3001` so it does not collide with Hami Card on port `3000`.
- `POSTGRES_BIND_ADDRESS`: Defaults to `127.0.0.1`.

## 1. Clone The Repo

```bash
git clone <repo-url> codecraft
cd codecraft
git checkout master
```

## 2. Create The Production Env File

```bash
cp infra/.env.production.example infra/.env.production
nano infra/.env.production
```

Replace all placeholders with VPS-specific values. The `DATABASE_URL` host must stay `postgres` because it connects over the Docker Compose network.

For the live VPS that also runs Hami Card, set `WEB_PORT=3001`. Keep Hami Card on port `3000`.

Generate strong secrets with a local password manager or a command such as:

```bash
openssl rand -base64 48
```

Generate separate values for `ADMIN_SESSION_SECRET` and `STUDENT_SESSION_SECRET`.

## 3. Build And Start PostgreSQL

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml up -d postgres
```

Confirm Postgres is healthy:

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml ps
```

## 4. Apply The Prisma Schema

Use Prisma migrations for production schema deployment. Do not use `prisma db push` in production.

Before deploying the lesson progress migration to any production database that may already contain lessons, check for duplicate lesson slugs:

```sql
SELECT slug, COUNT(*)
FROM "Lesson"
GROUP BY slug
HAVING COUNT(*) > 1;
```

Resolve any returned rows before running migrations. The `Lesson.slug` column is unique in the current schema.

If PgBouncer is introduced later, confirm that Prisma migrations use a direct PostgreSQL connection or that the pooling mode is compatible with migration transactions and the app's Serializable transaction usage.

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml run --rm web npx prisma generate
docker compose --env-file infra/.env.production -f infra/docker-compose.yml run --rm web npx prisma migrate deploy
```

Seed lessons only intentionally. Do not blindly re-run lesson seed scripts against production content, and do not reorder or deactivate lessons that have real student progress without checking the impact on unlocks, dashboard ordering, and progress reporting.

## 5. Start The Web App

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml up -d --build web
```

The default Compose settings publish the web app on `127.0.0.1:3000`, which is intended to be reached through Nginx, not directly from the public internet. On the live VPS, override this with `WEB_PORT=3001` because Hami Card uses `127.0.0.1:3000`.

For a PM2 deployment on the live VPS, start CodeCraft with the same host port:

```bash
NODE_ENV=production PORT=3001 pm2 start npm --name codecraft-ai -- run start
```

If the PM2 app already exists, restart it with the updated environment instead of creating a duplicate process:

```bash
NODE_ENV=production PORT=3001 pm2 restart codecraft-ai --update-env
```

## 6. Configure Nginx Reverse Proxy

Create an Nginx site such as `/etc/nginx/sites-available/codecraftai.ir`:

```nginx
server {
    listen 80;
    server_name codecraftai.ir www.codecraftai.ir;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/codecraftai.ir /etc/nginx/sites-enabled/codecraftai.ir
sudo nginx -t
sudo systemctl reload nginx
```

If `cccai.ir` will also serve the app, add it to `server_name` only after its DNS is ready.

## 7. Enable SSL With Certbot

```bash
sudo certbot --nginx -d codecraftai.ir -d www.codecraftai.ir
```

For the optional secondary domain:

```bash
sudo certbot --nginx -d cccai.ir -d www.cccai.ir
```

Check renewal:

```bash
sudo certbot renew --dry-run
```

## 8. Smoke Test

From the VPS:

```bash
curl -fsS http://127.0.0.1:3001/api/v1/health
curl -fsS https://codecraftai.ir/api/v1/health
curl -I https://codecraftai.ir/bootcamp
curl -I https://codecraftai.ir/admin/login
curl -I https://codecraftai.ir/admin/leads
```

Also submit a test lead through `/bootcamp` and confirm it appears in `/admin/leads`.

For student auth, follow `docs/AUTH-SMOKE-TEST.md` after deploying or restarting the app.

Production smoke checklist:

- Public home page loads.
- `/login` loads.
- `/register` loads.
- Admin login succeeds with the configured production admin password.
- `/admin/leads` loads after admin login.
- `/admin/lessons` loads after admin login.
- Create/edit an admin lesson only on staging/demo, or in production only when the content change is intentional and approved.
- Student registration and login work.
- `/dashboard` loads for the signed-in student.
- `/dashboard/lessons/[slug]` loads for an unlocked lesson.
- Completing a lesson increases XP once.
- Completing a lesson unlocks the next lesson.
- Locked lesson content does not leak.
- Inactive lessons do not show in the student learning path.
- `/api/v1/health` returns a healthy JSON response.

## PM2 Server Command Plan

Do not run this plan until you are intentionally deploying on the production server. These commands assume the repo already exists at `/var/www/codecraft-ai`, the production `.env` is already present on the server, and secrets are never printed to the terminal or committed to Git.

```bash
cd /var/www/codecraft-ai
git fetch origin
git checkout master
git pull origin master
cd apps/web
npm ci
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npm run build
NODE_ENV=production PORT=3001 pm2 restart codecraft-ai --update-env
```

If `codecraft-ai` does not exist in PM2 yet, start it once from `apps/web`:

```bash
NODE_ENV=production PORT=3001 pm2 start npm --name codecraft-ai -- run start
pm2 save
```

Health checks after PM2 restart/start:

```bash
pm2 status codecraft-ai
curl -fsS http://127.0.0.1:3001/api/v1/health
curl -fsS https://codecraftai.ir/api/v1/health
```

Avoid destructive commands. If a future deployment requires clearing caches, deleting files, or changing database content, write a separate reviewed runbook first and back up the database before touching production data.

## Operations Notes

- Restart after env changes with `docker compose --env-file infra/.env.production -f infra/docker-compose.yml up -d --build web`.
- View logs with `docker compose --env-file infra/.env.production -f infra/docker-compose.yml logs -f web`.
- Back up the Postgres named volume before destructive database operations.
- Keep `POSTGRES_BIND_ADDRESS=127.0.0.1`; do not expose Postgres publicly.
- Keep CodeCraft on port `3001` on the live VPS. Hami Card owns port `3000`.
