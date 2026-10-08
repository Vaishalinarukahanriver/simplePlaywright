# Simple Login + Todos

A small full-stack Next.js app. The **backend** is a set of Next.js route
handlers under `app/api/`. The **frontend** pages only talk to that API
with `fetch`. There is no separate server to run.

## Run

```
npm install
npm run dev
```

Open http://localhost:3000. Login with **admin / admin**.

## Test

```
npm test
```

Runs the Playwright suite in `tests/` (UI tests and direct API tests).

## Pages

- `/` – redirects to `/login`
- `/login` – posts to `/api/login`, then goes to the dashboard
- `/dashboard` – todo list with add / edit / tick / delete, plus Logout

## Backend (API)

Login sets an httpOnly `session` cookie. Every `/api/todos` route returns
`401` without it.

| Method | Path              | Body                | Result                 |
|--------|-------------------|---------------------|------------------------|
| POST   | `/api/login`      | `{username, password}` | `200 {user}` or `401` |
| POST   | `/api/logout`     |                     | clears the cookie      |
| GET    | `/api/me`         |                     | `{user}` or `401`      |
| GET    | `/api/todos`      |                     | list of todos          |
| POST   | `/api/todos`      | `{title}`           | `201` new todo         |
| GET    | `/api/todos/:id`  |                     | one todo or `404`      |
| PUT    | `/api/todos/:id`  | `{title?, done?}`   | updated todo or `404`  |
| DELETE | `/api/todos/:id`  |                     | `204` or `404`         |

## Data

`lib/db.js` is an in-memory store (an array on `globalThis`). It survives
hot reloads in dev but resets whenever the server restarts, so every test
run starts from the same two seeded todos. Swap it for a real database
later without touching the route handlers.

## Files

```
app/
  api/
    login/route.js        POST login
    logout/route.js       POST logout
    me/route.js           GET current user
    todos/route.js        GET list, POST create
    todos/[id]/route.js   GET one, PUT update, DELETE
  login/page.tsx
  dashboard/page.tsx
lib/
  auth.js                 cookie session helpers
  db.js                   in-memory todo store
tests/
  01-05 *.spec.js         Playwright tests
```
