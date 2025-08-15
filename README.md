<div align="center"> <img src="https://img.shields.io/badge/Campus%20Bazaar-Notes%20Marketplace-blueviolet?style=for-the-badge&logo=react" alt="Campus Bazaar" /> <h1>📚 Campus Bazaar</h1> <p>A modern full-stack campus marketplace for university students to <b>buy, sell, and share academic notes</b>.</p> <p> <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&style=flat-square" /> <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&style=flat-square" /> <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white&style=flat-square" /> <img src="https://img.shields.io/badge/Socket.IO-Real%20Time-black?logo=socket.io&style=flat-square" /> <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square" /> </p> </div>
🚀 Features
🔒 JWT Authentication & Protected Routes
📤 File Uploads (PDF/DOC/PPT)
💬 Real-time Community Chat (Socket.IO)
🔎 Debounced Search & Filtering
🛒 Purchase Tracking & History
🌗 Dark/Light Mode Toggle
🛠️ Reusable, Modern UI Components
📦 Production-ready build & deployment
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
JWT Auth
Multer (file uploads)
Socket.IO
bcrypt.js
⚙️ Installation
# Clone the Repository
git clone https://github.com/yourusername/campus-bazaar.git
cd campus-bazaar

# Install Dependencies
# Frontend
cd frontend
npm install

# Backend
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
# Run Backend
cd backend
npm run dev

# Run Frontend
cd frontend
npm start

Frontend: http://localhost:3000
Backend: http://localhost:5000

📦 Build Frontend for Production
cd frontend
npm run build

✅ Frontend Scripts
npm start — Start dev server
npm run build — Build production bundle
npm test — Run frontend tests
npm run eject — Eject CRA config


🤝 Contributing
Fork the repo
Create a feature branch: git checkout -b feat/amazing-feature
Commit changes: git commit -m "Added amazing feature"
Push to branch & open a Pull Request
📜 License
MIT License © 2025 [RONIT]

