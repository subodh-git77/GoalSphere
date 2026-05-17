'use client';

import { useRouter } from 'next/navigation';
import { Trash2, Send, Unlock, Loader2 } from 'lucide-react';
import { useState } from 'react';

function approvalBadge(status: string) {
  if (status === 'APPROVED') return 'badge-green';
  if (status === 'REJECTED') return 'badge-rose';
  if (status === 'RETURNED') return 'badge-blue';
  return 'badge-amber';
}
function progressBadge(status: string) {
  if (status === 'COMPLETED') return 'badge-green';
  if (status === 'ON_TRACK') return 'badge-cyan';
  return 'badge-blue';
}
function submissionBadge(status: string) {
  if (status === 'APPROVED') return 'badge-green';
  if (status === 'SUBMITTED') return 'badge-amber';
  if (status === 'RETURNED') return 'badge-blue';
  if (status === 'REJECTED') return 'badge-rose';
  return 'badge-blue';
}

export default function GoalTable({ goals, mode = 'read', totalWeightage = 0 }: { goals: any[]; mode?: 'read' | 'employee' | 'admin'; totalWeightage?: number }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function submitGoal(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/goals/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submit: true }) });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok) return alert(json.error || 'Submit failed');
    router.refresh();
  }

  async function deleteGoal(id: string) {
    if (!confirm('Delete this goal?')) return;
    setBusyId(id);
    const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    const json = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) return alert(json.error || 'Delete failed');
    router.refresh();
  }

  async function unlockGoal(id: string) {
    setBusyId(id);
    const res = await fetch('/api/admin/unlock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ goalId: id }) });
    const json = await res.json();
    setBusyId(null);
    if (!res.ok) return alert(json.error || 'Unlock failed');
    router.refresh();
  }

  if (!goals.length) {
    return (
      <div className="panel flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-50 text-3xl">🎯</div>
        <h3 className="text-xl font-black text-slate-900">No goals found</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">Create your first goal sheet or wait for submitted team goals to appear here.</p>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-black text-slate-900">Goal Portfolio</h3>
          <p className="text-xs text-slate-500">Planned targets, ownership, approvals and latest progress score.</p>
        </div>
        <span className="badge badge-blue">{goals.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>{['Employee', 'Goal', 'Thrust Area', 'Weight', 'Progress', 'Submission', 'Approval', 'Score', mode === 'read' ? '' : 'Actions'].map((h) => <th className="px-5 py-4" key={h}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {goals.map((g) => {
              const score = Math.round(g.checkins?.[0]?.progressScore || g.checkins?.at?.(-1)?.progressScore || 0);
              const locked = Boolean(g.locked);
              const canSubmit = mode === 'employee' && ['DRAFT', 'RETURNED', 'REJECTED'].includes(g.submissionStatus) && totalWeightage === 100 && !locked;
              return (
                <tr key={g.id} className="bg-white transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-xs font-black text-indigo-700">
                        {(g.user?.name || 'Me').slice(0, 2).toUpperCase()}
                      </div>
                      <div><span className="font-bold text-slate-800">{g.user?.name || 'Me'}</span><p className="text-xs text-slate-400">{g.user?.department || ''}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900">{g.title}</p><p className="line-clamp-1 text-xs text-slate-500">{g.description}</p></td>
                  <td className="px-5 py-4 text-slate-600">{g.thrustArea}</td>
                  <td className="px-5 py-4 font-bold">{g.weightage}%</td>
                  <td className="px-5 py-4"><span className={`badge ${progressBadge(g.status)}`}>{g.status?.replaceAll('_', ' ')}</span></td>
                  <td className="px-5 py-4"><span className={`badge ${submissionBadge(g.submissionStatus)}`}>{g.submissionStatus}</span></td>
                  <td className="px-5 py-4"><span className={`badge ${approvalBadge(g.approvalStatus)}`}>{g.approvalStatus}</span>{locked && <span className="ml-2 badge badge-green">LOCKED</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500" style={{ width: `${Math.min(score, 100)}%` }} /></div>
                      <span className="font-black text-slate-900">{score}%</span>
                    </div>
                  </td>
                  {mode !== 'read' && <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {mode === 'employee' && <button disabled={!canSubmit || busyId === g.id} onClick={() => submitGoal(g.id)} className="btn-muted disabled:cursor-not-allowed disabled:opacity-40" title={totalWeightage !== 100 ? 'Total weightage must be 100%' : 'Submit goal'}>{busyId === g.id ? <Loader2 className="animate-spin" size={15}/> : <Send size={15}/>} Submit</button>}
                      {mode === 'employee' && !locked && <button disabled={busyId === g.id} onClick={() => deleteGoal(g.id)} className="btn bg-rose-50 text-rose-700"><Trash2 size={15}/></button>}
                      {mode === 'admin' && locked && <button disabled={busyId === g.id} onClick={() => unlockGoal(g.id)} className="btn-muted"><Unlock size={15}/> Unlock</button>}
                    </div>
                  </td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
