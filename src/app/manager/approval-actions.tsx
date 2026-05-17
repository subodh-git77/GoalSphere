'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, RotateCcw, X, Loader2 } from 'lucide-react';

export default function ApprovalActions({ goalId, targetValue, weightage }: { goalId: string; targetValue: string; weightage: number }) {
  const router = useRouter();
  const [target, setTarget] = useState(targetValue);
  const [weight, setWeight] = useState(String(weightage));
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  async function act(action: string) {
    setBusy(action);
    const res = await fetch('/api/manager/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goalIds: [goalId],
        action,
        comment: comment || (action === 'APPROVE' ? 'Approved in GoalSphere workflow' : 'Returned for correction'),
        edits: { [goalId]: { targetValue: target, weightage: Number(weight) } },
      }),
    });
    const json = await res.json();
    setBusy(null);
    if (!res.ok) return alert(json.error || 'Action failed');
    router.refresh();
  }

  return (
    <div className="w-full space-y-3 md:max-w-md">
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="input h-10" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target" />
        <input className="input h-10" type="number" min={10} max={100} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weightage" />
      </div>
      <input className="input h-10" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Manager comment" />
      <div className="flex flex-wrap gap-2">
        <button disabled={!!busy} onClick={() => act('APPROVE')} className="btn-primary">{busy === 'APPROVE' ? <Loader2 className="animate-spin" size={15}/> : <Check size={15}/>} Approve</button>
        <button disabled={!!busy} onClick={() => act('RETURN')} className="btn-muted">{busy === 'RETURN' ? <Loader2 className="animate-spin" size={15}/> : <RotateCcw size={15}/>} Return</button>
        <button disabled={!!busy} onClick={() => act('REJECT')} className="btn bg-rose-50 text-rose-700">{busy === 'REJECT' ? <Loader2 className="animate-spin" size={15}/> : <X size={15}/>} Reject</button>
      </div>
    </div>
  );
}
