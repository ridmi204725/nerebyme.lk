# nearbyme.lk implementation update

## Implemented
- User listing submissions now go through `/api/seller/items`; submissions are forced to `pending`/`isApproved:false`.
- Public listing/detail endpoints expose only approved records.
- Admin item CRUD remains protected by `verifyAdmin`.
- Added admin-only package/menu/promotional image CRUD:
  - POST `/api/admin/items/:id/packages`
  - PUT `/api/admin/items/:id/packages/:packageId`
  - DELETE `/api/admin/items/:id/packages/:packageId`
- Added `/admin/content` UI and a button from the Admin Dashboard.
- Added `packageImages` to the Item model. Admin can select an image file, preview it, add/edit/delete it.
- Package image gallery is shown on Food, Hotel, Dayout, Travel and Movie detail pages.
- Added dedicated `DetailsFunction.jsx` and `/functions/:id`; clicking a function/event now opens its dedicated detail page.
- Hotels already had the requested structure and it is preserved:
  - Indoor -> Luxury / Budget
  - Outdoor -> Luxury / Budget
  - Rooms -> existing categories unchanged.
- Dayout categories changed to:
  - Family
  - Couple
- Travel categories changed to:
  - Historical & Heritage
  - Hill Country & Nature
  - Beaches & Water Sports
  - Wildlife & Safaris
  - Religious & Pilgrimage
  - Adventure & Camping
  - Others
- Added Apple login backend endpoint and Apple JS integration hooks.
- Facebook login backend was already present; client now loads the Facebook SDK when `VITE_FACEBOOK_APP_ID` is configured.

## Important authentication configuration
Copy `client/.env` to `client/.env` and set real provider credentials.

Apple Sign-In requires an Apple Service ID / client ID and a registered redirect URI.

Facebook Login requires a Facebook App ID and the correct OAuth/login product configuration.

The Apple backend currently extracts claims from the returned identity token; production deployment should additionally verify the Apple JWT signature against Apple's published keys before creating/signing in an account.

## Run
1. `cd server && npm install && npm start`
2. `cd client && npm install && npm run dev`
3. MongoDB must be available and the server `.env` must contain the existing MongoDB/JWT settings.

## Build verification
The provided archive's existing Linux `node_modules` was incomplete for Rollup in this environment, so the client build could not be completed here. Run `npm install` in `client` and then `npm run build` locally.
