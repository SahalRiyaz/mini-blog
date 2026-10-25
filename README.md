# Mini Blog — Full-Stack Application

A modern, responsive full-stack blog built with **React**, **Node.js**, **Express**, **JWT Authentication**, and **MongoDB**. Designed as a clean production-ready application featuring role-based access control (RBAC), Markdown formatting, tags, search, and real-time reader discussions.

---

## ✨ Features

- **Public**:
  - List of blog posts with author info, published date, tags, and comment counters.
  - Single post page with clean **Markdown rendering** (headings, bold/italics, quotes, code blocks, lists).
  - Public discussion comments for every post.
  - Search articles by keywords in title or content.
  - Filter articles instantly by clicking on tag pills.
- **Authentication & Roles**:
  - Secure **JWT (JSON Web Token)** authentication stored in `localStorage` and sent via `Authorization: Bearer <token>`.
  - Password hashing with **bcrypt**.
  - **Two Distinct Roles**:
    - `reader`: Read articles and submit comments when logged in.
    - `admin`: Full access to create, edit, and delete articles, plus comment moderation.
- **Admin Management**:
  - Admin Dashboard with metrics (total articles, unique tags, user privilege status).
  - Rich Markdown post editor with live split-screen preview and quick formatting buttons.
  - Edit existing posts and delete posts with cascading comment cleanup.
- **One-Click Demo Credentials**:
  - Pre-seeded accounts ready on the login page for instant testing:
    - **Admin**: `admin@miniblog.com` / `admin123`
    - **Reader**: `reader@miniblog.com` / `reader123`

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Tailwind CSS, Lucide Icons, Axios, React-Markdown, Vite |
| **Backend** | Node.js, Express, CORS, Morgan, dotenv |
| **Authentication**| JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Database** | MongoDB (Mongoose) with automatic zero-config fallback |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 📂 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login, Me handlers
│   │   │   ├── postController.js   # CRUD & search for posts
│   │   │   └── commentController.js# Comments per post
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # requireAuth & requireAdmin guards
│   │   │   └── errorHandler.js     # Centralized error handling
│   │   ├── models/
│   │   │   ├── User.js             # Mongoose User schema
│   │   │   ├── Post.js             # Mongoose Post schema
│   │   │   └── Comment.js          # Mongoose Comment schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /auth endpoints
│   │   │   └── postRoutes.js       # /posts and /posts/:id/comments endpoints
│   │   ├── services/
│   │   │   └── dbStore.js          # Dual DB layer (MongoDB + Memory fallback)
│   │   ├── seed/
│   │   │   └── seed.js             # Seeding utility
│   │   └── server.js               # Express application entrypoint
│   ├── .env.example
│   ├── package.json
│   └── test-api.js                 # Automated API test suite
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js           # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with role badges & links
│   │   │   ├── Footer.jsx          # App footer
│   │   │   ├── PostCard.jsx        # Article preview card
│   │   │   ├── CommentSection.jsx  # Discussion thread & comment form
│   │   │   ├── TagBadge.jsx        # Clickable tag pill
│   │   │   └── ProtectedRoute.jsx  # Route guard for readers & admins
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Articles list, search & tag filter
│   │   │   ├── PostDetailPage.jsx  # Markdown reader & comment section
│   │   │   ├── LoginPage.jsx       # Login with 1-click demo buttons
│   │   │   ├── RegisterPage.jsx    # Registration with role selection
│   │   │   ├── AdminDashboardPage.jsx# Admin article table & metrics
│   │   │   └── PostEditorPage.jsx  # Create/Edit post with live preview
│   │   ├── App.jsx                 # Router config
│   │   ├── index.css               # Tailwind & Markdown styles
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json                 # Vercel SPA rewrites
│
├── postman_collection.json         # Ready-to-import Postman collection
├── render.yaml                     # Render blueprint configuration
└── README.md
```

---

## 🗄️ Data Model

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'reader';
  createdAt: Date;
  updatedAt: Date;
}
```

### Post
```typescript
{
  id: string;
  title: string;
  content: string; // Markdown text
  tags: string[];
  authorId: string; // References User
  createdAt: Date;
  updatedAt: Date;
}
```

### Comment
```typescript
{
  id: string;
  postId: string; // References Post
  userId: string; // References User
  text: string;
  createdAt: Date;
}
```

---

## 📡 REST API Reference

| Method | Endpoint | Purpose | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new account (name, email, password, role) | **Public** |
| `POST` | `/auth/login` | Login with email and password, receives JWT | **Public** |
| `GET` | `/auth/me` | Fetch currently authenticated user profile | **Logged in** |
| `GET` | `/posts` | List posts (Supports `?search=keyword` & `?tag=tagName`) | **Public** |
| `GET` | `/posts/:id` | Read a single post with author populated | **Public** |
| `POST` | `/posts` | Create new post (`title`, `content`, `tags`) | **Admin only** |
| `PUT` | `/posts/:id` | Update post (`title`, `content`, `tags`) | **Admin only** |
| `DELETE` | `/posts/:id` | Delete post & associated comments | **Admin only** |
| `GET` | `/posts/:id/comments` | List comments for a post | **Public** |
| `POST` | `/posts/:id/comments`| Add comment to a post | **Logged in** (Reader or Admin) |
| `GET` | `/api/health` | Service uptime and status check | **Public** |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (Tested on Node.js v22)
- npm 9+

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The server will start at `http://localhost:5000`.

> **Note on Database**: If you provide a `MONGODB_URI` in `backend/.env`, the server connects to MongoDB. If not specified or if offline, the backend seamlessly activates its built-in in-memory store pre-seeded with articles and demo users so you can test immediately without any database setup!

### 2. Start the Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🧪 Testing

### 1. Automated API Verification Suite
Run the built-in end-to-end API test suite:
```bash
node backend/test-api.js
```
This tests:
1. Health check endpoint
2. Post retrieval
3. Admin authentication & JWT issuance
4. Admin post creation
5. Reader registration
6. Reader permission verification (403 Forbidden check when creating posts)
7. Reader comment submission
8. Public comment reading
9. Admin post update
10. Admin post deletion

### 2. Postman Collection
Import `postman_collection.json` into Postman.
- Preconfigured requests for Auth, Posts, Comments, and Roles.
- Includes environment variables `baseUrl`, `adminToken`, and `jwtToken`.

---

## ☁️ Deployment Guide

### 1. Database: MongoDB Atlas
1. Sign up for free at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user and note the password.
4. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** > **Drivers** > copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/miniblog?retryWrites=true&w=majority
   ```

### 2. Backend: Render
1. Push your repository to GitHub.
2. Go to [Render.com](https://render.com) and click **New Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: `<generate-a-random-32-char-string>`
   - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
6. Deploy the web service and copy the live URL (e.g., `https://mini-blog-api.onrender.com`).

### 3. Frontend: Vercel
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New Project** and import your repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `<your-deployed-render-url-without-trailing-slash>`
5. Click **Deploy**. Vercel will build and serve your SPA. The included `vercel.json` ensures all client-side React routes (`/posts/:id`, `/admin`, etc.) resolve properly without 404s.

---

## 🔒 Security Best Practices Implemented
- Passwords hashed with salt factor 10 using `bcryptjs`.
- JWT tokens signed with secret and expiration.
- Strict Role-Based Middleware preventing unauthorized access to post management.
- Sanitized user payloads (password hashes stripped from responses).
- Request body validation and trim sanitization.
