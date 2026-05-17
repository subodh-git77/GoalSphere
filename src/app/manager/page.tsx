import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ApprovalActions from './approval-actions';
import KpiCard from '@/components/KpiCard';
import { ClipboardCheck, Clock, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Manager() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session.user as any).role;
  if (role === 'EMPLOYEE') redirect('/dashboard');
  const userId = (session.user as any).id;
  const where = { submissionStatus: 'SUBMITTED' as const, user: role === 'MANAGER' ? { managerId: userId } : undefined };
  const [goals, teamCount] = await Promise.all([
    prisma.goal.findMany({ where, include: { user: { select: { name: true, department: true, designation: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 }),
    role === 'MANAGER' ? prisma.user.count({ where: { managerId: userId, isActive: true } }) : prisma.user.count({ where: { role: 'EMPLOYEE', isActive: true } }),
  ]);
  return (
    <AppShell>
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">L1 approval workflow</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Manager Approval Center</h1>
        <p className="mt-2 text-sm text-slate-500">Review submitted goals, edit targets/weightages inline, approve, reject or return for rework.</p>
      </div>
      <div className="mb-6 grid gap-5 md:grid-cols-3"><KpiCard title="Team Size" value={teamCount} icon={Users}/><KpiCard title="Pending Approvals" value={goals.length} icon={Clock}/><KpiCard title="Workflow" value="Live" icon={ClipboardCheck} caption="Audited manager actions"/></div>
      <div className="space-y-4">{goals.map((g) => <div key={g.id} className="card flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between"><div className="max-w-2xl"><p className="text-sm text-slate-500">{g.user.name} • {g.user.department} • {g.user.designation}</p><h3 className="mt-1 text-xl font-bold">{g.title}</h3><p className="mt-2 text-sm text-slate-500">{g.description || 'No description provided'}</p><p className="mt-3 text-sm font-semibold text-slate-700">{g.thrustArea} • Target {g.targetValue} • Weight {g.weightage}% • UoM {g.uomType}</p></div><ApprovalActions goalId={g.id} targetValue={g.targetValue} weightage={g.weightage}/></div>)}{goals.length === 0 && <div className="panel grid min-h-64 place-items-center text-center"><div><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 text-3xl">✅</div><h3 className="text-xl font-black text-slate-900">No pending approvals</h3><p className="mt-2 text-sm text-slate-500">Submitted employee goals will appear here.</p></div></div>}</div>
    </AppShell>
  );
}
