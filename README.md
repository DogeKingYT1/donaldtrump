# ShowMeTheLight — Next.js conversion

This repository has been migrated to a Next.js app to allow deployment on Netlify using the official plugin.

Quick start:

1. Set environment variables (Netlify UI or locally):

  - `SUPABASE_URL` — your Supabase project URL
  - `SUPABASE_KEY` — anon/public key for reading
  - `SUPABASE_SERVICE_ROLE_KEY` — (or SUPABASE_KEY) for insert/delete server actions
  - `ADMIN_PASSWORD` — password to login in Admin UI
  - `ADMIN_TOKEN` — token returned by login (should be secret and unpredictable)

2. Install and run locally:

```bash
npm install
npm run dev
```

3. Build for Netlify:

```bash
npm run build
```

Netlify: uses `@netlify/plugin-nextjs` via `netlify.toml` to build and deploy.
