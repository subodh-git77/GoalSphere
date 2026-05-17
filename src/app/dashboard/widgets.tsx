'use client';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts';

export function DashboardChart({ goals }: { goals: any[] }) {
  const data = Object.values(goals.reduce((a: any, g: any) => {
    const k = g.thrustArea || 'General';
    a[k] = a[k] || { name: k, score: 0, count: 0 };
    a[k].score += (g.checkins?.at?.(-1)?.progressScore || 0);
    a[k].count++;
    return a;
  }, {})).map((x: any) => ({ name: x.name, score: Math.round(x.score / x.count) }));

  if (!data.length) return <EmptyChart />;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: 'rgba(79,70,229,.06)' }} />
          <Bar dataKey="score" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({ goals }: { goals: any[] }) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => {
    const scores = goals.flatMap((g: any) => g.checkins?.filter((c: any) => c.quarter === q).map((c: any) => c.progressScore) || []);
    return { quarter: q, score: Math.round(scores.reduce((a: number, b: number) => a + b, 0) / (scores.length || 1)) };
  });
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={quarters} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="score" strokeWidth={3} fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart() {
  return <div className="grid h-72 place-items-center rounded-3xl bg-slate-50 text-sm font-semibold text-slate-400">No analytics data available yet</div>;
}
