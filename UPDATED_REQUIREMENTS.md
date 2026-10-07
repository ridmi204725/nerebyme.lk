# nearbyme.lk - Updated Requirements Implemented

## 1. User comments / Admin Dashboard
- Authenticated users submit comments through `POST /api/reviews/items/:id/reviews`.
- The legacy `POST /api/admin/items/:id/reviews` endpoint remains available for compatibility.
- User identity is resolved from the authenticated account on the server; the client cannot impersonate another user's name/email.
- Admin dashboard endpoints:
  - `GET /api/admin/reviews`
  - `PUT /api/admin/items/:id/reviews/:reviewId`
  - `DELETE /api/admin/items/:id/reviews/:reviewId`
- Rating and `reviewsCount` are recalculated after edits/deletes.
- Existing `client/src/pages/AdminDashboard.jsx` was intentionally left unchanged.

## 2. Public entry / registration flow
- `/` -> loading -> smart entry.
- Brand-new visitor -> `/home` first.
- First attempt to open a protected feature after visiting Home -> `/register`.
- Returning registered but logged-out user -> `/login`.
- Existing valid session -> continues directly to the requested user page.
- Direct deep-link from a brand-new browser is also sent to Home first.

## 3. Global notifications
- Added one global notification component rendered above the application UI.
- User-facing action messages are shown at the top-center and auto-dismiss.
- Notifications use the selected language: English, Sinhala, or Tamil.
- Common listing/review/login/action notifications have translations.

## 4. Language / theme
- Default language is English.
- `selectedLanguage` and the legacy `lang` key are kept synchronized.
- Dark/light mode state is synchronized through document data attributes.
- User-facing light-mode normalization is scoped under MainLayout only, so the existing Admin Dashboard visual system is not modified.

## 5. New files
- `client/src/components/GlobalNotification.jsx`
- `client/src/components/RegistrationGate.jsx`
- `client/src/utils/notifications.js`
- `server/routes/reviewRoutes.js`
- `server/routes/itemRoutes.js`

## 6. Important server fixes
- Fixed the duplicate `const { id } = req.params` error in the review controller.
- Fixed token verification to use the same fallback secret behavior as token creation.
- `/api/auth/me` now loads the real user record instead of returning only the JWT payload.
- Public detail pages now use `GET /api/items/:id`.
- Review submissions now use `/api/reviews/items/:id/reviews`.
