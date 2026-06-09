# Drawing App (with Node + MongoDB authentication)

This project is a simple drawing application with user authentication backed by MongoDB.

Overview
- Frontend: simple HTML/CSS/JS pages in the project root (`index.html`, `signin.html`, `signup.html`).
- Backend: Express server with API routes under `/api/auth` (located in `backend/`). The server also serves the frontend files.
- Auth: JWT-based authentication, passwords hashed with `bcryptjs`.

What you need to do
1. Install backend dependencies

```bash
cd backend
npm install
```

2. Create a `.env` file in the project root (next to `README.md`) and add these values (copy from `.env.example`):

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start the server

```bash
cd backend
npm run start
```

The server will connect to MongoDB and serve the frontend at `http://localhost:5000`.

Notes for beginners
- No external services are used other than MongoDB (you can use Atlas or a local instance).
- The frontend stores the JWT token in Local Storage to remember the session between reloads.
- The drawing board code is unchanged; authentication is separated to the backend.
