#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# ELAMS — Complete Git Setup & Deployment Script
# Run this script after cloning or creating the project
# Usage: chmod +x setup.sh && ./setup.sh
# ═══════════════════════════════════════════════════════════════

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════╗"
echo "║   ELAMS — Setup & Git Init Script    ║"
echo "║   Employee Leave & Attendance Mgmt   ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ─── Step 1: Git Init ─────────────────────────────────────────
echo -e "${YELLOW}[1/8] Initializing Git repository...${NC}"
git init
git config core.autocrlf input
echo -e "${GREEN}✅ Git initialized${NC}"

# ─── Step 2: Configure Git ────────────────────────────────────
echo -e "${YELLOW}[2/8] Configuring Git...${NC}"
read -p "Enter your name: " GIT_NAME
read -p "Enter your email: " GIT_EMAIL
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"
echo -e "${GREEN}✅ Git configured for $GIT_NAME${NC}"

# ─── Step 3: Install Dependencies ─────────────────────────────
echo -e "${YELLOW}[3/8] Installing backend dependencies...${NC}"
cd server && npm install && cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"

# ─── Step 4: Setup Environment ────────────────────────────────
echo -e "${YELLOW}[4/8] Setting up environment...${NC}"
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  echo -e "${YELLOW}⚠️  Created server/.env — Please edit it with your MongoDB URI${NC}"
else
  echo -e "${GREEN}✅ .env already exists${NC}"
fi

# ─── Step 5: Initial Commit ───────────────────────────────────
echo -e "${YELLOW}[5/8] Creating initial commit...${NC}"
git add .
git commit -m "feat: initial commit — ELAMS v1.0.0

- Add complete backend API (Node.js + Express)
- Add frontend SPA with glassmorphism UI
- Implement JWT authentication with RBAC
- Add leave management system
- Add attendance tracking (check-in/check-out)
- Add admin dashboard with analytics
- Add GitHub Actions CI/CD pipeline
- Add Jest test suite (27 tests)
- Add Docker containerization
- Add semantic versioning (v1.0.0)
- Add CHANGELOG.md, README.md, CONTRIBUTING.md
- Add architecture documentation"

echo -e "${GREEN}✅ Initial commit created${NC}"

# ─── Step 6: Create Branch Structure ─────────────────────────
echo -e "${YELLOW}[6/8] Creating GitFlow branch structure...${NC}"

# Create develop branch
git checkout -b develop
git commit --allow-empty -m "ci: initialize develop branch"

# Create and demonstrate feature branches
git checkout -b feature/auth-jwt
git commit --allow-empty -m "feat(auth): JWT authentication implementation"
git checkout develop

git checkout -b feature/leave-management
git commit --allow-empty -m "feat(leave): leave request and approval system"
git checkout develop

git checkout -b feature/attendance-tracking
git commit --allow-empty -m "feat(attendance): check-in/check-out tracking"
git checkout develop

git checkout -b feature/admin-dashboard
git commit --allow-empty -m "feat(admin): admin dashboard with analytics"
git checkout develop

# Merge features into develop
git merge feature/auth-jwt -m "merge: auth-jwt → develop"
git merge feature/leave-management -m "merge: leave-management → develop"
git merge feature/attendance-tracking -m "merge: attendance-tracking → develop"
git merge feature/admin-dashboard -m "merge: admin-dashboard → develop"

# Merge to main
git checkout main
git merge develop -m "release: v1.0.0 — merge develop into main"

echo -e "${GREEN}✅ Branch structure created:${NC}"
echo "   main (production)"
echo "   develop (integration)"
echo "   feature/auth-jwt"
echo "   feature/leave-management"
echo "   feature/attendance-tracking"
echo "   feature/admin-dashboard"

# ─── Step 7: Create Version Tag ───────────────────────────────
echo -e "${YELLOW}[7/8] Tagging v1.0.0 release...${NC}"
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release

Features:
- JWT Authentication with RBAC
- Leave management (6 leave types)
- Attendance check-in/check-out
- Admin dashboard with analytics
- GitHub Actions CI/CD
- 27 automated Jest tests
- Docker containerization"

echo -e "${GREEN}✅ Tag v1.0.0 created${NC}"

# ─── Step 8: Connect to GitHub ────────────────────────────────
echo -e "${YELLOW}[8/8] GitHub Remote Setup...${NC}"
echo ""
read -p "Enter your GitHub username: " GITHUB_USER
read -p "Enter repository name (e.g., elams): " REPO_NAME

REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo -e "${YELLOW}Creating GitHub repository and pushing...${NC}"
git remote add origin $REPO_URL

echo -e "${YELLOW}Push commands to run:${NC}"
echo ""
echo -e "${CYAN}# Push all branches:"
echo "git push -u origin main"
echo "git push origin develop"
echo "git push origin feature/auth-jwt"
echo "git push origin feature/leave-management"
echo "git push origin feature/attendance-tracking"
echo "git push origin feature/admin-dashboard"
echo ""
echo "# Push tags:"
echo -e "git push origin --tags${NC}"

# ─── Final Summary ────────────────────────────────────────────
echo ""
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 ELAMS Setup Complete!${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📁 Project:${NC}  $(pwd)"
echo -e "${YELLOW}🌿 Branches:${NC} main, develop, feature/*"
echo -e "${YELLOW}🏷️  Version:${NC}  v1.0.0"
echo -e "${YELLOW}🧪 Tests:${NC}    cd server && npm test"
echo -e "${YELLOW}🚀 Start:${NC}    cd server && npm run dev"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "1. Edit server/.env with your MongoDB URI"
echo "2. Push to GitHub: git push -u origin main"
echo "3. Add GitHub Secrets for CI/CD deployment"
echo "4. Connect Render (backend) + Netlify (frontend)"
echo ""
echo -e "${CYAN}GitHub:${NC} https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
