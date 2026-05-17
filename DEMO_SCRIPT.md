# GoalSphere — 5 Minute Demo Script

## 0:00 – 0:30 Introduction
Hello everyone, this is **GoalSphere**, an enterprise goal setting and performance tracking portal built for employees, managers, and HR/Admin teams.

The platform solves fragmented goal tracking by replacing spreadsheets and manual review cycles with a structured, digital, role-based workflow.

## 0:30 – 1:30 Employee Journey
Login as an employee.

Show:
- Employee dashboard
- Goal creation screen
- Thrust area, title, UoM, target, and weightage fields
- Validation rules: minimum 10%, maximum 8 goals, total weightage must equal 100%
- Submit goals for manager approval

Explain that once goals are approved, they become locked and cannot be edited by the employee.

## 1:30 – 2:30 Manager Journey
Login as a manager.

Show:
- Manager dashboard
- Pending approvals
- Submitted employee goals
- Inline review/editing capability
- Approve/reject/return workflow
- Manager check-in comments

Explain that managers get visibility into their team’s planned vs actual achievement.

## 2:30 – 3:30 Quarterly Check-in
Login again as employee or use the check-in screen.

Show:
- Actual achievement update
- Status: Not Started, On Track, Completed
- Progress score calculation
- Planned vs actual tracking

Explain the scoring engine:
- Higher-is-better goals use achievement / target
- Lower-is-better goals use target / achievement
- Zero-based goals score 100% only when actual is zero

## 3:30 – 4:30 Admin / HR Journey
Login as Admin.

Show:
- Admin dashboard
- User and cycle management
- Shared goals
- Audit logs
- Escalations
- Reports

Explain that audit logs capture governance-sensitive changes, especially after goal lock.

## 4:30 – 5:00 Closing
GoalSphere is built using Next.js, TypeScript, Prisma, PostgreSQL, NextAuth, Tailwind CSS, and Docker.

It is scalable, deployable, and ready for enterprise extensions such as Microsoft Entra ID, Teams notifications, and advanced analytics.
