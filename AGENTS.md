# Repository Guidelines

## Project Structure & Module Organization

This is a MERN eCommerce app with a Node/Express API and a Create React App frontend.

- `backend/server.js` starts the API, connects middleware, serves uploads, and serves the frontend build in production.
- `backend/routes`, `backend/controllers`, `backend/models`, and `backend/middleware` hold API endpoints, business logic, Mongoose schemas, and request guards.
- `backend/data` and `backend/seeder.js` provide sample seed data and database import/destroy scripts.
- `frontend/src` contains React screens, reusable components, Redux actions/reducers/constants, and global styles.
- `frontend/public` contains static CRA assets. `uploads` stores uploaded files and example media.

## Build, Test, and Development Commands

- `npm install` installs backend dependencies from the repository root.
- `npm install --prefix frontend` installs frontend dependencies.
- `npm run dev` runs backend and frontend together with `concurrently`.
- `npm run server` runs only the API with `nodemon`.
- `npm run client` runs only the CRA dev server via the frontend package.
- `npm run data:import` seeds MongoDB with sample users/products.
- `npm run data:destroy` removes seeded data.
- `npm run build --prefix frontend` creates the production frontend build.
- `npm test --prefix frontend` runs CRA/Jest tests in watch mode.


## Coding Style & Naming Conventions

Use modern JavaScript ES modules throughout the backend; include `.js` extensions on local backend imports. Existing code uses 2-space indentation, no semicolons, single quotes, and concise arrow functions. Keep React components in PascalCase files such as `ProductScreen.js`, Redux files in camelCase groups such as `productActions.js`, and constants in uppercase names exported from `*Constants.js`.

## Testing Guidelines

Frontend testing is configured through `react-scripts` with Jest and React Testing Library. Add tests near the code they cover using CRA-supported names like `Component.test.js` or `feature.test.js`. There is no backend test runner configured yet, so document any manual API checks in the PR when changing controllers, routes, auth, or database behavior.

# Local Development Gotchas

## Commit Conventions
Every commit message must be prefixed with `COURSE:`:

```
COURSE: Fix cart calculation for discounted items
COURSE: Add product review validation
```

Example of a good commit:
```
COURSE: Fix dev environment setup for modern Node.js

  - Add NODE_OPTIONS=--openssl-legacy-provider for webpack compatibility with Node v24
  - Change dev server port from 5000 to 5001 to avoid macOS AirPlay conflict
  - Add .idea to .gitignore
  - Add Docker script for local MongoDB
  - Update package-lock files
```

## Database Seeding:
After modifying Mongoose schemas, update the sample data in `backend/data/` and run `npm run data:import` to ensure environment consistency.

## Code Quality
- Clear variable/function naming
- DRY — no duplicated logic
- SOLID Principles