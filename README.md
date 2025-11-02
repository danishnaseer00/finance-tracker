# 💰 Finance Tracker

A **full-stack finance management application** that helps users track income, expenses, accounts, and budgets with an interactive dashboard.  
Built using **FastAPI** for the backend and **React + TypeScript + Vite** for the frontend.

---

## 🚀 Features

### 🔐 Authentication
- User registration and secure login using JWT authentication.
- Passwords are hashed with bcrypt for enhanced security.

### 💼 Accounts & Transactions
- Add multiple accounts (bank, cash, credit card, etc.)
- Record and manage transactions with categories and payment methods.
- Real-time balance updates for each account.

### 📊 Dashboard & Analytics
- Interactive charts for income, expenses, and balance over time.
- Visual breakdowns using **Recharts** (Pie, Bar, Line).

### 📂 Categories & Budgets
- Default categories for income/expenses are auto-created for new users.
- Create and manage custom categories.
- Set monthly budgets by category and track spending limits.

### 🌙 Modern UI
- Built with **React + Styled Components** for a dark-themed responsive design.
- Organized file structure using React Router, Context API, and modular components.

---

## 🧱 Project Structure

finance-tracker/
│
├── backend/ # FastAPI backend
│ ├── app/
│ │ ├── main.py # API routes & endpoints
│ │ ├── models.py # SQLAlchemy models
│ │ ├── crud.py # Database CRUD logic
│ │ ├── auth.py # JWT authentication
│ │ ├── database.py # DB setup (SQLite by default)
│ │ └── schemas.py # Pydantic schemas
│ └── requirements.txt
│
├── frontend/ # React + TypeScript frontend
│ ├── src/
│ │ ├── pages/ # Dashboard, Login, Register, etc.
│ │ ├── components/ # Forms, Charts, Sidebar, etc.
│ │ ├── context/ # Auth context
│ │ ├── routes/ # Route protection and setup
│ │ └── themes/ # Global styles
│ ├── package.json
│ └── vite.config.ts
│
├── database/ # SQL schemas & seeds
│ ├── schema.sql
│ ├── seed.sql
│ 
│
├── LICENSE
└── README.md

## ⚙️ Backend Setup (FastAPI)

### 📦 Installation

```bash
cd backend
pip install -r requirements.txt
▶️ Run the Server
bash
Copy code
uvicorn app.main:app --reload
Backend will start at:
👉 http://127.0.0.1:8000

💻 Frontend Setup (React + Vite)
📦 Installation
bash
Copy code
cd frontend
npm install
▶️ Run the App
bash
Copy code
npm run dev
Frontend will start at:
👉 http://localhost:3000

🔗 API Overview
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login user and get JWT token
GET	/accounts	Fetch all user accounts
POST	/accounts	Create new account
GET	/transactions	Fetch all transactions
POST	/transactions	Create a transaction
GET	/categories	List user categories
POST	/budgets	Add budget by category

## 🗄️ Database
By default, the backend uses SQLite (finance_tracker.db).
To use MySQL, update the .env:

env
Copy code
DATABASE_URL=postgresql://user:password@localhost/finance_tracker
SECRET_KEY=your-secret-key
🧠 Tech Stack
Frontend:

React + TypeScript + Vite

Styled Components

React Router

Recharts

Backend:

FastAPI

SQLAlchemy + SQLite

Pydantic

JWT (python-jose)

Uvicorn

🧩 Future Enhancements
Multi-currency support

Export reports (PDF/CSV)

AI-based expense categorization

Cloud deployment (Render / Railway / Vercel)

📄 License
This project is licensed under the MIT License.
© 2025 Danish Naseer

💬 Author
Danish Naseer
📧 danishnaseer00@gmail.com
🌐 GitHub

