# GoalSphere — Hackathon Submission Notes

## Project Name
**GoalSphere — In-House Goal Setting & Tracking Portal**

## One-Line Pitch
GoalSphere is an enterprise-grade HR SaaS portal that digitizes employee goal creation, manager approval, quarterly achievement tracking, audit governance, reporting, and escalation workflows.

## Problem Solved
Organizations often track goals using spreadsheets, emails, and offline reviews. GoalSphere replaces this fragmented process with a centralized, role-based, audit-ready platform for employees, managers, and HR/Admin teams.

## Core User Roles

### Employee
- Create draft goals
- Submit goals for approval
- Update quarterly achievement
- Track goal status and progress

### Manager / L1
- Review submitted goals
- Approve, reject, or return goals for rework
- Edit targets/weightage during approval
- Add check-in comments
- Monitor team progress

### Admin / HR
- Manage users and cycles
- Push shared goals
- Unlock locked goals
- View audit logs
- Track escalations
- Export reports

## Implemented Must-Have Requirements
- Role-based authentication and route protection
- Goal creation and submission workflow
- Weightage validations: total 100%, minimum 10%, maximum 8 goals
- Manager approval workflow
- Goal locking after approval
- Admin unlock support
- Shared goals model and API
- Quarterly check-in module
- Progress score calculation engine
- Employee, Manager, and Admin dashboards
- Audit log tracking
- CSV and Excel exports
- Escalation API and admin visibility
- Seed data for demo
- Docker and deployment configuration

## Good-to-Have / Bonus Features Included
- Escalation workflow foundation
- In-app notification data model
- Reporting exports
- Analytics dashboards using charts
- Architecture designed for Microsoft Entra ID / Teams integration extension

## Recommended Demo Flow
1. Login as Employee and create/submit goals.
2. Show validation rules by attempting invalid weightage.
3. Login as Manager and approve/reject goals.
4. Login as Employee and update quarterly check-in achievement.
5. Login as Admin and show audit logs, reports, users, cycles, and escalations.
6. Export CSV/Excel report.

## Demo Credentials
All users use the password:

```txt
Password@123
```

```txt
Admin:    admin@goalsphere.com
Manager:  manager1@goalsphere.com
Employee: employee1@goalsphere.com
```

## Local Run Commands

```bash
npm install
cp .env.example .env
docker compose up -d db
npx prisma db push
npm run seed
npm run dev
```

For Windows PowerShell:

```powershell
copy .env.example .env
docker compose up -d db
npx prisma db push
npm run seed
npm run dev
```

Open:

```txt
http://localhost:3000
```
