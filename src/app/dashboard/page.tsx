import AppShell from '@/components/AppShell';
import KpiCard from '@/components/KpiCard';
import GoalTable from '@/components/GoalTable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CheckCircle2, Clock, Target, TrendingUp, Users } from 'lucide-react';
import { DashboardChart, TrendChart } from './widgets';
import { getScopedGoals } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const goals = await getScopedGoals(role, userId, 100);
  const approved = goals.filter((g) => g.approvalStatus === 'APPROVED').length;
  const pending = goals.filter((g) => g.submissionStatus === 'SUBMITTED').length;
  const avg = Math.round(goals.reduce((s, g) => s + (g.checkins?.[0]?.progressScore || 0), 0) / (goals.length || 1));
  const completion = goals.length ? Math.round((approved / goals.length) * 100) : 0;

  return (
    <AppShell>
      <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-900 p-7 text-white shadow-2xl shadow-indigo-200 lg:p-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">{role} workspace</p>
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">Performance command center</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">Fast dashboard with scoped data, latest check-ins only, approval status and governance metrics.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Cycle health</p>
            <p className="mt-2 text-3xl font-black">{completion}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Goals" value={goals.length} icon={Target} caption="Scoped active records" />
        <KpiCard title="Approved" value={approved} icon={CheckCircle2} caption="Locked after approval" trend="Governance ready" />
        <KpiCard title="Pending" value={pending} icon={Clock} caption="Needs L1 action" />
        <KpiCard title="Avg Progress" value={`${avg}%`} icon={TrendingUp} caption="Latest check-in score" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <div className="card xl:col-span-2">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black">Thrust Area Analytics</h2><p className="text-xs text-slate-500">Average progress by strategic area.</p></div><Users className="text-indigo-600" /></div>
          <DashboardChart goals={goals} />
        </div>
        <div className="card xl:col-span-3">
          <h2 className="text-lg font-black">Quarterly Trend</h2>
          <p className="mb-4 text-xs text-slate-500">QoQ achievement score from completed check-ins.</p>
          <TrendChart goals={goals} />
        </div>
      </div>

      <div className="mt-6"><GoalTable goals={goals} /></div>
    </AppShell>
  );
}
