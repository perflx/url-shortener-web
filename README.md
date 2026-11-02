# URL Shortener: Web

The frontend for my [URL Shortener](https://github.com/perflx/url-shortener) service. Sign up, paste a long link, get a short one, and see how many times it was clicked.

The app is a single-page React application that talks to the REST API from the backend repository.

## Related

- Backend repository: https://github.com/perflx/url-shortener

## Live demo

- **App:** https://url-shortener-perflx.onrender.com/
- **API:** https://url-shortener-d53t.onrender.com

> The API runs on Render's free tier and goes to sleep after a period of inactivity. The first request after a pause (for example the first login) can take up to a minute while the server wakes up.

## Features

- Registration and login with form validation and clear error messages (wrong credentials, email already registered, rate limit reached, server unreachable)
- Dashboard with the signed-in user's email and a log out button
- Create a short link from any http/https URL
- List of your links with the short URL, the original URL, creation date and click counter
- Copy a short link to the clipboard in one click
- Protected pages: without a token you are redirected to the login page, and an expired token (401) logs you out automatically
- Loading states for requests, which matters because of the API cold start

## Stack

- **React** + **TypeScript**
- **Vite** for dev server and build
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- Plain `fetch` for API calls

## Getting Started

You need Node.js and a running backend. Either run the [backend](https://github.com/perflx/url-shortener) locally or use the deployed API.

```bash
# install dependencies
npm install

# point the app at an API
echo "VITE_API_URL=http://localhost:5000" > .env

# start the dev server
npm run dev
```

The app runs on `http://localhost:5173`.

### Configuration

| Variable       | Description                                   |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | Base URL of the API, without a trailing slash |

Vite only exposes variables that start with `VITE_`, and `.env` is read at startup, so restart the dev server after changing it. Vite also supports mode-specific files: `.env.development` is used by `npm run dev` and `.env.production` by `npm run build`.

The backend has to allow this app's address through CORS. Set `FRONTEND_URL` in the backend environment to the exact origin of the frontend (for local development: `http://localhost:5173`, no trailing slash).

### Scripts

| Script            | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload             |
| `npm run build`   | Type-check and build the production bundle       |
| `npm run preview` | Serve the production build locally               |

## Routes

| Path         | Page      | Notes                                      |
| ------------ | --------- | ------------------------------------------ |
| `/login`     | Login     | Redirects to the dashboard on success      |
| `/register`  | Register  | Link back to login                         |
| `/dashboard` | Dashboard | Requires a token, otherwise goes to login  |

## How authentication works

1. The login (or registration) request returns a JWT.
2. The token is saved in `localStorage` and sent to the API in the header `Authorization: Bearer <token>`.
3. If the API answers 401, the token is removed and the user is sent back to the login page.
4. Logging out simply removes the token.

`localStorage` is simple and fine for a project like this, but any script running on the page can read it. A production service with sensitive data would normally use `httpOnly` cookies instead.

Short links point to the API domain (`<API>/<shortCode>`), because the redirect itself is handled by the backend.

## Project Structure

```
src/
  pages/        # LoginPage, RegisterPage, DashboardPage
  types.ts      # TypeScript types for API responses (User, Link)
  App.tsx       # route definitions
  main.tsx      # entry point, router setup
```

Types for the API responses are written by hand in `types.ts`, so they need updating if the backend response format changes.

## Deployment

The app is built as a static site (`npm run build` produces the `dist` folder) and can be hosted on any static host. Example settings for a Render Static Site:

- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Rewrite rule:** `/*` to `/index.html`. This is required for a single-page app, otherwise reloading a page such as `/dashboard` returns a 404.
- **Environment:** `VITE_API_URL` pointing to the deployed API

After the first deploy, add the frontend's address to `FRONTEND_URL` in the backend environment so CORS allows it.
