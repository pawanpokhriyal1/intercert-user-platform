# Render Services

Create four Render Web Services for a clean Test/Live split:

1. `intercert-auth-test`
2. `intercert-user-test`
3. `intercert-auth-live`
4. `intercert-user-live`

For each service:

- Root Directory: `auth-service` or `user-service`
- Runtime: Node
- Build Command: `npm install && npm run build`
- Start Command: `node dist/main.js`
- Add environment variables from `.env.test.example` or `.env.live.example`

After the URLs are created, update cross-service env vars:

- Auth service: `USER_SERVICE_URL`
- User service: `AUTH_SERVICE_URL`

Then run migrations/seeds locally against the cloud database:

```bash
npm --prefix auth-service run migration:run -- --env=.env.test
npm --prefix user-service run migration:run -- --env=.env.test
npm --prefix auth-service run seed:test -- --env=.env.test
npm --prefix user-service run seed:test -- --env=.env.test
```
