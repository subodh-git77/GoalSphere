import AppShell from '@/components/AppShell';
import GoalTable from '@/components/GoalTable';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import GoalForm from './goal-form';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { goalListInclude } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function Goals() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const userId = (session.user as any).id;
  const goals = await prisma.goal.findMany({ where: { userId }, include: goalListInclude, orderBy: { updatedAt: 'desc' }, take: 20 });
  const total = goals.reduce((s, g) => s + g.weightage, 0);
  const ready = total === 100 && goals.length > 0;
  const lockedCount = goals.filter((g) => g.locked).length;

  return (
    <AppShell>
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Employee goal sheet</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">My Goals</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Create up to 8 goals. Minimum 10% each. Total weightage must equal 100% before final submission.</p>
        </div>
        <div className={`rounded-3xl px-5 py-4 ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          <div className="flex items-center gap-2 text-sm font-black">{ready ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {ready ? 'Ready to submit' : 'Weightage incomplete'}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card xl:sticky xl:top-28 xl:self-start">
          <h2 className="mb-1 text-xl font-black">Create Goal</h2>
          <p className="mb-5 text-sm text-slate-500">Draft a goal with measurable target and weightage.</p>
          <GoalForm currentTotal={total} disabled={lockedCount > 0 && goals.every((g) => g.locked)} />
        </div>
        <div className="xl:col-span-2">
          <div className="card mb-5">
            <div className="flex justify-between text-sm font-black"><span>Total Weightage</span><span>{total}% / 100%</span></div>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-100"><div className={`h-4 rounded-full ${total === 100 ? 'bg-emerald-500' : total > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-600 to-cyan-500'}`} style={{ width: `${Math.min(total, 100)}%` }} /></div>
            <p className="mt-3 text-xs font-medium text-slate-500">Submit buttons become active only when total is exactly 100%.</p>
          </div>
          <GoalTable goals={goals} mode="employee" totalWeightage={total} />
        </div>
      </div>
    </AppShell>
  );
}
