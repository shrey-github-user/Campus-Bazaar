Gotcha ✅ — here’s the README.md content as plain text only (no markdown formatting, no code fences), so you can just copy‑paste it into a .txt file if you like.

📚 Campus Bazaar

A full‑stack campus marketplace where university students can buy, sell, and share academic notes.
Includes authentication, file uploads, real‑time chat, searching & filtering, and purchase history.

🚀 Features

Frontend

React 18 + Tailwind CSS 3 with dark/light mode toggle

React Router v6 with protected & public routes

Axios instance for secure API calls (JWT auth)

Debounced Search to prevent unnecessary API hits

React Toastify with global toast wrappers for consistent notifications

Reusable Components (Loader, Modal, ErrorBoundary, etc.)

Backend

Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

Multer for file uploads (PDF/DOC/PPT)

Socket.IO for real‑time messaging

Search & filter endpoints for fast querying

Purchase tracking & history


🛠 Tech Stack

Frontend:

React 18

Tailwind CSS 3

React Router v6

Axios

React Toastify

Heroicons

Socket.IO Client

Backend:

Node.js + Express.js

MongoDB + Mongoose

JWT

Multer (file uploads)

Socket.IO

bcrypt.js

⚙️ Installation

Clone the Repository
git clone https://github.com/yourusername/campus-bazaar.git
cd campus-bazaar

Install Dependencies

Frontend
cd frontend
npm install

Backend
cd ../backend
npm install

📄 Environment Variables

Backend .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusbazaar
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

Frontend .env
REACT_APP_API_URL=http://localhost:5000

▶️ Running Locally

Run Backend
cd backend
npm run dev

Run Frontend
cd frontend
npm start

Frontend runs at http://localhost:3000
Backend runs at http://localhost:5000

📦 Build Frontend for Production
cd frontend
npm run build

✅ Frontend Scripts

npm start - Start dev server
npm run build - Build production bundle
npm test - Run frontend tests
npm run eject - Eject CRA config

🤝 Contributing

Fork the repo

Create a feature branch: git checkout -b feat/amazing-feature

Commit changes: git commit -m "Added amazing feature"

Push to branch & open a Pull Request

📜 License

MIT License © 2025 [RONIT]