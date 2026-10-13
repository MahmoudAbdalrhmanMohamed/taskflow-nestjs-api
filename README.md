# TaskFlow – NestJS REST API

> Production-grade RESTful API backend for **TaskFlow – Smart Team & Project Management** built with NestJS, TypeScript, Prisma ORM, and PostgreSQL.

[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Key Highlights

- **JWT Authentication & Passport**: Stateless token-based security with bcrypt password hashing and token expiration.
- **Prisma ORM & PostgreSQL**: Type-safe relational modeling with foreign keys, cascaded deletions, indexes, and automated migrations.
- **Multi-Tenant Ownership Isolation**: Robust guards ensuring users can only read, mutate, or delete their own projects and tasks.
- **Swagger / OpenAPI 3.0**: Fully interactive documentation auto-generated at `/api/docs`.
- **Aggregated Analytics & Metrics**: Real-time project completion calculation, overdue detection, and team status breakdown.
- **DevOps Ready**: Multi-stage Dockerfile and Render Blueprint (`render.yaml`) for zero-downtime deployment.

---

## 🏗️ Architecture

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Bootstrap with global prefix, CORS, validation pipe, Swagger
├── common/
│   ├── decorators/            # @CurrentUser(), @Public()
│   ├── filters/               # Centralized HttpExceptionFilter
│   └── guards/                # JwtAuthGuard
├── prisma/
│   ├── prisma.module.ts       # Global Prisma database module
│   └── prisma.service.ts      # Lifecycle-managed Prisma client
└── modules/
    ├── auth/                  # Register, Login, Me endpoints & JWT Strategy
    ├── users/                 # Profile management
    ├── projects/              # Project CRUD & stats calculation
    ├── tasks/                 # Task CRUD, Kanban status update, filtering & sorting
    ├── dashboard/             # Aggregated analytics, upcoming deadlines, recent activities
    └── health/                # Deployment monitoring GET /health
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | ❌ No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | ❌ No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ Bearer JWT |

### Projects
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/projects` | List all projects with progress stats | ✅ Bearer JWT |
| `POST` | `/api/projects` | Create a new project | ✅ Bearer JWT |
| `GET` | `/api/projects/:id` | Get project details and tasks | ✅ Bearer JWT |
| `PATCH` | `/api/projects/:id` | Update project metadata or status | ✅ Bearer JWT |
| `DELETE` | `/api/projects/:id` | Delete project and cascade tasks | ✅ Bearer JWT |

### Tasks
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Filter & sort tasks (`projectId`, `status`, `priority`, `search`) | ✅ Bearer JWT |
| `POST` | `/api/tasks` | Create a new task within a project | ✅ Bearer JWT |
| `GET` | `/api/tasks/:id` | Get task by ID | ✅ Bearer JWT |
| `PATCH` | `/api/tasks/:id` | Update task details or move across Kanban columns | ✅ Bearer JWT |
| `DELETE` | `/api/tasks/:id` | Remove task | ✅ Bearer JWT |

### Dashboard & Health
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated metrics, overdue tasks, upcoming deadlines | ✅ Bearer JWT |
| `GET` | `/health` | Service uptime and health check | ❌ No |
| `GET` | `/api/docs` | Interactive Swagger API explorer | ❌ No |

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database (Local or Cloud URL from Neon/Supabase/Render)

### 2. Environment Setup
```bash
cp .env.example .env
```
Edit `.env` to configure your `DATABASE_URL` and `JWT_SECRET`.

### 3. Install & Generate Prisma Client
```bash
npm install
npx prisma generate
```

### 4. Run Migrations & Seed Demo Data
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
*Default demo account:*
- **Email:** `demo@taskflow.dev`
- **Password:** `DemoPassword123!`

### 5. Start Development Server
```bash
npm run start:dev
```
- API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/health`

---

## 🐳 Docker & Cloud Deployment

### Docker Build & Run
```bash
docker build -t taskflow-nestjs-api .
docker run -p 3000:3000 --env-file .env taskflow-nestjs-api
```

### Render Deployment
This repository includes a `render.yaml` blueprint. Simply link the repository on [Render](https://render.com) and deploy with one click.
