# ProShop MERN

ProShop MERN - учебный интернет-магазин на MongoDB, Express, React и Node.js. В приложении есть каталог товаров, корзина, оформление заказов, JWT-авторизация, профиль пользователя, отзывы, PayPal sandbox и админ-панель для управления товарами, пользователями и заказами.

## Tech Stack

Версии взяты из `package.json` и `frontend/package.json`.

### Backend

- Node.js: нужен Node `14.6+`, потому что backend использует ES modules
- Express: `^4.17.1`
- MongoDB + Mongoose: `^5.10.6`
- JWT: `jsonwebtoken ^8.5.1`
- Password hashing: `bcryptjs ^2.4.3`
- File upload: `multer ^1.4.2`
- Dev server: `nodemon ^2.0.4`
- Env config: `dotenv ^8.2.0`

### Frontend

- React: `^16.13.1`
- Create React App / react-scripts: `3.4.3`
- Redux: `^4.0.5`
- React Redux: `^7.2.1`
- Redux Thunk: `^2.3.0`
- React Router DOM: `^5.2.0`
- React Bootstrap: `^1.3.0`
- Axios: `^0.20.0`
- PayPal button: `react-paypal-button-v2 ^2.6.2`

## Project Structure

```text
.
├── backend
│   ├── config          # MongoDB connection
│   ├── controllers     # Business logic for API routes
│   ├── data            # Seed data for users and products
│   ├── middleware      # Auth and error middleware
│   ├── models          # Mongoose models
│   ├── routes          # Express route definitions
│   ├── utils           # Shared backend helpers
│   ├── seeder.js       # Import/destroy seed data
│   └── server.js       # Express app entry point
├── frontend
│   ├── public          # CRA static files
│   └── src
│       ├── actions     # Redux async actions and API calls
│       ├── components  # Reusable UI components
│       ├── constants   # Redux action type constants
│       ├── reducers    # Redux reducers
│       ├── screens     # Page-level React screens
│       ├── App.js      # React routes
│       ├── index.js    # Frontend entry point
│       └── store.js    # Redux store setup
├── uploads             # Uploaded product images
├── package.json        # Backend scripts and dependencies
└── frontend/package.json
```

## Prerequisites

- Node.js `14.6+`. Node 14 or 16 is the least problematic choice for this older CRA project.
- npm.
- MongoDB running locally or a MongoDB Atlas URI.
- PayPal sandbox client ID if you want to test checkout payments.

## Environment Variables

Create `.env` in the project root. You can start from the committed example:

```bash
cp .env.example .env
```

Root `.env` values:

```env
NODE_ENV=development
PORT=5005
MONGO_URI=mongodb://127.0.0.1:27017/proshop
JWT_SECRET=abc123
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

These values are read by backend code:

- `NODE_ENV` controls development/production behavior in `backend/server.js`.
- `PORT` controls the API port. The frontend proxy currently points to `http://127.0.0.1:5005`.
- `MONGO_URI` is used by `backend/config/db.js`.
- `JWT_SECRET` is used to sign and verify auth tokens.
- `PAYPAL_CLIENT_ID` is returned from `/api/config/paypal`. Use a PayPal sandbox client ID for checkout testing.

Create `frontend/.env`:

```env
HOST=127.0.0.1
NODE_OPTIONS=--openssl-legacy-provider
```

`NODE_OPTIONS=--openssl-legacy-provider` is needed on newer Node versions because this project uses `react-scripts 3.4.3`.

## Install

Install backend dependencies from the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
npm install --prefix frontend
```

For a clean install from lockfiles, use:

```bash
npm ci
npm ci --prefix frontend
```

## Database

Start MongoDB first, then seed sample users and products:

```bash
npm run data:import
```

Destroy seeded users, products, orders and reviews:

```bash
npm run data:destroy
```

Sample logins after seeding:

```text
admin@example.com / 123456
john@example.com / 123456
jane@example.com / 123456
```

## Run Locally

Run backend and frontend together:

```bash
npm run dev
```

Open the app:

```text
http://127.0.0.1:3000
```

The API runs on:

```text
http://127.0.0.1:5005
```

Run backend only:

```bash
npm run server
```

Run frontend only:

```bash
npm run client
```

If you run the frontend only, start the backend first. API calls go through the CRA proxy in `frontend/package.json`.

## Build

Create a production frontend build. On Node 17+ use `NODE_OPTIONS`, because this project uses older `react-scripts`:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build --prefix frontend
```

Run the production build through Express:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build --prefix frontend
NODE_ENV=production npm start
```

In production mode, `backend/server.js` serves `frontend/build`.

## Troubleshooting

### Backend starts on the wrong port

`backend/server.js` falls back to port `5000` if `PORT` is missing. This project is configured to use `5005`, because macOS can reserve port `5000` for AirPlay. Check the root `.env`:

```env
PORT=5005
```

### Frontend API requests fail

The frontend proxy is:

```json
"proxy": "http://127.0.0.1:5005"
```

Make sure the backend is running on the same port. If you change `PORT`, update the proxy too.

### MongoDB connection error

Make sure MongoDB is running and `MONGO_URI` is valid:

```env
MONGO_URI=mongodb://127.0.0.1:27017/proshop
```

For Atlas, also check that your current IP address is whitelisted.

### React OpenSSL error

With newer Node versions, older `react-scripts` can fail with an OpenSSL error. The frontend start script already includes:

```bash
NODE_OPTIONS=--openssl-legacy-provider react-scripts start
```

For builds, run:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build --prefix frontend
```

### PayPal button does not load

Check `PAYPAL_CLIENT_ID` in the root `.env`. For local sandbox testing, `sb` can be used as a basic sandbox value, but a real sandbox client ID is better for full checkout testing.

### Changes to models or env variables do not apply

Restart the backend after changing Mongoose models or root `.env`. Restart the frontend after changing `frontend/.env`.

## Useful Scripts

```bash
npm run dev                  # backend + frontend
npm run server               # backend only
npm run client               # frontend only
npm run data:import          # seed database
npm run data:destroy         # clear seeded data
NODE_OPTIONS=--openssl-legacy-provider npm run build --prefix frontend
npm test --prefix frontend
```

## License

MIT
