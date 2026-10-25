# Canvas & Prose — An Art & Literary Journal

A digital publication dedicated to the exploration of fine arts, art history, classical and modern aesthetics, and cultural criticism. Features curated essays, reader dialogue, thematic filtering, and a dedicated curatorial studio with live Markdown composition and light/dark reading modes.

---

## ✨ Features

- **Public Journal**:
  - Curated catalogue of essays on painting, sculpture, artistic movements, and aesthetic philosophy.
  - Elegant reading experience with **Markdown rendering** (drop quotes, structured headings, artist citations, catalog lists).
  - Public reader discussions and reflections on every essay.
  - Search essays by artist, artistic movement, or historical period.
  - Thematic tag filtering (e.g. `#vermeer`, `#impressionism`, `#sculpture`, `#baroque`).
- **Reading Modes**:
  - Warm Paper mode (Light) and Gallery Night mode (Dark) with persistent preference storage and seamless transitions.
- **Membership & Editorial Roles**:
  - **Readers & Patrons**: Read essays and contribute reflections to community discussions.
  - **Curators**: Access the Curatorial Studio to compose, edit, publish, and curate essays.
- **Curatorial Studio**:
  - Editorial dashboard tracking published articles and unique themes.
  - Full-featured writing desk with live split-screen preview and instant Markdown formatting tools.
  - Ability to update manuscripts and retract published essays.
- **Guest Access**:
  - Pre-seeded profiles available on the sign-in page for instant exploration:
    - **Curator**: `admin@miniblog.com` / `admin123`
    - **Reader**: `reader@miniblog.com` / `reader123`

---

## 🗄️ Journal Data Architecture

### User / Member
- `id`: Unique identifier
- `name`: Full name
- `email`: Account email
- `passwordHash`: Securely hashed password
- `role`: `'admin'` (Curator) or `'reader'` (Reader / Patron)

### Essay / Article
- `id`: Unique identifier
- `title`: Essay title
- `content`: Article manuscript in Markdown
- `tags`: Curated movements and themes (e.g. `['painting', 'baroque', 'vermeer']`)
- `authorId`: Curatorial contributor reference
- `createdAt` / `updatedAt`: Publication timestamps

### Reflection / Comment
- `id`: Unique identifier
- `postId`: Associated essay reference
- `userId`: Author reference
- `text`: Reflection body
- `createdAt`: Timestamp

---

## 📡 API Reference

| Method | Endpoint | Purpose | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Join as a reader or curator | **Public** |
| `POST` | `/auth/login` | Sign in with email & password | **Public** |
| `GET` | `/auth/me` | Fetch active member profile | **Members** |
| `GET` | `/posts` | List essays (Supports `?search=term` & `?tag=theme`) | **Public** |
| `GET` | `/posts/:id` | Read a single essay with author details | **Public** |
| `POST` | `/posts` | Publish a new essay | **Curators only** |
| `PUT` | `/posts/:id` | Update an existing essay | **Curators only** |
| `DELETE` | `/posts/:id` | Retract an essay and its reflections | **Curators only** |
| `GET` | `/posts/:id/comments` | List reader reflections for an essay | **Public** |
| `POST` | `/posts/:id/comments`| Submit a reader reflection | **Members** (Readers & Curators) |
| `GET` | `/api/health` | Journal service status check | **Public** |

---

## 🚀 Local Setup

### 1. Start the Journal Service
```bash
cd backend
npm install
npm run dev
```
The server will start at `http://localhost:5000`.

### 2. Start the Reading Interface
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🧪 Verification

Run the verification test suite:
```bash
node backend/test-api.js
```
The suite verifies all journal workflows: public essay reading, search, curator authentication, essay publication, role protection (blocking non-curators from publishing), reader reflections, updates, and retraction.

---

## ☁️ Deployment

- **Database**: Connect MongoDB Atlas via `MONGODB_URI` in `backend/.env`.
- **Backend Service**: Deploy the `backend` directory to Render using `npm start`.
- **Frontend Interface**: Deploy the `frontend` directory to Vercel with build command `npm run build` and output directory `dist`.
