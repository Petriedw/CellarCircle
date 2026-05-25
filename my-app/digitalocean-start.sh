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

php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Testing Laravel database connection..."
php artisan migrate:status || true

echo "Running migrations..."
php artisan migrate --force --no-interaction || true

echo "Caching Laravel config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting Apache..."
apache2-foreground