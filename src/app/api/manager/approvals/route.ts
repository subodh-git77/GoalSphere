import { prisma } from '@/lib/prisma';
import { ok, requireRole } from '@/lib/api-helpers';
import { validateGoalSet } from '@/lib/validations/goal';

export async function GET() {
  const r = await requireRole(['MANAGER', 'ADMIN']);
  if (r.error) return r.error;
  const userId = (r.session!.user as any).id;
  const role = (r.session!.user as any).role;
  return ok(await prisma.goal.findMany({
    where: { submissionStatus: 'SUBMITTED', user: role === 'MANAGER' ? { managerId: userId } : undefined },
    include: { user: true },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  }));
}

export async function POST(req: Request) {
  const r = await requireRole(['MANAGER', 'ADMIN']);
  if (r.error) return r.error;
  const actorId = (r.session!.user as any).id;
  const role = (r.session!.user as any).role;
  const { goalIds, action, comment, edits } = await req.json();
  if (!Array.isArray(goalIds) || !['APPROVE', 'REJECT', 'RETURN'].includes(action)) return ok({ error: 'Valid goalIds and action required' }, 400);

  const statusData = action === 'APPROVE'
    ? { submissionStatus: 'APPROVED' as const, approvalStatus: 'APPROVED' as const, locked: true }
    : action === 'REJECT'
      ? { submissionStatus: 'REJECTED' as const, approvalStatus: 'REJECTED' as const }
      : { submissionStatus: 'RETURNED' as const, approvalStatus: 'RETURNED' as const };

  const updated = [];
  for (const id of goalIds) {
    const old = await prisma.goal.findUnique({ where: { id }, include: { user: true } });
    if (!old) continue;
    if (role === 'MANAGER' && old.user.managerId !== actorId) return ok({ error: 'Manager can approve only direct report goals.' }, 403);
    const edit = edits?.[id] ?? {};
    if (edit.weightage !== undefined) {
      const sheet = await prisma.goal.findMany({ where: { userId: old.userId }, select: { id: true, weightage: true } });
      const err = validateGoalSet(sheet.map((g) => ({ weightage: g.id === id ? Number(edit.weightage) : g.weightage })));
      if (err) return ok({ error: `Cannot approve ${old.user.name}: ${err}` }, 400);
    }
    const goal = await prisma.goal.update({ where: { id }, data: { ...statusData, ...edit, weightage: edit.weightage !== undefined ? Number(edit.weightage) : undefined } });
    updated.push(goal);
    await prisma.auditLog.create({ data: { entityType: 'Goal', entityId: id, action: `MANAGER_${action}`, oldValue: { ...old, comment } as any, newValue: goal as any, changedBy: actorId } });
    await prisma.notification.create({ data: { userId: goal.userId, title: `Goal ${action.toLowerCase()}`, message: comment || `Your goal was ${action.toLowerCase()}.` } });
  }
  return ok({ updated });
}
