# AGENTS.md

## Overview

MERN eCommerce application with a Node.js + Express API and a Create React App frontend.

Core flows:
- Product browsing → React → API → MongoDB
- Authentication via JWT
- Cart & orders managed via Redux state + backend persistence
- Admin flows for product/user/order management

---

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React (CRA), Redux, React Router
- Auth: JWT-based authentication
- Dev tools: nodemon, concurrently
- Payments: PayPal (sandbox in development)

---

## Architecture

- Backend entry: `backend/server.js`
- Frontend entry: `frontend/src/index.js`

Backend structure:
- Routes: `backend/routes/*`
- Controllers: `backend/controllers/*`
- Models: `backend/models/*`
- Middleware: `backend/middleware/*`

Frontend structure:
- Screens: `frontend/src/screens/*`
- Components: `frontend/src/components/*`
- Redux: `frontend/src/actions`, `reducers`, `constants`

Data flow:
- React → Redux actions → API calls
- API → Controllers → Mongoose models → MongoDB
- Auth via middleware (`authMiddleware.js`) using JWT

---

## Commands

Install:
- `npm install`
- `npm install --prefix frontend`

Run:
- `npm run dev` — full stack
- `npm run server` — backend only
- `npm run client` — frontend only

Database:
- `npm run data:import` — seed DB
- `npm run data:destroy` — clear DB

Build:
- `npm run build --prefix frontend`

Tests:
- `npm test --prefix frontend`

---

## Conventions

- 2-space indentation, no semicolons, single quotes
- ES modules in backend (explicit `.js` imports)
- React components: PascalCase (`ProductScreen.js`)
- Redux files: camelCase (`productActions.js`)
- Constants: uppercase (`PRODUCT_LIST_REQUEST`)

Code structure:
- Business logic must be in controllers, not routes
- API calls must go through Redux actions
- Redux is the single source of truth for app state

---

## Local Development Gotchas

- Mongoose model changes require full server restart
- Changing `.env` requires restarting both frontend and backend
- Frontend depends on backend API (proxy config must match)
- Port 5000 may conflict on macOS (AirPlay)
- Seed script must be run manually after DB reset
- MongoDB must be running before starting backend

---

## Deployment Quirks

- Frontend must be built and served via Express in production
- Environment variables must be defined before server start
- MongoDB Atlas requires IP whitelist configuration
- PayPal requires sandbox credentials in development
- No runtime fallback for missing env variables

---

## What NOT to do

- Do not modify Mongoose schemas without restarting the server
- Do not call API directly from React components
- Do not introduce new global state outside Redux
- Do not mix business logic into route handlers
- Do not change API response structure without updating frontend
- Do not introduce new dependencies without clear need

---

## Unwritten Rules

### Team Conventions

- Commit messages must be prefixed with `COURSE:`
- Keep commits small and focused
- Separate backend and frontend changes logically
- Document manual testing steps in PRs for backend changes

### Local Gotchas

- After schema changes, update `backend/data/` and re-seed DB
- Backend must be started before frontend for correct API proxying
- JWT token must be included in Authorization header for protected routes

### Deployment

- Ensure correct MongoDB URI and credentials before deployment
- Verify PayPal config before testing checkout flow

---

## AI Usage Rules

- Always analyze existing code before generating new code
- Prefer extending existing patterns over introducing new ones
- Avoid adding new libraries unless necessary
- Keep changes minimal and focused
- Do not refactor multiple layers (backend + frontend) in one change
- Preserve existing API contracts unless explicitly changing both sides