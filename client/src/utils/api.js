/**
 * Central API base URL resolver.
 *
 * - In LOCAL dev  → uses window.location.hostname:5001  (your local Express server)
 * - In PRODUCTION (Vercel) → uses the same origin with NO port, because vercel.json
 *   rewrites /api/* to the serverless backend function automatically.
 *
 * Set VITE_API_BASE_URL in your Vercel project environment variables to override
 * everything, e.g. if the backend is on a separate Railway/Render deployment.
 */

const getApiBaseUrl = () => {
  // 1. Explicit env var always wins (set this in Vercel project settings if backend
  //    is on a separate host like Railway or Render)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2. Local development — backend runs on port 5001
  if (import.meta.env.DEV) {
    return `${window.location.protocol}//${window.location.hostname}:5001`;
  }

  // 3. Production (Vercel) — backend is served via vercel.json /api/* rewrite
  //    on the SAME origin. No port needed.
  return '';
};

export const API_BASE_URL = getApiBaseUrl();
