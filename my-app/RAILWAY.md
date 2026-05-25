# Railway Deployment

This app is ready for Railway with `nixpacks.toml` and `Procfile`.

## Required Variables

Set these in Railway:

```env
APP_NAME="Cellar Circle"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-generated-key
APP_URL=https://your-railway-domain.up.railway.app
DB_CONNECTION=mysql
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=public
```

Generate `APP_KEY` locally with:

```bash
php artisan key:generate --show
```

## Database

Add a Railway MySQL or PostgreSQL service.

For MySQL, either set Laravel's usual `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`, or use Railway's generated `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, and `MYSQLPASSWORD`.

For PostgreSQL, set `DB_CONNECTION=pgsql`. The app also understands Railway's generated `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`.

## Build And Start

Railway will use `nixpacks.toml`:

- installs Composer dependencies
- installs npm dependencies
- builds Vite assets
- runs migrations at start
- serves Laravel on Railway's `$PORT`

## First Admin

Set these before running the seeder in production:

```env
HEAD_ADMIN_EMAIL=you@example.com
HEAD_ADMIN_PASSWORD=a-long-secure-password
```

Then run this once from Railway's shell:

```bash
php artisan db:seed --force
```

Remove or rotate `HEAD_ADMIN_PASSWORD` after the account exists.
