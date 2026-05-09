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
- Branch strategy: `main` is used for the Live environment and `test` is used for the Test environment.

## Environments

Dev uses local services and a local MongoDB database:

- Frontend: local static app
- Auth Service: `http://localhost:4000`
- User Service: `http://localhost:5000`
- Config files: `auth-service/.env.dev`, `user-service/.env.dev`

Test uses deployed services from the `test` branch:

- Auth Service: `https://intercert-auth-service-test.onrender.com`
- User Service: `https://intercert-user-service-test.onrender.com`
- Frontend: `https://intercert-frontend-test.vercel.app`
- Databases: `intercert_auth_test`, `intercert_user_test`
- Config files: `auth-service/.env.test`, `user-service/.env.test`

Live uses deployed services from the `main` branch:

- Frontend: `https://intercert-user-platform.vercel.app`
- Auth Service: `https://intercert-auth-service.onrender.com`
- User Service: `https://intercert-user-service.onrender.com`
- Databases: `intercert_auth_live`, `intercert_user_live`
- Configuration is stored in Render and Vercel environment variables.

## Selected Extra Skills

- Docker: `Dockerfile` for each backend and root `docker-compose.yml`
- CI/CD: GitHub Actions workflow runs on `main` and `test`, builds both services, and can trigger Render deploy hooks through repository secrets
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
cp user-service/.env.test.example user-service/.env.test
```

Run setup commands:

```bash
npm run setup:dev
npm run setup:test
```

`setup:test` runs migrations and preloads three dummy users.

Migration and seed commands can also be run individually:

```bash
npm --prefix auth-service run migration:run -- --env=.env.test
npm --prefix user-service run migration:run -- --env=.env.test
npm --prefix auth-service run seed:test -- --env=.env.test
npm --prefix user-service run seed:test -- --env=.env.test
```

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
- Add environment variables directly in Render for each service.
- Do not set `PORT` on Render; Render supplies it automatically.

Render Test env examples:

Auth Test:

```env
MONGO_URI=your_test_mongodb_connection_string
MONGO_DB=intercert_auth_test
JWT_SECRET=intercert-test-secret-2026
JWT_EXPIRES_IN=1d
USER_SERVICE_URL=https://intercert-user-service-test.onrender.com
```

User Test:

```env
MONGO_URI=your_test_mongodb_connection_string
MONGO_DB=intercert_user_test
AUTH_SERVICE_URL=https://intercert-auth-service-test.onrender.com
```

Render Live env examples:

Auth Live:

```env
MONGO_URI=your_live_mongodb_connection_string
MONGO_DB=intercert_auth_live
JWT_SECRET=replace-with-live-secret
JWT_EXPIRES_IN=1d
USER_SERVICE_URL=https://intercert-user-service.onrender.com
```

User Live:

```env
MONGO_URI=your_live_mongodb_connection_string
MONGO_DB=intercert_user_live
AUTH_SERVICE_URL=https://intercert-auth-service.onrender.com
```

Vercel frontend:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `.`
- Set `AUTH_API_URL` and `USER_API_URL` to the Render URLs. Do not use the `VERCEL_` prefix for custom variables because Vercel reserves it for system values.

Vercel Test env:

```env
AUTH_API_URL=https://intercert-auth-service-test.onrender.com
USER_API_URL=https://intercert-user-service-test.onrender.com
```

Vercel Live env:

```env
AUTH_API_URL=https://intercert-auth-service.onrender.com
USER_API_URL=https://intercert-user-service.onrender.com
```

MongoDB Atlas:

- Use separate database names for test and live.
- For Render free tier, allow network access from `0.0.0.0/0` in Atlas, or use a stricter allowlist if fixed outbound IPs are available.

## CI/CD

GitHub Actions workflow: `.github/workflows/deploy-test.yml`

- Runs on pushes to `main` and `test`
- Builds `auth-service`
- Builds `user-service`
- Can trigger Render deploy hooks when these repository secrets are configured:
  - `RENDER_AUTH_TEST_DEPLOY_HOOK`
  - `RENDER_USER_TEST_DEPLOY_HOOK`

## Submission Checklist

- GitHub repository link
- Test frontend URL on Vercel
- Live frontend URL on Vercel
- Test Auth/User backend URLs on Render
- Live Auth/User backend URLs on Render
- Postman collection: `postman/InterCert.postman_collection.json`
- Demo video covering dev, test, and live
- Test credentials from this README
