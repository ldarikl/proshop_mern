# Architecture

## C4 Container

```mermaid
C4Container
  title ProShop MERN - Container Diagram

  Person(customer, "User", "Uses the eCommerce web application")

  System_Boundary(app, "ProShop MERN") {
    Container(frontend, "Frontend SPA", "React, Redux, React Router, CRA", "Product browsing, cart, checkout, profile, and admin screens")
    Container(backend, "Backend API", "Node.js, Express", "REST API for products, users, orders, uploads, JWT auth, and PayPal config")
    ContainerDb(db, "MongoDB", "MongoDB via Mongoose", "Stores users, products, orders, and reviews")
    Container(storage, "Uploads Directory", "Local filesystem", "Stores uploaded product images")
  }

  System_Ext(paypal, "PayPal JavaScript SDK", "External payment SDK loaded in the browser")

  Rel(customer, frontend, "Uses", "HTTP")
  Rel(frontend, backend, "Calls REST endpoints", "Axios / JSON")
  Rel(frontend, paypal, "Loads SDK and submits payment", "HTTPS")
  Rel(backend, db, "Reads and writes data", "Mongoose")
  Rel(backend, storage, "Writes uploads and serves static files", "Multer / Express static")
  Rel(backend, frontend, "Serves built SPA in production", "Express static")
```

## Description

The frontend is a Create React App single-page application. Routing is handled in `frontend/src/App.js`, application state is managed through Redux in `frontend/src/store.js`, and API access goes through Redux actions using Axios.

The backend starts in `backend/server.js`. It exposes REST routes under `/api/products`, `/api/users`, `/api/orders`, and `/api/upload`; route handlers delegate to controllers and Mongoose models. Protected routes use JWT verification from `backend/middleware/authMiddleware.js`.

MongoDB is accessed through Mongoose using `MONGO_URI` in `backend/config/db.js`. Uploaded product images are written to the local `uploads/` directory and served from `/uploads`.

PayPal integration is implemented in the browser: `OrderScreen.js` requests `/api/config/paypal` for the client id, loads `https://www.paypal.com/sdk/js`, and sends the payment result back to the backend order API.
