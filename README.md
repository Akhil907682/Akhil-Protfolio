# Akhil Singh - Professional Portfolio Project

This repository contains both the React/Vite frontend and the Express/Node backend for **Akhil Singh's Professional Portfolio**.

---

## Directory Architecture

```
Akhil's Protfolio/
├── backend/            # Express.js REST API with MVC Architecture & MongoDB
└── frontend/           # React + Vite + Tailwind CSS Single Page Application
```

For detailed specifications, configurations, and API documentation, please refer to the respective project readmes:
- 📖 [Backend Documentation (backend/README.md)](file:///c:/Users/Akhil%20Singh/Desktop/Akhil's%20Protfolio/backend/README.md)
- 📖 [Frontend Documentation (frontend/README.md)](file:///c:/Users/Akhil%20Singh/Desktop/Akhil's%20Protfolio/frontend/README.md)

---

## How to Get Started

### 1. Prerequisite Setup
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and [MongoDB](https://www.mongodb.com/) (local database or MongoDB Atlas account) configured.

---

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration and update database connection variables in `.env`:
   ```bash
   # Make sure .env exists in backend/ directory.
   ```
4. Seed the default administrator account:
   ```bash
   npm run seed:admin
   ```
5. Run the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend will run on **`http://localhost:5000`**.

---

### 3. Frontend Setup
1. Open a new terminal window/tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```
   Vite will host the frontend application at **`http://localhost:5173`** (or next available port).
