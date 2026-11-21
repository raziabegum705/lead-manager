# LeadFlow – Lead Manager

A full-stack web app that lets a sales user capture, track and manage leads, with a live dashboard that shows where every lead stands in the pipeline.

Built for the **Meru Technosoft Full Stack Developer screening assignment**.

| | |
|---|---|
| **Live demo** | https://your-app.vercel.app |
| **API** | https://your-api.onrender.com/api/health |
| **Repository** | https://github.com/raziabegum705/lead-manager |

> The API runs on Render's free plan, which sleeps when idle. The first request after a quiet period can take up to a minute. Please wait for the first login or signup to finish.

## Screenshots

## Login  

<img width="1893" height="922" alt="image" src="https://github.com/user-attachments/assets/4b4fe3be-42e3-4f14-a3c9-e32b5d90e71b" />

## dashboard 
<img width="1902" height="912" alt="image" src="https://github.com/user-attachments/assets/87551899-e305-4223-ad5c-30dc0c6579d6" />

## Add lead 
<img width="1847" height="892" alt="image" src="https://github.com/user-attachments/assets/49de3861-63a9-4527-85eb-6c5962bd3d6b" />

<img width="1867" height="906" alt="image" src="https://github.com/user-attachments/assets/b7f3b666-e47c-4172-a460-3dd3752c9294" />


## Features

**Core**
- Add a lead: name, email, phone, company, source (dropdown) and status (New / Contacted / Qualified / Lost)
- Leads table with clear colour-coded status badges
- Edit a lead and update its status
- Delete a lead, with a confirmation dialog
- Search by name, email or company, and filter by status
- Validation on both the frontend and the backend (valid email, phone format, required fields)

**Bonus**
- Signup / login with JWT, so each user sees only their own leads
- Show / hide password toggle
- Pagination and column sorting (name, company, status, date added)
- Dashboard with a **donut chart** (share of leads per stage) and a **bar chart** (leads per status). Click a slice or bar to filter the table
- Automated API tests (Jest + Supertest)
- Deployed: Vercel (frontend), Render (API), MongoDB Atlas (database)

**UI**
- Clean SaaS-style design with a navy header and sand-coloured cards
- Charts are hand-built SVG, with no chart library
- Empty, loading and error states, keyboard-accessible controls, responsive down to mobile

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite, React Router, Axios, react-hot-toast | Matches the requested stack; fast dev loop |
| Backend | Node.js + Express | Simple, readable REST API |
| Database | MongoDB Atlas + Mongoose | Flexible schema; indexes defined in the model |
| Auth | JWT + bcryptjs | Stateless login, hashed passwords |
| Tests | Jest, Supertest, mongodb-memory-server | Tests run without a real database |
| Hosting | Vercel + Render | Free tiers, simple Git-based deploys |

## Folder structure

```
lead-manager/
├── screenshots/                 images used in this README
├── client/                      React app (Vite)
│   ├── vercel.json              makes page refreshes work on Vercel
│   └── src/
│       ├── api/                 axios instance (adds JWT, handles expired sessions)
│       ├── components/          Navbar, DashboardCharts, StatusBadge, LeadModal, ConfirmDialog, Icons
│       ├── config/              shared constants (statuses, sources)
│       ├── context/             AuthContext
│       ├── pages/               LoginPage, LeadsPage
│       ├── utils/               frontend validation, avatar colours
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── server/                      Express API
    ├── config/                  db connection, constants
    ├── controllers/             auth + lead logic
    ├── middleware/              JWT auth
    ├── models/                  User, Lead
    ├── routes/
    ├── tests/                   API tests
    ├── utils/                   validators, token helper
    ├── app.js                   Express app and error handler
    └── server.js                starts the server
```

## Run locally

**Prerequisites:** Node.js 18+ and MongoDB (a local install, or a free MongoDB Atlas cluster).

```bash
# 1. Clone
git clone https://github.com/raziabegum705/lead-manager.git
cd lead-manager

# 2. Backend
cd server
npm install
cp .env.example .env        # then fill in the values below
npm run dev                 # http://localhost:5000

# 3. Frontend (open a new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173, create an account and add your first lead.
In development Vite proxies `/api` to port 5000, so no CORS setup and no client `.env` are needed.

### Environment variables

**`server/.env`**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
```

