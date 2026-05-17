# GoalSphere Architecture

```mermaid
flowchart LR
  User[Employee / Manager / Admin Browser] --> Next[Next.js 14 App Router]
  Next --> Auth[NextAuth Credentials + JWT RBAC]
  Next --> API[Route Handlers / REST APIs]
  API --> Services[Goal, Approval, Check-in, Reporting Services]
  Services --> Prisma[Prisma ORM]
  Prisma --> PG[(PostgreSQL)]
  Services --> Audit[Audit Log Engine]
  Services --> Notify[In-App + Email Notification Architecture]
  Services --> Export[ExcelJS / CSV Export]
  Cron[Vercel Cron / Railway Cron] --> Escalation[Escalation Engine]
  Escalation --> Notify
```

## Cost Optimisation
- Single Next.js deployment for frontend + APIs.
- PostgreSQL on Supabase/Railway free or low-cost tier.
- Prisma indexing on high-read fields.
- Server-side pagination-ready APIs.
- CSV/Excel generated on demand.
