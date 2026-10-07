# NearbyMe GitHub Pages deployment

## Frontend
The React/Vite frontend is deployed from `client/dist` using the root workflow:
`.github/workflows/deploy-pages.yml`.

GitHub Pages must be configured to use **GitHub Actions** as the source.
The custom domain is `nearbyme.lk`.

## Backend
GitHub Pages cannot run the Express/Node.js backend. Deploy `server/` separately (for example on Render/Railway/VPS) and set the GitHub repository variable:

`VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN`

Do not put MongoDB URI, JWT secret, Gmail password, or other backend secrets in frontend files or GitHub Pages variables.

## Local development

```bash
cd client
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm start
```
