# Quillio

Quillio is a small blog app built with **React**, **TypeScript**, **Vite**, and **Supabase**. It uses **Redux Toolkit** for client-side state, Tailwind tooling via `@tailwindcss/vite`, and ESLint for linting.

---

## Table of Contents

- **About**
- **Features**
- **Prerequisites**
- **Environment variables**
- **Getting started**
- **Available scripts**
- **Project structure**
- **Development notes**
- **Testing & Deployment**
- **Contributing**
- **License

---

## About

A minimal blogging application focused on a clean codebase and developer experience. Users can register and log in, create and edit blogs, view their posts, and manage settings.

## Features

- User authentication (Supabase)
- Create, read, update, delete blog posts
- Modal-based forms for creating and editing posts
- User-specific "My Blogs" view
- Settings and user profile handling
- Client-side state management with **Redux Toolkit**

## Prerequisites

- Node.js (recommend LTS)
- npm (installed with Node)

## Environment variables

Create a `.env` (or `.env.local`) file at the project root with at least the following variables required by the Supabase client:

```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

The Supabase client is created in `src/supabaseClient.ts` and reads those `VITE_` prefixed variables.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Add environment variables as shown above.

3. Run in development mode:

```bash
npm run dev
```

4. Open the development server URL printed by Vite (usually `http://localhost:5173`).

## Available scripts

- `npm run dev` — Run the dev server (Vite)
- `npm run build` — Run TypeScript build (`tsc -b`) and produce a production build with Vite
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint across the project

These scripts are defined in `package.json` and are the standard Vite + TypeScript flow.

## Project structure (key files)

- `src/`
  - `main.tsx` — App bootstrap
  - `App.tsx` — Root component and routes
  - `supabaseClient.ts` — Supabase client (uses `VITE_` env vars)
  - `pages/` — App pages: `Home`, `Login`, `Register`, `MyBlogs`, `Settings`
  - `components/` — UI components (Blog form, Blog card, Header, modals, etc.)
  - `slice/` — Redux slice(s) (e.g., `userSlice.ts`)
  - `store/` — Redux store configuration
  - `types/` — TypeScript declarations (including Supabase types)
  - `utils/` — Utilities (date formatting, etc.)

## Development notes

- This project uses **TypeScript**; the build step runs `tsc -b` to ensure type checks before bundling.
- State management relies on **Redux Toolkit** (`@reduxjs/toolkit`) and `react-redux` hooks.
- ESLint is configured; run `npm run lint` to check for style and code issues.
- Tailwind is included as a dev dependency via `@tailwindcss/vite` — check `tailwind.config` if present.

## Testing & Deployment

- There are no automated tests included by default. You can add a test runner like Vitest, Jest, or Playwright if desired.
- For deployment, build the app with:

```bash
npm run build
```

Host the generated `dist/` output on any static hosting platform (Netlify, Vercel, Cloudflare Pages, etc.). Ensure the production environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) are set in your deployment platform.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests if applicable
4. Run `npm run lint` and ensure type checks pass
5. Open a PR with a clear description of the change

## License

Add a license file (for example `LICENSE`) and update this section accordingly.

---

If you'd like, I can add a `CONTRIBUTING.md`, CI configuration, or sections for deployment provider examples.
