# 🧠 How This Portfolio Works — A Complete Explanation

*Written so you can understand every part of the code, even if you're new to full-stack development.*

---

## 🗺️ The Big Picture

Think of this portfolio like a restaurant:
- **The kitchen (backend)** stores all the data and handles requests
- **The dining room (frontend)** is what visitors see and interact with
- **The waiter (API)** carries messages between kitchen and dining room
- **The manager's key (JWT token)** is how only you get to change the menu

```
Browser (You/Visitor)
        ↕
  React Frontend  ←→  Express Backend  ←→  portfolio.json
  (localhost:5173)     (localhost:5000)     (your data)
```

---

## 📂 Backend Explained (`/backend`)

### `server.js` — The Entry Point
This is the first file that runs when you start the backend. It:
1. Loads environment variables from your `.env` file
2. Creates an Express app (a web server)
3. Sets up CORS (allows the frontend to talk to the backend)
4. Registers the routes (URL patterns it listens to)
5. Starts listening on port 5000

### `data/portfolio.json` — Your Database
All your content lives here as a JSON file. No fancy database needed!
- When you edit via the admin panel, this file gets updated
- When visitors load your site, they read from this file
- **To manually edit**: just open this file and change the text

### `routes/auth.js` — Login System
Two endpoints:
- `POST /api/auth/login` — takes your password, checks it against the stored hash, returns a JWT token if correct
- `POST /api/auth/verify` — checks if a token is still valid

### `routes/portfolio.js` — Content API
- `GET /api/portfolio` — anyone can read your portfolio data (public)
- `PUT /api/portfolio/hero` — only you (with token) can update the hero section
- `POST /api/portfolio/projects` — only you can add a project
- `DELETE /api/portfolio/projects/:id` — only you can delete a project
- (and so on for all sections)

### `middleware/authMiddleware.js` — The Bouncer
This code runs before any protected route. It:
1. Looks for the token in the request header
2. Verifies the token is valid and wasn't tampered with
3. If valid → lets the request through
4. If invalid → sends back "Access denied"

---

## ⚛️ Frontend Explained (`/frontend/src`)

### `main.jsx` — The App Starter
Tells React to render the `App` component inside the `<div id="root">` in `index.html`.

### `App.jsx` — The Orchestrator
- Fetches all portfolio data from the backend when the page loads
- Passes the data down to each section component
- Wraps everything in `AuthProvider` (so all components can check if you're admin)

### `context/AuthContext.jsx` — Global Login State
This uses React Context, which is like a global variable that any component can read.
- When you log in, it stores the JWT token in `localStorage` (browser memory)
- Any component can call `useAuth()` to know if you're admin
- If you're admin, edit buttons appear on every section

### Components — Each Section of the Page

| File | What it renders |
|------|----------------|
| `Navbar.jsx` | Fixed top navigation bar |
| `Hero.jsx` | Full-screen intro with particle animation |
| `About.jsx` | Summary + education timeline |
| `Skills.jsx` | 3D tech stack icons |
| `Projects.jsx` | Project cards with GitHub links |
| `Activities.jsx` | Co-curricular activity cards |
| `Contact.jsx` | Links to email, LinkedIn, GitHub |
| `AdminLogin.jsx` | Password login at the bottom |

### `ParticleBackground.jsx` — The 3D Animation
Uses Three.js (a 3D library) to:
1. Create 120 floating dots (particles) in 3D space
2. Connect nearby particles with faint lines (neural network look)
3. Slowly rotate the whole network
4. Move slightly with your mouse (parallax effect)

### `index.css` — The Design System
All visual styles are defined here using CSS variables (like constants):
- `--teal` (#00d4aa) — the main green-teal accent color
- `--violet` (#a855f7) — the purple accent for admin elements
- `--bg-deep` (#05050f) — the near-black background
- `--font-display` (Syne) — used for headings
- `--font-body` (DM Sans) — used for paragraph text

---

## 🔐 How Authentication Works Step by Step

```
1. You type your password → click "Login as Admin"
2. Frontend sends: POST /api/auth/login  {password: "yourpassword"}
3. Backend compares with bcrypt hash stored in .env
4. If match → backend creates a JWT token (a signed string)
5. Frontend saves this token in localStorage
6. Now every edit request includes: Authorization: Bearer <token>
7. authMiddleware verifies the token on each protected route
8. Edit buttons appear throughout the site for you only
```

### What is bcrypt?
Your password is never stored directly. Instead it's "hashed" — scrambled in a one-way way.
- `password123` → `$2a$10$hEiwq...` (the hash)
- The hash can never be reversed to get the original password
- `bcrypt.compare()` re-scrambles what you type and checks if it matches

### What is a JWT token?
A JSON Web Token is a string that says "this person is an admin" — signed by your `JWT_SECRET` so nobody can fake one.
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.abc123...
```
It expires in 24 hours, after which you need to log in again.

---

## ✏️ How Editing Works

When you click "Save" on any section:
```
1. Frontend sends: PUT /api/portfolio/hero  {name: "...", tagline: "..."}
   with token in the Authorization header
2. authMiddleware checks the token
3. Route handler reads portfolio.json
4. Merges your changes in
5. Writes the updated JSON back to disk
6. Returns the new data to the frontend
7. React updates the UI immediately
```

---

## 🎨 Changing the Design (Quick Guide)

**Change colors** → `frontend/src/index.css`, edit the `:root` variables at the top

**Change fonts** → 
1. Pick fonts from [fonts.google.com](https://fonts.google.com)
2. Update the `<link>` in `frontend/index.html`
3. Update `--font-display` and `--font-body` in `index.css`

**Change the particle color** → `frontend/src/components/ParticleBackground.jsx`
- Find `color: 0x00d4aa` and change the hex (remove the `#`)

**Add a new section** →
1. Create `frontend/src/components/NewSection.jsx`
2. Add a route in `backend/routes/portfolio.js`
3. Add the data to `backend/data/portfolio.json`
4. Import and add `<NewSection />` in `App.jsx`

---

## 🐛 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| "Could not load portfolio data" | Make sure backend is running (`npm run dev` in /backend) |
| Login says "Incorrect password" | Re-run `node generate-password.js` and update `.env` |
| Changes not saving | Check browser console for errors; check backend terminal |
| Port already in use | Change `PORT=5001` in `.env` and `proxy` in `vite.config.js` |

---

*You built this! Now go make it yours. 🚀*
