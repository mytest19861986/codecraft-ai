# Production Deploy

This guide deploys CodeCraft AI on a VPS with Docker Compose, PostgreSQL, host-level Nginx, and Certbot SSL.

Do not commit real `.env` files, passwords, session secrets, database dumps, or server IP addresses.

## Assumptions

- The app runs from `apps/web`.
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
- `NEXT_PUBLIC_SITE_URL`: Public origin, for example `https://codecraftai.ir`.
- `POSTGRES_PORT`: Optional host port for local administrative access to Postgres. Keep it bound to `127.0.0.1` unless there is a specific operations reason to expose it.

Optional port binding variables:

- `WEB_BIND_ADDRESS`: Defaults to `127.0.0.1`, which is suitable when Nginx reverse proxies from the host.
- `WEB_PORT`: Defaults to `3000`.
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

Generate strong secrets with a local password manager or a command such as:

```bash
openssl rand -base64 48
```

## 3. Build And Start PostgreSQL

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml up -d postgres
```

Confirm Postgres is healthy:

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml ps
```

## 4. Apply The Prisma Schema

This project currently uses Prisma `db push` for schema deployment. When migrations are introduced, replace this step with `npx prisma migrate deploy`.

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml run --rm web npx prisma db push
```

## 5. Start The Web App

```bash
docker compose --env-file infra/.env.production -f infra/docker-compose.yml up -d --build web
```

The default Compose settings publish the web app on `127.0.0.1:3000`, which is intended to be reached through Nginx, not directly from the public internet.

## 6. Configure Nginx Reverse Proxy

Create an Nginx site such as `/etc/nginx/sites-available/codecraftai.ir`:

```nginx
server {
    listen 80;
    server_name codecraftai.ir www.codecraftai.ir;

    location / {
        proxy_pass http://127.0.0.1:3000;
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
curl -fsS http://127.0.0.1:3000/api/v1/health
curl -fsS https://codecraftai.ir/api/v1/health
curl -I https://codecraftai.ir/bootcamp
curl -I https://codecraftai.ir/admin/login
curl -I https://codecraftai.ir/admin/leads
```

Also submit a test lead through `/bootcamp` and confirm it appears in `/admin/leads`.

## Operations Notes

- Restart after env changes with `docker compose --env-file infra/.env.production -f infra/docker-compose.yml up -d --build web`.
- View logs with `docker compose --env-file infra/.env.production -f infra/docker-compose.yml logs -f web`.
- Back up the Postgres named volume before destructive database operations.
- Keep `POSTGRES_BIND_ADDRESS=127.0.0.1`; do not expose Postgres publicly.
