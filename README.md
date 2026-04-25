# ProShop eCommerce Platform

> eCommerce platform built with the MERN stack & Redux.

### THIS PROJECT IS DEPRECATED
This project is no longer supported. The new project/course has been released. The code has been cleaned up and now uses Redux Toolkit. You can find the new version [HERE](https://github.com/bradtraversy/proshop-v2)

![screenshot](https://github.com/bradtraversy/proshop_mern/blob/master/uploads/Screen%20Shot%202020-09-29%20at%205.50.52%20PM.png)

## Features

- Full featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)

## Note on Issues
Please do not post issues here that are related to your own code when taking the course. Add those in the Udemy Q/A. If you clone THIS repo and there are issues, then you can submit

## Usage

### Prerequisites

- Node.js v14.6+ is required because the backend uses ES modules. Node 14 or 16 is recommended for the least friction with this older CRA setup.
- MongoDB must be running before starting the API. Use a local MongoDB instance or a MongoDB Atlas connection string.
- A PayPal sandbox client ID is needed only for testing checkout payments.

### ES Modules in Node

We use ECMAScript Modules in the backend in this project. Be sure to have at least Node v14.6+ or you will need to add the "--experimental-modules" flag.

Also, when importing a file (not a package), be sure to add .js at the end or you will get a "module not found" error

You can also install and setup Babel if you would like

### Env Variables

Create a `.env` file in the project root and add the following values:

```
NODE_ENV=development
PORT=5005
MONGO_URI=your mongodb uri
JWT_SECRET=abc123
PAYPAL_CLIENT_ID=your paypal sandbox client id
```

The frontend proxy is configured in `frontend/package.json` to call `http://127.0.0.1:5005`, so keep `PORT=5005` unless you also update that proxy value.

The frontend also has its own `frontend/.env` for CRA runtime options:

```
HOST=127.0.0.1
NODE_OPTIONS=--openssl-legacy-provider
```

The `NODE_OPTIONS` value helps older `react-scripts` work on newer Node versions during development.

### Install Dependencies (frontend & backend)

```
npm install
npm install --prefix frontend
```

Use `npm ci` and `npm ci --prefix frontend` instead when you want a clean install from the committed lockfiles.

### Seed Database

After MongoDB is available and the root `.env` file is configured, import the sample users and products:

```
npm run data:import
```

To clear seeded data:

```
npm run data:destroy
```

### Run

```
# Run frontend (http://127.0.0.1:3000) & backend (http://127.0.0.1:5005)
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

When running the frontend only, start the backend first so the CRA proxy can reach the API.

### First Run Checklist

1. Clone the repository.
2. Install root dependencies: `npm install`.
3. Install frontend dependencies: `npm install --prefix frontend`.
4. Create the root `.env` file with `NODE_ENV`, `PORT`, `MONGO_URI`, `JWT_SECRET`, and `PAYPAL_CLIENT_ID`.
5. Start MongoDB or verify that your Atlas URI is reachable.
6. Seed the database with `npm run data:import`.
7. Start the app with `npm run dev`.
8. Open `http://127.0.0.1:3000`.

## Build & Deploy

```
# Create frontend prod build
npm run build --prefix frontend
```

If the build fails on a newer Node version with an OpenSSL error, run:

```
NODE_OPTIONS=--openssl-legacy-provider npm run build --prefix frontend
```

The production server serves `frontend/build` when `NODE_ENV=production`.

To run the production build locally:

```
npm run build --prefix frontend
NODE_ENV=production npm start
```

Then open the backend URL, for example `http://127.0.0.1:5005` when `PORT=5005`.

There is a Heroku postbuild script, so if you push to Heroku, no need to build manually for deployment to Heroku.

```
Sample User Logins

admin@example.com (Admin)
123456

john@example.com (Customer)
123456

jane@example.com (Customer)
123456
```


## License

The MIT License

Copyright (c) 2020 Traversy Media https://traversymedia.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
