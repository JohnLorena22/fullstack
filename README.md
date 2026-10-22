# IT Management System

Laravel API (`backend/`) + React/Vite frontend (`frontend/`).

## Requirements

- PHP 8.3+ and Composer
- Node.js 22.12+ (required by Vite 8)

## Backend

```sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve        # http://localhost:8000
```

Run tests with `php artisan test`. Allowed frontend origins are configured via `CORS_ALLOWED_ORIGINS` in `.env`.

## Frontend

```sh
cd frontend
npm install
cp .env.example .env     # sets VITE_API_URL=http://localhost:8000/api
npm run dev              # http://localhost:5173
```

Lint with `npm run lint`, build with `npm run build`.
