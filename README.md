# ⚡ ELAMS — Employee Leave & Attendance Management System

> **Version:** v1.0.0 | **Status:** Production Ready  
> A modern, full-stack web application demonstrating advanced **Software Configuration Management (SCM)** practices, GitOps, CI/CD, and DevOps workflows.

![ELAMS Banner](https://img.shields.io/badge/ELAMS-v1.0.0-63cab7?style=for-the-badge&logo=github)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [SCM Concepts Demonstrated](#-scm-concepts-demonstrated)
4. [GitOps Architecture](#-gitops-architecture)
5. [Project Structure](#-project-structure)
6. [Quick Start](#-quick-start)
7. [Environment Variables](#-environment-variables)
8. [Git Branching Strategy](#-git-branching-strategy)
9. [CI/CD Pipeline](#-cicd-pipeline)
10. [API Documentation](#-api-documentation)
11. [Deployment](#-deployment)
12. [Testing](#-testing)
13. [Semantic Versioning](#-semantic-versioning)
14. [Docker](#-docker)
15. [Contributing](#-contributing)

---

## 🎯 Project Overview

ELAMS is a production-ready **Employee Leave & Attendance Management System** that allows:

**Employees to:**
- 🔐 Register/Login with JWT authentication
- 📅 Apply for leave (sick, casual, annual, emergency, maternity, paternity)
- 👁 Track leave status (pending/approved/rejected)
- ⏱ Mark daily attendance (check-in/check-out)
- 📊 View attendance history

**Admins to:**
- ✅ Approve/Reject leave requests
- 👥 Monitor all employees
- 📈 View attendance analytics
- 📋 Manage the entire workforce

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (Glassmorphism UI), Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| CI/CD | GitHub Actions |
| Version Control | Git + GitHub |
| Deployment | Netlify (Frontend) + Render (Backend) |
| Testing | Jest + Supertest |
| SCM | Git, Semantic Versioning, CHANGELOG |

---

## 🔧 SCM Concepts Demonstrated

This project demonstrates **all major Software Configuration Management practices**:

### 1. 📦 Version Control (Git)
- Full Git repository with meaningful commit messages
- Conventional commits format: `feat:`, `fix:`, `docs:`, `test:`, `ci:`
- `.gitignore` for proper file exclusion
- Git tags for semantic version releases

### 2. 🌿 Branching Strategy (GitFlow)
```
main        ← Production releases only
  └── develop    ← Integration branch
        ├── feature/auth-jwt
        ├── feature/leave-management
        ├── feature/attendance-tracking
        └── feature/admin-dashboard
```

### 3. 🚀 CI/CD Pipeline (GitHub Actions)
- Triggered on every push and pull request
- Multi-stage pipeline: Lint → Test → Security → Build → Deploy
- Automated tests with Jest
- Automatic deployment on merge to main

### 4. 🏷️ Semantic Versioning (SemVer)
```
MAJOR.MINOR.PATCH
  1  .  0  .  0
```
- **MAJOR** — Breaking changes
- **MINOR** — New features (backward compatible)
- **PATCH** — Bug fixes

### 5. 📄 CHANGELOG Maintenance
- `CHANGELOG.md` tracking every version change
- Following "Keep a Changelog" convention
- Linked to Git tags and GitHub Releases

### 6. 🔐 Security Configuration Management
- Environment variables in `.env` (never committed)
- `.env.example` for documentation
- JWT token-based authentication
- RBAC (Role-Based Access Control)

### 7. 🐳 Docker Containerization
- `Dockerfile` for backend containerization
- Reproducible builds across environments
- Environment isolation

### 8. 📋 Documentation as Code
- README.md (this file)
- CHANGELOG.md
- CONTRIBUTING.md
- Inline code comments
- API documentation

---

## 🔄 GitOps Architecture

```
Developer pushes code
        │
        ▼
  GitHub Repository (Single Source of Truth)
        │
        ▼
  GitHub Actions Pipeline triggers
        │
   ┌────┴────┐
   │         │
   ▼         ▼
 Lint     Tests (Jest)
   │         │
   └────┬────┘
        │
        ▼
   Security Audit
        │
        ▼
   Build Validation
        │
        ├──── [develop branch] → No deploy
        │
        └──── [main branch] ──→ Auto Deploy
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                         Netlify      Render
                         (Frontend)   (Backend)
```

**GitOps Principle:** GitHub is the **single source of truth**. All changes go through Git. No manual deployments. The desired state in Git = actual state in production.

---

## 📁 Project Structure

```
elams/
├── 📁 .github/
│   └── 📁 workflows/
│       └── main.yml              # CI/CD pipeline definition
│
├── 📁 client/                    # Frontend
│   └── index.html                # Single-page application (SPA)
│
├── 📁 server/                    # Backend API
│   ├── index.js                  # Express app entry point
│   ├── package.json
│   ├── .env.example              # Environment template
│   │
│   ├── 📁 models/                # MongoDB Mongoose models
│   │   ├── User.js               # Employee/Admin model
│   │   ├── Leave.js              # Leave request model
│   │   └── Attendance.js         # Attendance record model
│   │
│   ├── 📁 routes/                # Express API routes
│   │   ├── auth.js               # Authentication (login/register)
│   │   ├── leave.js              # Leave management
│   │   ├── attendance.js         # Attendance tracking
│   │   └── employee.js           # Employee management (admin)
│   │
│   ├── 📁 middleware/
│   │   └── auth.js               # JWT + RBAC middleware
│   │
│   └── 📁 tests/                 # Jest test suites
│       ├── auth.test.js
│       ├── leave.test.js
│       └── attendance.test.js
│
├── 📁 docs/
│   └── architecture.md           # System architecture
│
├── Dockerfile                    # Docker containerization
├── .gitignore
├── README.md                     # This file
├── CHANGELOG.md                  # Version history
└── CONTRIBUTING.md               # Contribution guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/elams.git
cd elams
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Setup Frontend
```bash
# Open client/index.html in browser, OR serve with:
cd client
npx serve .
# Frontend runs at http://localhost:3000
```

### 4. Demo Login (No Backend Required)
The app includes mock data for demo purposes:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@elams.com | demo1234 |
| Employee | emp@elams.com | demo1234 |

---

## 🔑 Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/elams
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:3000
```

### GitHub Secrets (for CI/CD)
Add these in **GitHub → Settings → Secrets and variables → Actions**:
```
RENDER_DEPLOY_HOOK_URL   → Render deploy hook URL
NETLIFY_AUTH_TOKEN       → Netlify personal access token
NETLIFY_SITE_ID          → Your Netlify site ID
MONGODB_URI              → MongoDB connection string
JWT_SECRET               → JWT signing secret
```

---

## 🌿 Git Branching Strategy

```bash
# Initialize repository
git init
git remote add origin https://github.com/<username>/elams.git

# Create branch structure
git checkout -b develop
git push -u origin develop

# Feature branch workflow
git checkout -b feature/auth-jwt
git add .
git commit -m "feat: implement JWT authentication with bcrypt"
git push origin feature/auth-jwt
# → Create PR: feature/auth-jwt → develop

# Release workflow
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release"
git push origin main --tags
```

### Commit Message Convention
```
<type>(<scope>): <description>

Types:
  feat:     New feature
  fix:      Bug fix
  docs:     Documentation
  style:    Formatting
  refactor: Code restructure
  test:     Adding tests
  ci:       CI/CD changes
  chore:    Maintenance

Examples:
  feat(auth): add JWT refresh token support
  fix(leave): correct total days calculation
  test(api): add attendance checkout test
  ci: add security audit stage to pipeline
  docs: update API documentation
```

---

## ⚙️ CI/CD Pipeline

### Stages
```
Push / PR
    │
    ▼
[Stage 1] 🔍 Lint
    - Node.js syntax check
    - JSON validation
    │
    ▼
[Stage 2] 🧪 Test (matrix: Node 18, 20)
    - Jest unit tests
    - API integration tests
    - Coverage report
    │
    ▼
[Stage 3] 🔒 Security
    - npm audit (high severity)
    │
    ▼
[Stage 4] 🏗️ Build
    - Install production deps
    - Health check
    - Frontend validation
    │
    ▼
[Stage 5] 🌐 Deploy (main branch only)
    - Backend → Render
    - Frontend → Netlify
```

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Leaves
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/leaves` | Apply for leave | Employee |
| GET | `/api/leaves` | Get leaves | All |
| PUT | `/api/leaves/:id` | Approve/Reject | Admin |
| DELETE | `/api/leaves/:id` | Cancel leave | Employee |

### Attendance
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/attendance/checkin` | Check in | Employee |
| PUT | `/api/attendance/checkout` | Check out | Employee |
| GET | `/api/attendance` | Get records | All |
| GET | `/api/attendance/today` | Today's status | Employee |

### Employees (Admin)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/employees` | List all employees | Admin |
| GET | `/api/employees/:id` | Get employee | Admin |
| GET | `/api/employees/stats` | Dashboard stats | Admin |

---

## 🌐 Deployment

### Backend → Render
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repository
4. Settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables (MONGODB_URI, JWT_SECRET)
6. Copy Deploy Hook URL → Add to GitHub Secrets

### Frontend → Netlify
1. Go to [netlify.com](https://netlify.com) → Add new site
2. Connect GitHub repository
3. Settings:
   - Base directory: `client`
   - Publish directory: `client`
4. Add `API_URL` environment variable pointing to Render URL

---

## 🧪 Testing

```bash
cd server
npm test              # Run all tests
npm run test:ci       # CI mode with coverage
```

### Test Coverage
- `tests/auth.test.js` — 12 tests for authentication
- `tests/leave.test.js` — 9 tests for leave management
- `tests/attendance.test.js` — 6 tests for attendance

---

## 🏷️ Semantic Versioning

```bash
# Patch release (bug fixes)
git tag -a v1.0.1 -m "fix: attendance duplicate check-in bug"
git push origin v1.0.1

# Minor release (new features)
git tag -a v1.1.0 -m "feat: add leave balance notifications"
git push origin v1.1.0

# Major release (breaking changes)
git tag -a v2.0.0 -m "feat!: migrate to React frontend"
git push origin v2.0.0
```

---

## 🐳 Docker

```bash
# Build image
docker build -t elams-server ./server

# Run container
docker run -d \
  -p 5000:5000 \
  -e MONGODB_URI="your_mongo_uri" \
  -e JWT_SECRET="your_secret" \
  --name elams \
  elams-server

# Check logs
docker logs elams
```

---

## 👥 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © 2024 ELAMS Team

---

*Built with ❤️ for SCM & DevOps excellence*
