# NearbyMe.lk Update

Implemented:
- Admin users/submissions view with `createdBy` ownership information.
- Admin comment/review manager: edit/delete from Admin Dashboard.
- Server-side review storage is now the source of truth; detail pages no longer merge browser-local comments.
- Registration now sends a 6-digit email OTP before creating the account.
- OTP verification + resend endpoints.
- Shared responsive listing-card styling and typography helpers.
- Six visible themes: Blue, Green, Purple, Orange, Rose, Cyan.
- Admin-managed package/menu image gallery on Food, Hotel, Travel, Dayout and Movie detail pages where applicable.
- Responsive package gallery with thumbnails and navigation.
- Added responsive/mobile polish.

## Environment

Copy `server/.env.example` to `server/.env` and fill in:
- MongoDB URI
- JWT secret
- SMTP/Gmail credentials

Do not commit `.env`.

## Important security action

The uploaded project contained live-looking database/email credentials in `server/.env`. The updated package intentionally excludes that file. Rotate/revoke those credentials before deploying if they were ever used outside your local environment.
