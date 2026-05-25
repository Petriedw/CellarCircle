FROM composer:2 AS vendor

WORKDIR /app

COPY my-app/composer.json my-app/composer.lock ./
RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --optimize-autoloader

COPY my-app/ ./
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi


FROM node:20-bookworm-slim AS assets

WORKDIR /app

COPY my-app/package.json my-app/package-lock.json ./
RUN npm ci

COPY my-app/ ./
RUN npm run build


FROM php:8.2-apache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libzip-dev unzip \
    && docker-php-ext-install bcmath opcache pdo_mysql pdo_pgsql zip \
    && a2enmod rewrite headers \
    && sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf \
    && printf '%s\n' \
        '<Directory /var/www/html/public>' \
        '    AllowOverride All' \
        '    Require all granted' \
        '</Directory>' \
        > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel \
    && rm -rf /var/lib/apt/lists/*

COPY --from=vendor /app /var/www/html
COPY --from=assets /app/public/build /var/www/html/public/build
COPY my-app/digitalocean-start.sh /usr/local/bin/digitalocean-start

RUN chmod +x /usr/local/bin/digitalocean-start \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["digitalocean-start"]
