# Deploying Cellar Circle on DigitalOcean App Platform

This repo is deployable from the repository root with the included `Dockerfile`.

## App Platform

1. Push these files to GitHub.
2. In DigitalOcean App Platform, choose `Petriedw/CellarCircle` and branch `main`.
3. DigitalOcean should detect the root `Dockerfile`.
4. Add or confirm these runtime environment variables:
   - `APP_KEY`: generate locally with `cd my-app && php artisan key:generate --show`
   - `APP_URL`: your DigitalOcean app URL after the first deploy
   - `APP_DEBUG`: `false`
   - `APP_ENV`: `production`
5. Attach the MySQL database created by `.do/app.yaml`, or create a managed MySQL database and map the `DB_*` variables to it.

The container starts Apache on port `80`, runs migrations when database settings are present, and serves Laravel from `my-app/public`.
