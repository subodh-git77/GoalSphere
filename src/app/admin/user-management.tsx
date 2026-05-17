'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, RefreshCw, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';

type UserRow = { id: string; employeeId: string; name: string; email: string; role: string; department: string; designation: string; managerId?: string | null; isActive: boolean; manager?: { id: string; name: string } | null };

const emptyForm = { employeeId: '', name: '', email: '', password: '', role: 'EMPLOYEE', department: '', designation: '', managerId: '' };

export default function UserManagement() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const managers = users.filter((u) => ['MANAGER', 'ADMIN'].includes(u.role) && u.isActive);
  const filtered = useMemo(() => users.filter((u) => `${u.name} ${u.email} ${u.department} ${u.role}`.toLowerCase().includes(query.toLowerCase())), [users, query]);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch('/api/admin/users', { cache: 'no-store' });
    const json = await res.json();
    setUsers(Array.isArray(json) ? json : []);
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, managerId: form.managerId || null };
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) return alert(typeof json.error === 'string' ? json.error : 'Please check user details. Email and Employee ID must be unique.');
    setForm(emptyForm);
    await loadUsers();
    router.refresh();
  }

  async function toggleUser(user: UserRow, active: boolean) {
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: active }) });
    if (!res.ok) return alert('User update failed');
    await loadUsers();
    router.refresh();
  }

  async function disableUser(user: UserRow) {
    if (!confirm(`Disable ${user.name}? Login will be blocked but reports remain safe.`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Disable failed');
    await loadUsers();
    router.refresh();
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-3">
      <form onSubmit={createUser} className="card xl:col-span-1">
        <div className="mb-5 flex items-center justify-between">
          <div><h2 className="text-lg font-black">Add User</h2><p className="text-xs text-slate-500">Create employees, managers or admin users.</p></div>
          <Plus className="text-indigo-600" />
        </div>
        <div className="space-y-3">
          <input className="input" placeholder="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="Password, default Password@123" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>EMPLOYEE</option><option>MANAGER</option><option>ADMIN</option></select>
            <input className="input" placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          </div>
          <input className="input" placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required />
          <select className="input" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
            <option value="">No manager / Admin</option>
            {managers.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
          </select>
          <button disabled={saving} className="btn-primary w-full py-3 disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />} Create User</button>
        </div>
      </form>

      <div className="panel xl:col-span-2">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center">
          <div><h2 className="font-black">User Directory</h2><p className="text-xs text-slate-500">Soft-disable users instead of hard delete to preserve audit/report history.</p></div>
          <div className="flex gap-2"><input className="input h-10 w-56" placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} /><button onClick={loadUsers} className="btn-muted"><RefreshCw size={16}/></button></div>
        </div>
        {loading ? <div className="grid h-52 place-items-center"><Loader2 className="animate-spin text-indigo-600" /></div> : <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{['User', 'Role', 'Department', 'Manager', 'Status', 'Action'].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => <tr key={u.id} className="bg-white hover:bg-slate-50">
                <td className="px-5 py-4"><p className="font-bold text-slate-900">{u.name}</p><p className="text-xs text-slate-500">{u.employeeId} • {u.email}</p></td>
                <td className="px-5 py-4"><span className="badge badge-blue">{u.role}</span></td>
                <td className="px-5 py-4">{u.department}<p className="text-xs text-slate-400">{u.designation}</p></td>
                <td className="px-5 py-4">{u.manager?.name || '—'}</td>
                <td className="px-5 py-4"><span className={`badge ${u.isActive ? 'badge-green' : 'badge-rose'}`}>{u.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
                <td className="px-5 py-4"><div className="flex gap-2">{u.isActive ? <button onClick={() => disableUser(u)} className="btn bg-rose-50 text-rose-700"><UserX size={15}/> Disable</button> : <button onClick={() => toggleUser(u, true)} className="btn-muted">Reactivate</button>}</div></td>
              </tr>)}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
}