**`client/.env`** (production only)
```
VITE_API_URL=https://your-api.onrender.com/api
```

Secrets are never committed. Only the `.env.example` files are in the repo.

### Run the tests

```bash
cd server
npm test
```

The tests use an in-memory MongoDB (downloaded automatically on the first run), so no database setup is needed.

## Deployment

Deploy in this order: database, API, frontend. Then link the frontend and API.

### 1. Database: MongoDB Atlas
1. Create a free cluster, then a database user (Database Access).
2. Under **Network Access**, allow `0.0.0.0/0`. Render's free plan has no fixed IP address.
3. Click **Connect → Drivers** and copy the connection string. Add the database name before the `?`:
   `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/lead-manager?retryWrites=true&w=majority`

### 2. API: Render
1. **New → Web Service**, then connect this GitHub repository.
2. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `CLIENT_URL` = your Vercel URL (add it after step 3; for now use a placeholder)
4. Deploy. Check `https://your-api.onrender.com/api/health`. It should return `{"status":"ok"}`.

### 3. Frontend: Vercel
1. **Add New → Project**, then import this repository.
2. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (build command `npm run build`, output `dist`)
3. Add the environment variable `VITE_API_URL` = `https://your-api.onrender.com/api` (include `/api`, no trailing slash).
4. Deploy and copy the Vercel URL.

### 4. Connect them
Go back to Render, set `CLIENT_URL` to the exact Vercel URL (for example `https://lead-manager.vercel.app`, with no trailing slash), and redeploy. Without this the browser blocks requests with a CORS error.

### Troubleshooting
| Problem | Fix |
|---|---|
| "Cannot reach the server" | The Render API is waking up (wait a minute and retry), or `VITE_API_URL` is wrong. Redeploy Vercel after changing it. |
| CORS error in the browser console | `CLIENT_URL` on Render doesn't match the Vercel URL exactly |
| 404 when refreshing a page on Vercel | `client/vercel.json` is missing |
| "Failed to start" in Render logs | Wrong `MONGODB_URI`, or Atlas Network Access doesn't allow `0.0.0.0/0` |

## API

All `/api/leads` routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/leads?search=&status=&sort=&order=&page=&limit=` | List, search, filter, sort, paginate |
| GET | `/api/leads/stats` | Lead count per status (feeds the charts) |
| POST | `/api/leads` | Add a lead |
| PUT | `/api/leads/:id` | Edit a lead / update its status |
| DELETE | `/api/leads/:id` | Delete a lead |

Errors return JSON like `{ "message": "...", "errors": { "email": "..." } }`, with status 400 (validation), 401 (not logged in), 404 (not found) or 409 (duplicate email).

## Design decisions and assumptions

- **Validation in both places.** The frontend gives instant feedback. The backend is the real gatekeeper and returns field-level errors that the form shows under each input.
- **Data isolation.** Every lead query includes `user: req.user._id`, so one user can never read, edit or delete another user's leads.
- **Database indexes.** A unique `{user, email}` index prevents duplicate leads for a user (returns 409). A `{user, status, createdAt}` index speeds up the status filter and the default newest-first order.
- **Safe search and sort.** Search input is regex-escaped and sort fields are whitelisted.
- **Error handling.** Async errors are caught centrally (`express-async-errors`), so a bad request can't crash the server. The UI shows a retry state when the API is down and clear messages for expired sessions.
- **Stale responses.** Search is debounced and each request has an ID, so a slow older response never overwrites newer results.
- **Assumptions:** a lead's email is unique per user; phone numbers are 7–16 digits with an optional `+`.

## With more time

- Rate limiting and refresh tokens
- Lead notes, activity history and CSV import/export
- Frontend component tests
- A paid or always-on host so the API never sleeps

## Note

Proudest of the dashboard: the donut and bar charts are hand-built SVG and double as status filters. Trickiest part was keeping the table correct while search, filter, sort and page change quickly, which I solved with a debounce and a request-ID guard.
