import { LucideIcon } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  icon: Icon,
  caption,
  trend,
}: {
  title: string;
  value: string | number;
  caption?: string;
  trend?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 opacity-80" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{value}</h3>
          {caption && <p className="mt-2 text-xs font-medium text-slate-400">{caption}</p>}
          {trend && <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{trend}</span>}
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 p-4 text-white shadow-lg shadow-indigo-200">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
