#!/usr/bin/env bash
set -e

cd /var/www/html

echo "Starting Cellar Circle..."
echo "APP_ENV=$APP_ENV"
echo "APP_URL=$APP_URL"
echo "DB_CONNECTION=$DB_CONNECTION"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "DB_DATABASE=$DB_DATABASE"
echo "DB_USERNAME=$DB_USERNAME"

php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Starting background migration task..."
(
    sleep 10
    echo "Running migrations in background..."
    timeout 60 php artisan migrate --force --no-interaction || echo "Migration failed or timed out; app still started."
) &

echo "Starting Apache..."
exec apache2-foreground