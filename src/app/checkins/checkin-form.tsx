'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

export default function CheckinForm({ goalId, latest }: { goalId: string; latest?: any }) {
  const [actualAchievement, setActual] = useState(latest?.actualAchievement || '');
  const [quarter, setQuarter] = useState(latest?.quarter || 'Q1');
  const [status, setStatus] = useState(latest?.status || 'ON_TRACK');
  const [employeeComment, setComment] = useState(latest?.employeeComment || '');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  async function submit() {
    if (!actualAchievement) return alert('Actual achievement is required');
    setSaving(true);
    const res = await fetch('/api/manager/checkins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ goalId, quarter, actualAchievement, status, employeeComment }) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) alert(typeof json.error === 'string' ? json.error : 'Failed');
    else { alert(`Saved. Progress score: ${Math.round(json.progressScore)}%`); router.refresh(); }
  }
  return <div className="grid gap-3 md:grid-cols-2"><select className="input" value={quarter} onChange={e => setQuarter(e.target.value)}><option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option></select><select className="input" value={status} onChange={e => setStatus(e.target.value)}><option value="NOT_STARTED">Not Started</option><option value="ON_TRACK">On Track</option><option value="COMPLETED">Completed</option></select><input className="input" placeholder="Actual achievement" value={actualAchievement} onChange={e => setActual(e.target.value)} /><input className="input" placeholder="Comment" value={employeeComment} onChange={e => setComment(e.target.value)} /><button disabled={saving} onClick={submit} className="btn-primary md:col-span-2 disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={17}/> : <Save size={17}/>} Save Check-in</button></div>;
}
