# GoalSphere — In-House Goal Setting & Tracking Portal

GoalSphere is a production-ready enterprise HR SaaS-style web application for goal creation, manager approval, quarterly check-ins, audit governance, dashboards, escalation tracking, and reporting exports.

## Tech Stack

- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- NextAuth/Auth.js credentials authentication
- Prisma ORM
- PostgreSQL
- React Hook Form + Zod
- Zustand
- Recharts
- ExcelJS / CSV export
- Docker + Docker Compose

## Implemented Modules

- Employee goal creation
- Max 8 goals validation
- Minimum 10% weightage validation
- 100% total weightage validation before submission
- Manager approval / reject / return workflow
- Locked goals after approval
- Admin unlock API
- Shared goals model and push API
- Shared achievement sync
- Quarterly check-ins
- Progress score engine
- Employee, Manager and Admin dashboards
- Audit trail
- Escalation engine API
- In-app notification model
- CSV and Excel exports
- Seed data for 10 employees, 3 managers and 1 admin
- Docker deployment setup

## Demo Credentials

All demo users use this password:

```txt
Password@123
```

```txt
Admin:    admin@goalsphere.com
Manager:  manager1@goalsphere.com
Employee: employee1@goalsphere.com
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
copy .env.example .env
```

### 3. Start PostgreSQL with Docker

```bash
docker compose up -d db
```

### 4. Run Prisma migration

```bash
npx prisma migrate dev --name init
```

### 5. Seed database

```bash
npm run seed
```

### 6. Start development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Full Docker Run

```bash
docker compose up --build
```

## Important APIs

### Auth

- `POST /api/auth/[...nextauth]`

### Goals

- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`

### Manager

- `GET /api/manager/approvals`
- `POST /api/manager/approvals`
- `GET /api/manager/checkins`
- `POST /api/manager/checkins`

### Admin

- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/cycles`
- `POST /api/admin/cycles`
- `GET /api/admin/shared-goals`
- `POST /api/admin/shared-goals`
- `GET /api/admin/audit`
- `POST /api/admin/unlock`
- `GET /api/admin/escalations`
- `POST /api/admin/escalations`

### Reports

- `GET /api/reports/export?format=csv`
- `GET /api/reports/export?format=xlsx`

## Folder Structure

```txt
goalsphere/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── manager/
│   │   ├── admin/
│   │   ├── checkins/
│   │   └── reports/
│   ├── components/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── score.ts
│   │   └── validations/
│   ├── store/
│   └── types/
├── Dockerfile
├── docker-compose.yml
├── ARCHITECTURE.md
└── README.md
```

## Hackathon Demo Flow

1. Login as Employee.
2. Create goals and show validation rules.
3. Login as Manager.
4. Approve / return submitted goals.
5. Login as Employee and submit quarterly achievement.
6. Login as Admin.
7. Show audit trail, escalation engine, and export reports.

## Deployment

### Vercel

1. Push code to GitHub.
2. Import project in Vercel.
3. Add environment variables.
4. Use Supabase/Railway PostgreSQL connection string in `DATABASE_URL`.
5. Run Prisma migration from local or CI.

### Railway / Render

Use the included Dockerfile and configure:

```txt
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
```

## Notes

- Microsoft Entra ID and Teams integrations are architected as extension points. The current implementation includes the complete authentication and notification foundation needed to add them quickly.
- Email architecture environment variables are included; production SMTP can be connected using Nodemailer.


## Stability & Performance Hardening

This delivery includes a hardened build with optimized scoped queries, Prisma indexes, improved Employee goal submission, inline Manager approvals, Admin user management, locked-goal unlock, safer check-ins, and scoped report exports. See `PERFORMANCE_AND_FLOW_FIXES.md` for details.
