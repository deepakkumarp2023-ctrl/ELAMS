# Contributing to ELAMS

Thank you for your interest in contributing to the **Employee Leave & Attendance Management System**!

---

## 🌿 Branching Strategy

We use **GitFlow**:

```
main       ← Production only. Protected branch.
develop    ← Integration branch for features
feature/*  ← Individual feature branches
hotfix/*   ← Emergency production fixes
release/*  ← Release preparation branches
```

### Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

---

## ✍️ Commit Message Format

We follow **Conventional Commits**:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types
| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure |
| `test` | Adding or updating tests |
| `ci` | CI/CD pipeline changes |
| `chore` | Build tools, dependencies |

### Examples
```bash
git commit -m "feat(auth): add JWT refresh token endpoint"
git commit -m "fix(leave): prevent applying leave on past dates"
git commit -m "test(attendance): add checkout duplicate prevention test"
git commit -m "docs: add deployment guide to README"
git commit -m "ci: add Node 20 to test matrix"
```

---

## 🔄 Pull Request Process

1. Create your feature branch from `develop`
2. Write/update tests for your changes
3. Ensure all tests pass: `npm test`
4. Update `CHANGELOG.md` under `[Unreleased]`
5. Create a PR to `develop` with a clear description
6. Request review from at least one team member
7. PR is merged only after CI passes ✅

### PR Title Format
```
feat(scope): Brief description
fix(scope): Brief description
```

---

## 🧪 Testing Requirements

- All new features must include tests
- Run `npm test` before submitting PR
- Maintain test coverage above 70%
- Tests go in `server/tests/`

```bash
cd server
npm test           # Run tests
npm run test:ci    # CI mode with coverage report
```

---

## 📁 File Organization

```
server/
  routes/     → API route handlers
  models/     → Mongoose schemas
  middleware/ → Auth + validation
  tests/      → Jest test files
client/
  index.html  → Frontend SPA
```

---

## 🚫 Don't Commit

- `.env` files (use `.env.example`)
- `node_modules/`
- `coverage/` reports
- IDE configuration files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)

These are all listed in `.gitignore`.

---

## 🏷️ Release Process

Only maintainers create releases:

```bash
# 1. Merge develop → main via PR
git checkout main
git merge develop

# 2. Update CHANGELOG.md (move Unreleased → version)

# 3. Bump version in package.json

# 4. Tag the release
git tag -a v1.1.0 -m "Release v1.1.0: add notification feature"
git push origin main --tags

# 5. GitHub Actions automatically creates GitHub Release
```

---

## Code Style Guidelines

- Use `const`/`let` (never `var`)
- Arrow functions for callbacks
- Async/await over .then chains
- Meaningful variable names
- Add JSDoc comments for functions
- Handle all errors with try/catch

---

Thank you for contributing! 🎉
