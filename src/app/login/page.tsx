'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Sparkles, Users } from 'lucide-react';

const demoUsers = [
  { role: 'Admin / HR', email: 'admin@goalsphere.com' },
  { role: 'Manager L1', email: 'manager1@goalsphere.com' },
  { role: 'Employee', email: 'employee1@goalsphere.com' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) setError('Invalid email or password');
    else router.push('/dashboard');
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-950 p-4 lg:grid-cols-2 lg:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,.35),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,.28),transparent_38%)]" />
      <div className="absolute inset-0 bg-grid opacity-10" />

      {/* LEFT PANEL */}
      <section className="relative hidden min-h-[calc(100vh-3rem)] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-2xl lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-3xl font-black text-indigo-700">
              G
            </div>
            <div>
              <h1 className="text-2xl font-black">GoalSphere</h1>
              <p className="text-sm text-white/60">
                Align Goals. Track Performance. Drive Growth.
              </p>
            </div>
          </div>

          <h2 className="max-w-xl text-5xl font-black leading-tight tracking-tight">
            Enterprise goal tracking built for visibility, accountability and faster reviews.
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
            Manage employee goals, L1 approvals, quarterly check-ins, shared KPIs,
            audit trails, reports and escalations from one polished portal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['RBAC', ShieldCheck],
            ['Team Flow', Users],
            ['Audit Ready', Sparkles],
          ].map(([label, Icon]: any) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
            >
              <Icon className="mb-4" size={24} />
              <p className="font-black">{label}</p>
              <p className="mt-1 text-xs text-white/55">
                Production-grade demo module
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="relative grid place-items-center p-2 lg:p-8">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-7 shadow-2xl shadow-black/20 lg:p-8"
        >
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-3xl font-black text-white shadow-lg shadow-indigo-200">
              G
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              Sign in to GoalSphere
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Use your assigned Employee, Manager or Admin account.
            </p>
          </div>

          {/* EMAIL INPUT (NO ICON) */}
          <label className="label">Email Address</label>
          <input
            className="input"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD INPUT (NO ICON) */}
          <label className="label mt-5">Password</label>
          <div className="relative">
            <input
              className="input pr-11"
              placeholder="Enter password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-4 top-3.5 text-slate-400"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </p>
          )}

          <button className="btn-primary mt-6 w-full py-3.5">
            Login Securely
          </button>

          {/* DEMO BOX */}
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="flex w-full items-center justify-between text-left text-sm font-black text-slate-800"
            >
              Demo login credentials
              <span className="text-xs font-bold text-indigo-600">
                {showDemo ? 'Hide' : 'View'}
              </span>
            </button>

            {showDemo && (
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                {demoUsers.map((u) => (
                  <div
                    key={u.email}
                    className="flex items-center justify-between rounded-2xl bg-white p-3"
                  >
                    <span className="font-bold text-slate-800">{u.role}</span>
                    <span>{u.email}</span>
                  </div>
                ))}

                <p className="rounded-2xl bg-indigo-50 p-3 font-semibold text-indigo-700">
                  Password for all demo users: Password@123
                </p>
              </div>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
