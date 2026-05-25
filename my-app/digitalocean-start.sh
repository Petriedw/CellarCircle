#!/usr/bin/env bash
set -euo pipefail

php artisan config:clear
php artisan route:clear
php artisan view:clear

if [ -n "${DB_HOST:-}" ] || [ -n "${DATABASE_URL:-}" ]; then
    php artisan migrate --force
fi

php artisan storage:link || true

exec apache2-foreground
