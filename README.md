# InterCert Microservices User Platform

Second-round assignment implementation with:

- Frontend: AngularJS 1.x static app for Vercel
- Backend: two NestJS REST services
- Database: MongoDB Atlas or local MongoDB
- Auth Service: register, login, logout, token validation
- User Service: profile, edit profile, photo upload, password change, dashboard

## Architecture

The app is split into two services communicating through REST APIs.

- `auth-service` owns credentials, JWT creation, logout token revocation, login rate limiting, and token validation.
- `user-service` owns profile data, photo uploads, dashboard, profile caching, and password change orchestration.
- Protected User Service routes call `POST /auth/validate` on the Auth Service before returning data.

## Selected Extra Skills

- Docker: `Dockerfile` for each backend and root `docker-compose.yml`
- CI/CD: GitHub Actions workflow that builds both services and can trigger Render test deploy hooks
- Message Queue simulation: async welcome email console log after registration
- Monitoring: `/health` endpoint in both services
- Metrics: `/metrics` endpoint with request counts
- Redis-style caching: profile data cached for 2 minutes with an in-memory fallback suitable for free-tier deployment

## Setup

Install local prerequisites:

- Node.js 20+
- MongoDB locally for dev, or MongoDB Atlas for cloud environments

Create cloud env files from the examples:

```bash
cp auth-service/.env.test.example auth-service/.env.test
cp auth-service/.env.live.example auth-service/.env.live
cp user-service/.env.test.example user-service/.env.test
cp user-service/.env.live.example user-service/.env.live
```

Run setup commands:

```bash
npm run setup:dev
npm run setup:test
npm run setup:live
```

`setup:test` runs migrations and preloads three dummy users.

## Local Run

```bash
npm run dev:auth
npm run dev:user
cd frontend && npm install && npm run build && npm start
```

Local URLs:

- Frontend: `http://localhost:3000` or the URL printed by `serve`
- Auth Service: `http://localhost:4000`
- User Service: `http://localhost:5000`

## Test Credentials

These users are inserted by `npm run setup:test`:

- `ravi.test@example.com` / `Password1`
- `neha.test@example.com` / `Password1`
- `arjun.test@example.com` / `Password1`

## API List

Auth Service:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/validate`
- `POST /auth/logout`
- `POST /internal/change-password`
- `GET /health`
- `GET /metrics`

User Service:

- `POST /internal/users`
- `GET /profile`
- `PUT /profile`
- `POST /profile/photo`
- `POST /password/change`
- `GET /dashboard`
- `GET /health`
- `GET /metrics`

## Deployment

Render backend:

- Deploy `auth-service` and `user-service` separately.
- Use Node runtime.
- Build command: `npm install && npm run build`
- Start command: `node dist/main.js`
- Add env vars from `.env.test.example` or `.env.live.example`.

Vercel frontend:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `.`
- Set `VERCEL_AUTH_API_URL` and `VERCEL_USER_API_URL` to the Render URLs.

MongoDB Atlas:

- Create separate databases for dev/test/live if you use cloud for all environments.
- At minimum, use live Atlas databases for `.env.test` and `.env.live`.

## Submission Checklist

- GitHub repository link
- Test frontend URL on Vercel
- Live frontend URL on Vercel
- Test Auth/User backend URLs on Render
- Live Auth/User backend URLs on Render
- Postman collection: `postman/InterCert.postman_collection.json`
- Demo video covering dev, test, and live
- Test credentials from this README
