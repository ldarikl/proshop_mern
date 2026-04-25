# Repository Guidelines

## Project Structure & Module Organization

This is a MERN eCommerce app with a Node/Express API and a Create React App frontend.

- **`backend/server.js`**: Starts the API, connects middleware, serves uploads, and serves the frontend build in production.
- **`backend/routes`, `controllers`, `models`, `middleware`**: Hold API endpoints, business logic, Mongoose schemas, and request guards.
- **`backend/data` & `seeder.js`**: Provide sample seed data and database import/destroy scripts.
- **`frontend/src`**: Contains React screens, reusable components, Redux actions/reducers/constants, and global styles.
- **`frontend/public`**: Contains static CRA assets. `uploads` stores uploaded files and example media.

---

## Build, Test, and Development Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Installs backend dependencies from the repository root. |
| `npm install --prefix frontend` | Installs frontend dependencies. |
| `npm run dev` | Runs backend and frontend together with `concurrently`. |
| `npm run server` | Runs only the API with `nodemon`. |
| `npm run client` | Runs only the CRA dev server via the frontend package. |
| `npm run data:import` | Seeds MongoDB with sample users/products. |
| `npm run data:destroy` | Removes seeded data. |
| `npm run build --prefix frontend` | Creates the production frontend build. |
| `npm test --prefix frontend` | Runs CRA/Jest tests in watch mode. |

---

## Coding Style & Naming Conventions

- **Module System**: Use modern JavaScript ES modules throughout the backend.
- **Imports**: Always include **`.js` extensions** on local backend imports.
- **Formatting**:
  - 2-space indentation
  - No semicolons
  - Single quotes
  - Concise arrow functions
- **Naming Conventions**:
  - **React Components**: PascalCase files (e.g., `ProductScreen.js`).
  - **Redux Files**: camelCase groups (e.g., `productActions.js`).
  - **Constants**: Uppercase names exported from `*Constants.js`.

---

## Testing Guidelines

- **Frontend**: Configured through `react-scripts` with Jest and React Testing Library. 
- **Placement**: Add tests near the code they cover using CRA-supported names like `Component.test.js` or `feature.test.js`.
- **Backend**: No test runner configured yet. Document any manual API checks in the PR when changing controllers, routes, auth, or database behavior.

---

## Commit Conventions

Every commit message **MUST** be prefixed with `COURSE:`:

```text
COURSE: Fix cart calculation for discounted items
COURSE: Add product review validation
```

**Example of a good multi-line commit:**
```text
COURSE: Fix dev environment setup for modern Node.js

  - Add NODE_OPTIONS=--openssl-legacy-provider for webpack compatibility with Node v24
  - Change dev server port from 5000 to 5001 to avoid macOS AirPlay conflict
  - Add .idea to .gitignore
  - Add Docker script for local MongoDB
  - Update package-lock files
```

---

## Code Quality

- **Naming**: Clear variable and function naming.
- **DRY**: Don't repeat yourself — no duplicated logic.
- **SOLID**: Follow SOLID principles for maintainable code.