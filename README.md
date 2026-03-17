<div align="center">
  <h1>🏘️ QBR Inventory — Dealer Network</h1>
  <p><strong>A B2B Lead-Sharing Platform for Property Dealers in Islamabad's Developing Sectors</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB?style=flat-square&logo=react" alt="Frontend" />
    <img src="https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-009688?style=flat-square&logo=fastapi" alt="Backend" />
    <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb" alt="Database" />
  </p>
</div>

<br />

## 📖 What is QBR Inventory?

In the rapidly developing sectors of Islamabad (like G-13, G-14, B-17, D-12, etc.), real estate dealers frequently have clients looking for specific plots ("Needs") or clients looking to sell inventory ("Available"). **QBR Inventory** is a specialized, private B2B network designed exclusively for these dealers to easily share and match their unlisted inventory.

Instead of navigating thousands of WhatsApp group messages, dealers can log in, post what they have or need, and the platform's automatic matching engine instantly connects the right buyers and sellers.

### ✨ Key Features

*   **🔍 Instant Matchmaking:** Post a "Need" (e.g., *Looking for a 10 Marla plot in G-13*) and instantly see if another dealer has posted it as "Available".
*   **📋 Listing Management:** Easily manage your personal portfolio of active plots, shops, and commercial spaces.
*   **🔔 Real-Time Match Alerts:** Receive notifications immediately when new listings enter the system that match your previous requests.
*   **🔒 Secure Dealer Network:** JWT-based authentication ensures that contact information is only visible to registered dealers.
*   **🤝 Deal Workflows:** Accept or reject matches, closing the loop once a property changes hands.

---

## 💻 Tech Stack & Architecture

This application is built as a highly performant, type-safe full-stack application.

### Frontend
*   **Framework:** React 19 (via Vite)
*   **Language:** TypeScript
*   **Styling:** Custom CSS (Modular, Modern Design)
*   **State / Fetching:** custom React Hooks, Axios Integrations

### Backend
*   **Framework:** FastAPI (Python 3.12+)
*   **Database:** MongoDB (Motor Async Driver)
*   **Authentication:** JWT (JSON Web Tokens) with `passlib` & `python-jose`
*   **Validation:** Pydantic Models

---

## 🚀 Getting Started (Local Development)

To run this application locally, you will need **Node.js**, **Python 3.10+**, and a running instance of **MongoDB** (local or Atlas cluster).

### 1. Database & Backend Setup

Navigate to the backend directory and set up your Python environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=qbr_inventory
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Start the backend server:
```bash
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`, and the interactive Swagger Docs at `http://localhost:8000/docs`.*

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend

# Install Node modules
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The React application will be available at `http://localhost:5173`.*

---

## 📁 Project Structure

```text
qbr-inventory/
├── backend/                  # FastAPI Application
│   ├── main.py               # Application entry point & middleware
│   ├── database.py           # MongoDB connection setup
│   ├── models.py             # Pydantic schemas for data validation
│   ├── routes/               # API endpoint routers (auth, listings, matches)
│   └── utils/                # Helper functions (hashing, matching algorithms)
│
└── frontend/                 # React Vite Application
    ├── index.html            # Main HTML document
    ├── vite.config.ts        # Vite TS configuration
    └── src/
        ├── components/       # Reusable UI React components
        ├── context/          # React context providers (Auth)
        ├── hooks/            # Custom React hooks containing logic
        ├── pages/            # Top-level route pages (Auth, Dashboard)
        ├── services/         # Axios API wrapper functions
        └── utils/            # Shared constants, types, and helpers
```

---

<div align="center">
  <p>Built for the modern property dealer.</p>
</div>
