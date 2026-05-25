FROM composer:2.8 AS composer_base

FROM php:8.3-cli AS vendor

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
        libpq-dev \
    && docker-php-ext-install \
        bcmath \
        pdo_mysql \
        pdo_pgsql \
        zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer_base /usr/bin/composer /usr/bin/composer

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


# --- Frontend assets ---
FROM node:20-bookworm-slim AS assets

WORKDIR /app

COPY my-app/package.json my-app/package-lock.json ./

RUN npm ci

COPY my-app/ ./

# The Node/Vite/TypeScript build needs Ziggy from Composer's vendor folder.
# The Laravel vendor folder is created in the PHP composer stage, not in this Node stage.
COPY --from=vendor /app/vendor/tightenco/ziggy ./vendor/tightenco/ziggy

RUN npm run build


# --- Production Laravel container ---
FROM php:8.3-apache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install \
        bcmath \
        opcache \
        pdo_mysql \
        pdo_pgsql \
        zip \
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
    && mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["digitalocean-start"]
