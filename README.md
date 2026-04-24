# 🌐 Simran Arya — Portfolio Website

A full-stack personal portfolio with a React frontend, Node.js backend, and a password-protected admin panel so only you can edit your content.

---

## 📁 Project Structure

```
portfolio/
├── frontend/          ← React app (Vite)
│   └── src/
│       ├── components/    ← All UI sections
│       ├── context/       ← Auth state
│       └── index.css      ← Global styles
│
├── backend/           ← Node.js + Express API
│   ├── data/
│   │   └── portfolio.json ← All your content lives here
│   ├── routes/        ← API endpoints
│   ├── middleware/    ← JWT auth guard
│   ├── server.js
│   └── generate-password.js  ← Run once to set your password
│
└── HOW_IT_WORKS.md    ← Detailed explanation for you
```

---

## 🚀 First Time Setup

### Step 1 — Install dependencies

Open two terminals.

**Terminal 1 (backend):**
```bash
cd backend
npm install
```

**Terminal 2 (frontend):**
```bash
cd frontend
npm install
```

---

### Step 2 — Set your admin password

In the **backend** folder:
```bash
node generate-password.js
```
Type the password you want, and copy the output hash.

---

### Step 3 — Create your .env file

In the **backend** folder, copy the example:
```bash
cp .env.example .env
```
Then open `.env` and fill in:
- `JWT_SECRET` — any long random string (e.g. `mySecretKey_abc123_xyz`)
- `ADMIN_PASSWORD_HASH` — the hash you just generated
- Leave the rest as-is for local development

---

### Step 4 — Run the project

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# Opens http://localhost:5173
```

Visit `http://localhost:5173` — your portfolio is live! 🎉

---

## ✏️ How to Edit Your Portfolio

1. Go to the bottom of the site — there's an **Admin** section
2. Log in with your password
3. **Edit buttons** (✎) appear on every section
4. Make changes → click **Save** → done!

You can update:
- Your name, tagline, status, coding profiles
- About text, areas of interest, coursework
- Skills (add/remove technologies)
- Projects (add, edit, delete)
- Activities (add, remove)
- Contact info

---

## 🌍 Deploying to Production

### Option A — Railway (recommended, free tier)

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables (same as your `.env`)
4. Set `NODE_ENV=production`
5. Your URL will be something like `yourapp.railway.app`

### Option B — Render

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Build command: `cd frontend && npm install && npm run build`
4. Start command: `cd backend && npm install && node server.js`
5. Add env vars

### Before deploying

In `backend/.env` change:
```
FRONTEND_URL=https://your-deployed-url.com
NODE_ENV=production
```

---

## 🔒 Security Notes

- Your `.env` file is in `.gitignore` — it will **never** be pushed to GitHub ✅
- Passwords are hashed with bcrypt — never stored in plain text ✅
- Only protected routes require authentication — public visitors can't edit anything ✅
- JWT tokens expire in 24 hours — you'll need to log in again after that ✅

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Three.js |
| Styling | Pure CSS with CSS variables |
| Backend | Node.js, Express |
| Auth | JWT + bcrypt |
| Data | JSON file (no database needed) |

---

*Built with ❤️ for Simran Arya*
