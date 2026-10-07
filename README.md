# Simple Login

A very basic Next.js app with a login page and a dashboard page.

## Run

```
npm install
npm run dev
```

Open http://localhost:3000. Login with **admin / admin**.

## Pages

- `/login` – username + password form (hardcoded admin/admin)
- `/dashboard` – shown after login, has a Logout button
- `/` – redirects to `/login`

Login state is stored in `localStorage`. No backend, no database.
