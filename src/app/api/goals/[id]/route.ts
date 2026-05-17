import { prisma } from '@/lib/prisma';
import { goalSchema, validateGoalSet } from '@/lib/validations/goal';
import { ok, requireRole } from '@/lib/api-helpers';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const r = await requireRole(['EMPLOYEE', 'MANAGER', 'ADMIN']);
  if (r.error) return r.error;
  const actorId = (r.session!.user as any).id;
  const role = (r.session!.user as any).role;
  const old = await prisma.goal.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!old) return ok({ error: 'Goal not found' }, 404);
  if (role === 'EMPLOYEE' && old.userId !== actorId) return ok({ error: 'You can update only your own goals.' }, 403);
  if (role === 'MANAGER' && old.user.managerId !== actorId) return ok({ error: 'Manager can update only direct report goals.' }, 403);
  if (old.locked && role !== 'ADMIN') return ok({ error: 'Locked goals can only be changed by Admin' }, 403);

  const body = await req.json();
  if (body.submit) {
    const goals = await prisma.goal.findMany({ where: { userId: old.userId }, select: { id: true, weightage: true } });
    const err = validateGoalSet(goals.map((g) => ({ weightage: g.id === old.id ? (body.weightage ?? g.weightage) : g.weightage })));
    if (err) return ok({ error: err }, 400);
  }

  const parsed = goalSchema.partial().safeParse(body);
  if (!parsed.success) return ok({ error: parsed.error.flatten() }, 400);
  if (old.sharedGoalId && role === 'EMPLOYEE') {
    delete (parsed.data as any).title;
    delete (parsed.data as any).targetValue;
    delete (parsed.data as any).thrustArea;
    delete (parsed.data as any).description;
  }

  const goal = await prisma.goal.update({
    where: { id: params.id },
    data: { ...parsed.data, submissionStatus: body.submit ? 'SUBMITTED' : undefined, approvalStatus: body.submit ? 'PENDING' : undefined },
  });
  await prisma.auditLog.create({ data: { entityType: 'Goal', entityId: goal.id, action: body.submit ? 'SUBMIT' : old.locked ? 'LOCKED_UPDATE' : 'UPDATE', oldValue: old as any, newValue: goal as any, changedBy: actorId } });
  return ok(goal);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const r = await requireRole(['EMPLOYEE', 'ADMIN']);
  if (r.error) return r.error;
  const actorId = (r.session!.user as any).id;
  const role = (r.session!.user as any).role;
  const goal = await prisma.goal.findUnique({ where: { id: params.id } });
  if (!goal) return ok({ error: 'Not found' }, 404);
  if (role === 'EMPLOYEE' && goal.userId !== actorId) return ok({ error: 'You can delete only your own goals.' }, 403);
  if (goal.locked && role !== 'ADMIN') return ok({ error: 'Cannot delete locked goal' }, 403);
  await prisma.goal.delete({ where: { id: params.id } });
  await prisma.auditLog.create({ data: { entityType: 'Goal', entityId: params.id, action: 'DELETE', oldValue: goal as any, changedBy: actorId } });
  return ok({ success: true });
}
