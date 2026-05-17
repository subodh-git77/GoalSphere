'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalSchema } from '@/lib/validations/goal';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';

export default function GoalForm({ currentTotal, disabled = false }: { currentTotal: number; disabled?: boolean }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: { uomType: 'NUMERIC_MIN', weightage: 10 },
  });

  async function onSubmit(data: any) {
    const res = await fetch('/api/goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) alert(json.error || 'Failed');
    else { reset({ uomType: 'NUMERIC_MIN', weightage: 10 }); router.refresh(); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Thrust Area</label>
        <select className="input" {...register('thrustArea')}>
          <option value="">Select thrust area</option>
          <option value="Revenue Growth">Revenue Growth</option>
          <option value="Customer Experience">Customer Experience</option>
          <option value="Operational Excellence">Operational Excellence</option>
          <option value="Innovation">Innovation</option>
          <option value="People Development">People Development</option>
        </select>
      </div>
      <div>
        <label className="label">Goal Title</label>
        <input className="input" placeholder="Example: Improve quarterly CSAT" {...register('title')} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-24 resize-none" placeholder="Add measurable goal description" {...register('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">UoM Type</label>
          <select className="input" {...register('uomType')}>
            <option value="NUMERIC_MIN">Numeric Min</option>
            <option value="NUMERIC_MAX">Numeric Max</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="TIMELINE">Timeline</option>
            <option value="ZERO_BASED">Zero-based</option>
          </select>
        </div>
        <div>
          <label className="label">Target</label>
          <input className="input" placeholder="100 / 90% / 2026-03-31" {...register('targetValue')} />
        </div>
      </div>
      <div>
        <label className="label">Weightage</label>
        <input className="input" type="number" min={10} max={100} placeholder="Minimum 10" {...register('weightage')} />
        <p className="mt-2 text-xs font-semibold text-slate-500">Current total before this goal: {currentTotal}%</p>
      </div>
      {Object.values(errors).length > 0 && <div className="rounded-2xl bg-rose-50 p-4">{Object.values(errors).map((e: any, i) => <p className="text-xs font-semibold text-rose-700" key={i}>{e.message}</p>)}</div>}
      {disabled && <div className="rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-slate-500">Approved locked goal sheets cannot be edited. Ask Admin to unlock.</div>}
      <button disabled={isSubmitting || disabled} className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />} Save Draft
      </button>
    </form>
  );
}
