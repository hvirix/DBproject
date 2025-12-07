# Shopping List Application (MERN Stack)

This project is a full-stack web application for creating and managing shopping lists. It is built using the MERN stack (MongoDB, Express, React, Node.js).

The frontend is built with React using Vite for a fast development experience. The backend is implemented with Node.js and Express, connected to a MongoDB database.

---

## React + Vite Configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### ESLint Configuration
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Backend (Express.js + MongoDB)

The server-side of the project handles API requests, database operations, and business logic.

### Technologies
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web server framework for handling HTTP requests.
- **Mongoose**: ODM library for MongoDB interaction.
- **CORS**: Middleware to enable cross-origin requests from the frontend.
- **MongoDB**: Database for storing lists and items.

### API Documentation
The server runs on port `5000` and provides the following endpoints:

#### Lists
- `GET /lists` — Retrieve all shopping lists.
- `POST /lists` — Create a new list.
- `DELETE /lists/:id` — Delete a list (and all associated items).

#### Items
- `GET /items?listId={id}` — Retrieve items for a specific list.
- `POST /items` — Add a new item to a list.
- `PUT /items/:id` — Update an item name.
- `DELETE /items/:id` — Delete an item.

---

## Installation and Setup

Ensure you have **Node.js** and **MongoDB** installed and running on your machine.

### 1. Backend Setup
Open a terminal and navigate to the server directory:

```bash
cd server
npm install
node server.js

2. Frontend Setup
Open a new terminal window (keep the server running) and navigate to the client directory:
cd client
npm install
npm run dev
