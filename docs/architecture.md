# ELAMS — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Single Page Application (HTML/CSS/JS)        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │   │
│  │  │Auth Page │ │Employee  │ │  Admin Dashboard      │ │   │
│  │  │Login/Reg │ │Dashboard │ │  Leave Mgmt / Stats   │ │   │
│  │  └──────────┘ └──────────┘ └──────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                    HTTP/HTTPS (REST API)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │  JWT Bearer Token
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                 │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Middleware Layer                    │  │
│  │  Morgan (logging) │ CORS │ express-validator │ JWT    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐ │
│  │/api/auth │ │/api/leave│ │/api/attend│ │/api/employees│ │
│  │register  │ │apply     │ │checkin    │ │list          │ │
│  │login     │ │approve   │ │checkout   │ │stats         │ │
│  │me        │ │reject    │ │history    │ │profile       │ │
│  └──────────┘ └──────────┘ └───────────┘ └──────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Mongoose ODM Models                      │  │
│  │   User Model │ Leave Model │ Attendance Model         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │  Mongoose / MongoDB Wire Protocol
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB Atlas)                    │
│                                                             │
│  ┌───────────┐  ┌───────────┐  ┌────────────────────────┐  │
│  │  users    │  │  leaves   │  │      attendance        │  │
│  │ _id       │  │ _id       │  │  _id                   │  │
│  │ name      │  │ employee  │◄─│  employee (ref)        │  │
│  │ email     │◄─│ (ref)     │  │  date (YYYY-MM-DD)     │  │
│  │ password  │  │ leaveType │  │  checkIn               │  │
│  │ role      │  │ startDate │  │  checkOut              │  │
│  │ department│  │ endDate   │  │  totalHours            │  │
│  │ totalLeave│  │ totalDays │  │  status                │  │
│  │ usedLeave │  │ reason    │  └────────────────────────┘  │
│  └───────────┘  │ status    │                              │
│                 │ adminNote │                              │
│                 └───────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

---

## SCM / GitOps Architecture

```
Developer Workstation
        │
        │ git push origin feature/branch
        ▼
┌───────────────────────────────────────────────────────────┐
│              GitHub Repository                            │
│         (Single Source of Truth — GitOps)                 │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐  │
│  │  main    │  │ develop  │  │  feature/* hotfix/*    │  │
│  │(protected│  │(integrat.│  │  (dev branches)        │  │
│  │  branch) │  │ branch)  │  │                        │  │
│  └──────────┘  └──────────┘  └────────────────────────┘  │
│       ▲               ▲                │                  │
│       │ PR + Review   │ PR + Review    │                  │
│       └───────────────┴────────────────┘                  │
└───────────────────┬───────────────────────────────────────┘
                    │  Webhook trigger on push/PR
                    ▼
┌───────────────────────────────────────────────────────────┐
│              GitHub Actions (CI/CD)                       │
│                                                           │
│  ┌─────┐  ┌─────────┐  ┌──────────┐  ┌───────┐          │
│  │Lint │→ │  Test   │→ │ Security │→ │ Build │           │
│  │     │  │Node18/20│  │  Audit   │  │       │           │
│  └─────┘  └─────────┘  └──────────┘  └───┬───┘          │
│                                           │               │
│                              only on main branch          │
│                                           ▼               │
│                                    ┌──────────┐           │
│                                    │  Deploy  │           │
│                                    └──────────┘           │
└───────────────────────────────────────┬───────────────────┘
                                        │
                           ┌────────────┴────────────┐
                           ▼                         ▼
               ┌─────────────────┐       ┌─────────────────┐
               │   Render.com    │       │  Netlify.com    │
               │  (Backend API)  │       │  (Frontend SPA) │
               │  Node.js+Express│       │  Static HTML    │
               │  Port: 5000     │       │  HTTPS          │
               └─────────────────┘       └─────────────────┘
```

---

## Authentication Flow

```
Client                          Server                    MongoDB
  │                               │                          │
  │── POST /api/auth/login ───────►│                          │
  │   { email, password }         │                          │
  │                               │── findOne({ email }) ───►│
  │                               │◄── user document ────────│
  │                               │                          │
  │                               │── bcrypt.compare()        │
  │                               │   (password check)        │
  │                               │                          │
  │                               │── jwt.sign(payload)       │
  │                               │   7-day expiry           │
  │                               │                          │
  │◄── { token, user } ───────────│                          │
  │                               │                          │
  │                               │                          │
  │── GET /api/leaves ────────────►│                          │
  │   Authorization: Bearer <token>│                         │
  │                               │── jwt.verify(token)       │
  │                               │── attach req.user         │
  │                               │                          │
  │                               │── Leave.find({ emp_id })─►│
  │                               │◄── leaves array ──────────│
  │◄── { leaves: [...] } ─────────│                          │
```

---

## Data Models

### User Model
```
users collection
├── _id          ObjectId  (auto)
├── name         String    required, min 2
├── email        String    required, unique, indexed
├── password     String    hashed (bcrypt, 12 rounds)
├── role         Enum      ['employee', 'admin']
├── department   String    default 'General'
├── employeeId   String    auto EMP0001, EMP0002...
├── joinDate     Date      default now
├── totalLeaves  Number    default 20
├── usedLeaves   Number    default 0
├── isActive     Boolean   default true
├── createdAt    Date      (Mongoose timestamps)
└── updatedAt    Date      (Mongoose timestamps)
```

### Leave Model
```
leaves collection
├── _id          ObjectId  (auto)
├── employee     ObjectId  ref: User
├── leaveType    Enum      sick|casual|annual|maternity|paternity|emergency
├── startDate    Date      required
├── endDate      Date      required
├── totalDays    Number    auto-calculated
├── reason       String    required, min 10 chars
├── status       Enum      pending|approved|rejected  default pending
├── adminComment String    default ''
├── reviewedBy   ObjectId  ref: User (admin)
├── reviewedAt   Date
├── createdAt    Date
└── updatedAt    Date
```

### Attendance Model
```
attendance collection
├── _id          ObjectId  (auto)
├── employee     ObjectId  ref: User
├── date         String    YYYY-MM-DD (indexed)
├── checkIn      Date
├── checkOut     Date
├── totalHours   Number    auto-calculated
├── status       Enum      present|absent|half-day|on-leave
├── notes        String
├── createdAt    Date
└── updatedAt    Date
Unique index: { employee, date }
```

---

## API Response Format

All API responses follow this standard format:

```json
// Success
{
  "success": true,
  "message": "Operation description",
  "data": { ... } or [ ... ]
}

// Error
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // validation errors array
}
```

---

*Architecture diagram v1.0.0 — ELAMS Team*
