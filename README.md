# AI Error Assistant 🚀

AI Error Assistant is a premium full-stack application designed to help developers debug their code instantly. By pasting an error traceback, users receive a deep AI-powered diagnosis and resolution steps, stored in a sleek, Netflix-inspired dashboard.

## ✨ Features

- **Instant AI Diagnosis**: Powered by Groq AI for lightning-fast error analysis.
- **Diagnostics History**: Keep track of all your previous debug sessions in a persistent sidebar.
- **Premium UI/UX**: Dark-themed, high-density interface with smooth animations and polished components.
- **Secure Authentication**: Robust login and registration system.
- **Copiable Solutions**: One-click copy for AI-generated resolutions.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 19** (Vite)
- **TypeScript**
- **Tailwind CSS v4** (Modern logic & aesthetics)
- **Lucide React** (Icons)
- **Radix UI** (Accessible components)

**Backend:**
- **Node.js & Express**
- **TypeScript**
- **PostgreSQL** (Relational data)
- **Redis** (Caching & performance)
- **Groq SDK** (AI processing)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL**
- **Redis**
- **Groq API Key** (from [Groq Console](https://console.groq.com/))

### 2. Setup Database
Create a PostgreSQL database and ensure you have the connection details.

### 3. Backend Configuration
Navigate to the `backend` directory:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
DB_USER=your_user
DB_HOST=localhost
DB_NAME=ai_error_assistant
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 4. Frontend Configuration
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```
The frontend communicates with the backend via `axios` (default port `5000`).

---

## 🏃 Running Locally

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` to view the app!

---

## 📄 License
This project is licensed under the ISC License.
