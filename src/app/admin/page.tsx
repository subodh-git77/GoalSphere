import AppShell from '@/components/AppShell';
import KpiCard from '@/components/KpiCard';
import GoalTable from '@/components/GoalTable';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AlertTriangle, History, Target, Users } from 'lucide-react';
import AdminActions from './admin-actions';
import UserManagement from './user-management';
import { goalListInclude } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  const s = await getServerSession(authOptions);
  if (!s) redirect('/login');
  if ((s.user as any).role !== 'ADMIN') redirect('/dashboard');
  const [users, goalsCount, audits, escalations, lockedGoals] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.goal.count(),
    prisma.auditLog.findMany({ include: { actor: { select: { name: true } } }, orderBy: { timestamp: 'desc' }, take: 20 }),
    prisma.escalation.count({ where: { status: 'OPEN' } }),
    prisma.goal.findMany({ where: { locked: true }, include: goalListInclude, orderBy: { updatedAt: 'desc' }, take: 20 }),
  ]);
  return (
    <AppShell>
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Admin / HR Governance</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Control Center</h1>
        <p className="mt-2 text-sm text-slate-500">Manage users, reports, escalations, audit logs and locked goal exceptions.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-4"><KpiCard title="Active Users" value={users} icon={Users}/><KpiCard title="Goals" value={goalsCount} icon={Target}/><KpiCard title="Recent Audit Events" value={audits.length} icon={History}/><KpiCard title="Open Escalations" value={escalations} icon={AlertTriangle}/></div>
      <AdminActions />
      <UserManagement />
      <div className="mt-6"><GoalTable goals={lockedGoals} mode="admin" /></div>
      <div className="card mt-6"><h2 className="mb-4 text-lg font-bold">Recent Audit Trail</h2><div className="space-y-3">{audits.map((a) => <div key={a.id} className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold">{a.action} • {a.entityType}</p><p className="text-sm text-slate-500">By {a.actor.name} at {a.timestamp.toLocaleString()}</p></div>)}</div></div>
    </AppShell>
  );
}
