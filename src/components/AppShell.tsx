'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { BarChart3, Bell, ClipboardCheck, FileDown, LayoutDashboard, LogOut, Menu, ShieldCheck, Sparkles, Target } from 'lucide-react';

const nav = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/goals', 'Goals', Target],
  ['/checkins', 'Check-ins', ClipboardCheck],
  ['/manager', 'Manager', BarChart3],
  ['/admin', 'Admin', ShieldCheck],
  ['/reports', 'Reports', FileDown],
] as const;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const pathname = usePathname();
  const role = (data?.user as any)?.role;
  const visibleNav = nav.filter(([href]) => role === 'ADMIN' || (role === 'MANAGER' && href !== '/admin') || (role === 'EMPLOYEE' && !['/admin', '/manager', '/reports'].includes(href)));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
      <div className="fixed inset-0 -z-10 bg-grid opacity-60" />

      <aside className="fixed inset-y-0 left-0 hidden w-76 border-r border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-2xl lg:block lg:w-72">
        <div className="mb-8 flex items-center gap-3 rounded-[1.75rem] bg-gradient-to-br from-slate-950 to-indigo-950 p-4 text-white shadow-2xl shadow-indigo-200">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl font-black text-indigo-700">G</div>
          <div>
            <h1 className="text-xl font-black leading-none">GoalSphere</h1>
            <p className="mt-1 text-xs text-white/65">Enterprise Performance OS</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {visibleNav.map(([href, label, Icon]) => {
            const active = pathname === href;
            return (
              <Link key={href} className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${active ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}`} href={href}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-[1.75rem] border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-black text-indigo-900"><Sparkles size={16} /> GoalSphere</div>
          <p className="text-xs leading-5 text-indigo-700">Goal lifecycle, approvals, check-ins, reports and audit logs are enabled.</p>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 px-4 py-3 backdrop-blur-2xl lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="btn-muted lg:hidden"><Menu size={18} /></button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Welcome back</p>
                <h2 className="text-lg font-black text-slate-950">{data?.user?.name || 'GoalSphere User'}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 md:block">{role || 'USER'}</div>
              <button className="btn-muted"><Bell size={17} /></button>
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn-muted"><LogOut size={17} /> <span className="hidden sm:inline">Logout</span></button>
            </div>
          </div>
        </header>
        <section className="p-4 lg:p-8">{children}</section>
      </main>
    </div>
  );
}
