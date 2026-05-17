# GoalSphere Performance & Flow Hardening Notes

This build includes stability and performance fixes added after review.

## Fixed / Improved

- Added scoped, limited database queries instead of loading all records everywhere.
- Added Prisma indexes for high-frequency filters: goal status, lock state, updatedAt, check-ins, audit logs, notifications and escalations.
- Improved Employee goal workflow:
  - Create draft
  - Prevent total weightage above 100%
  - Submit only when total weightage is exactly 100%
  - Delete unlocked drafts
  - Respect locked goal sheets
- Improved Manager approval workflow:
  - Inline target editing
  - Inline weightage editing
  - Manager comments
  - Approve / Return / Reject actions
  - Direct-report permission checks
- Improved Admin/HR features:
  - Add user from UI
  - List/search users
  - Soft-disable users instead of hard delete
  - Reactivate users
  - Unlock locked goals
- Improved Check-in workflow:
  - Only locked approved goals appear
  - Latest check-in is preloaded
  - Ownership and manager hierarchy checks added
- Improved report exports:
  - Manager exports only scoped team data
  - Admin exports organization data
- Reduced heavy dashboard rendering by fetching latest check-in only.

## Recommended Local Reset After Updating

```bash
rm -rf node_modules package-lock.json
npm install
copy .env.example .env
npx prisma generate
npx prisma db push --force-reset
npm run seed
npm run dev
```

## Demo Credentials

Password for all demo accounts:

```txt
Password@123
```

Accounts:

```txt
admin@goalsphere.com
manager1@goalsphere.com
employee1@goalsphere.com
```
