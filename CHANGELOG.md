# Changelog

All notable changes to **ELAMS** are documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
and follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) convention.

---

## [Unreleased]
> Changes on `develop` branch awaiting next release

### Planned
- Email notifications for leave status changes
- Export attendance records to PDF/Excel
- Multi-language support (Tamil/Hindi/English)
- Mobile-first PWA (Progressive Web App) support

---

## [1.0.0] — 2025-01-01 🎉 Initial Production Release

### Added
- **Authentication System**
  - User registration with email + password
  - JWT-based login with 7-day token expiry
  - Role-based access control (Employee / Admin)
  - bcrypt password hashing (12 rounds)
  - Protected routes with middleware

- **Leave Management**
  - Apply for 6 leave types: Sick, Casual, Annual, Emergency, Maternity, Paternity
  - Admin approve/reject with comments
  - Employee cancel pending leaves
  - Automatic total days calculation
  - Leave balance tracking (20 days default)

- **Attendance Tracking**
  - Daily check-in / check-out
  - Total hours calculation
  - Half-day detection (< 4 hours)
  - 90-day attendance history
  - Today's status widget

- **Admin Dashboard**
  - All leave requests with filter (All/Pending/Approved)
  - Employee directory with leave balances
  - Attendance monitoring across all employees
  - Leave type distribution chart
  - Dashboard analytics widgets

- **Modern UI/UX**
  - Dark luxury theme with glassmorphism
  - Gradient backgrounds + neon accents
  - Responsive design (mobile + desktop)
  - Smooth animations and transitions
  - Live clock display
  - Toast notification system
  - Mock data for offline/demo usage

- **SCM & DevOps**
  - GitHub Actions CI/CD pipeline (6 stages)
  - Multi-Node.js version testing matrix (18, 20)
  - Jest test suite (27 test cases)
  - Test coverage reporting
  - Security audit with npm audit
  - Automated deploy to Render + Netlify
  - GitHub Release creation on version tags
  - Semantic versioning (SemVer)
  - Conventional commit messages
  - Dockerfile for containerization
  - `.env.example` for configuration documentation
  - `.gitignore` with proper exclusions

- **API**
  - `/api/health` — Health check endpoint
  - `/api/auth` — Registration, login, current user
  - `/api/leaves` — Full CRUD leave management
  - `/api/attendance` — Check-in/out + history
  - `/api/employees` — Admin employee management
  - Input validation with express-validator
  - Global error handler
  - CORS configuration
  - Request logging with Morgan

### Security
- JWT authentication on all protected routes
- Password never returned in API responses
- Role-based access control enforced server-side
- Input sanitization and validation
- Environment variables for sensitive configuration

---

## [0.2.0] — 2024-12-20 Beta Release

### Added
- Backend API structure (Express + MongoDB)
- Basic leave application flow
- Attendance check-in/check-out
- Admin review functionality
- Initial test cases

### Changed
- Refactored middleware to support multiple roles
- Improved error handling across all routes

### Fixed
- Duplicate attendance records on same day
- Leave total days calculation for single-day leaves

---

## [0.1.0] — 2024-12-10 Alpha Release

### Added
- Project scaffolding
- Basic Express server setup
- MongoDB connection with Mongoose
- User model with password hashing
- Basic JWT authentication
- Initial folder structure

---

## Versioning Guide

```
MAJOR.MINOR.PATCH

1.0.0 → Initial production release
1.0.1 → Bug fix (patch)
1.1.0 → New feature, backward compatible (minor)
2.0.0 → Breaking API changes (major)
```

### Types of Changes
- `Added` — New features
- `Changed` — Updates to existing functionality
- `Deprecated` — Soon-to-be removed features
- `Removed` — Features removed in this release
- `Fixed` — Bug fixes
- `Security` — Security vulnerability fixes

[Unreleased]: https://github.com/username/elams/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/username/elams/releases/tag/v1.0.0
[0.2.0]: https://github.com/username/elams/releases/tag/v0.2.0
[0.1.0]: https://github.com/username/elams/releases/tag/v0.1.0
