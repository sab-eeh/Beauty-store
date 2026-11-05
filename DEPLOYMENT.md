# Vercel deployment

This repository is configured as one Vercel project with two services:

- `frontend` serves the Vite app at `/` and all non-API paths.
- `backend` serves the Express API at `/api/*`.

## Deploy

1. Import the repository in Vercel and leave the project root set to the repository root.
2. Add these backend environment variables for Production, Preview, and Development as needed:
   - `MONGO_URI`: a MongoDB connection string reachable from Vercel.
   - `JWT_SECRET`: a long, unique random secret.
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`: credentials for the seeded administrator.
   - `NODE_ENV=production`.
   - `CLIENT_ORIGIN`: optional comma-separated browser origins for cross-origin clients. Same-origin traffic does not require CORS.
3. Deploy. Vercel routes `/api/*` to the backend; the frontend receives other paths.

Do not set Vercel's `VITE_API_URL` to a deployment hostname. The frontend uses the same-origin `/api` path. `VITE_API_PROXY_TARGET` is only for local Vite development and defaults to `http://localhost:5000`.

## Local Vercel services

Install the Vercel CLI, create `Backend/.env` from `Backend/.env.example`, then run `vercel dev --local` from the repository root. The local backend entrypoint reads that file; deployed functions read Vercel environment variables.

The current frontend storefront uses mock products, localStorage authentication, cart, and orders. Deploying the backend does not switch these screens to MongoDB-backed API calls.

## Credentials

Never commit `.env` files. If credentials from a tracked or previously pushed `.env` have been used, rotate them before deploying; removing the file from the current Git tree does not erase it from prior Git history.
