# Server environment setup

Create this file exactly:

`server/.env`

Do NOT name it `.emv` or `.env.txt`.

Example:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_sender@gmail.com
EMAIL_PASS=your_google_app_password
```

Then run from the `server` folder:

```powershell
npx nodemon server.js
```

The server now loads `server/.env` using the location of `server.js`, so it does not depend on the current working directory.
