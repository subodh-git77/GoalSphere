import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CheckinForm from './checkin-form';
import KpiCard from '@/components/KpiCard';
import { CalendarCheck, Target, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Checkins() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const goals = await prisma.goal.findMany({
    where: role === 'EMPLOYEE' ? { userId, locked: true } : { user: role === 'MANAGER' ? { managerId: userId } : undefined, locked: true },
    include: { user: { select: { name: true, department: true } }, checkins: { orderBy: { checkinDate: 'desc' }, take: 1 } },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });
  const avg = Math.round(goals.reduce((s, g) => s + (g.checkins?.[0]?.progressScore || 0), 0) / (goals.length || 1));
  return <AppShell><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">Achievement tracking</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Quarterly Check-ins</h1><p className="mt-2 text-sm text-slate-500">Update actual achievements and manager review comments for approved locked goals.</p></div><div className="mb-6 grid gap-5 md:grid-cols-3"><KpiCard title="Approved Goals" value={goals.length} icon={Target}/><KpiCard title="Latest Avg Score" value={`${avg}%`} icon={TrendingUp}/><KpiCard title="Active Quarter" value="Q1-Q4" icon={CalendarCheck} caption="Demo-ready windows"/></div><div className="grid gap-5 lg:grid-cols-2">{goals.map((g) => <div key={g.id} className="card"><p className="text-sm text-slate-500">{g.user.name} • {g.user.department}</p><h3 className="mt-1 text-xl font-bold">{g.title}</h3><p className="mb-4 mt-2 text-sm text-slate-500">Target: {g.targetValue} • UoM: {g.uomType} • Weight: {g.weightage}%</p><CheckinForm goalId={g.id} latest={g.checkins?.[0]} /></div>)}{goals.length === 0 && <div className="panel col-span-full grid min-h-64 place-items-center text-center text-slate-500">No approved locked goals available for check-ins yet.</div>}</div></AppShell>;
}
