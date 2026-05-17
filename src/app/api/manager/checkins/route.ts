import { prisma } from '@/lib/prisma';
import { ok, requireRole } from '@/lib/api-helpers';
import { checkinSchema } from '@/lib/validations/goal';
import { calculateProgressScore } from '@/lib/score';
import { goalListInclude, goalWhereForRole } from '@/lib/queries';

export async function POST(req: Request) {
  const r = await requireRole(['EMPLOYEE', 'MANAGER', 'ADMIN']);
  if (r.error) return r.error;
  const actorId = (r.session!.user as any).id;
  const role = (r.session!.user as any).role;
  const parsed = checkinSchema.safeParse(await req.json());
  if (!parsed.success) return ok({ error: parsed.error.flatten() }, 400);
  const goal = await prisma.goal.findUnique({ where: { id: parsed.data.goalId }, include: { user: true } });
  if (!goal) return ok({ error: 'Goal not found' }, 404);
  if (!goal.locked) return ok({ error: 'Only approved locked goals can be updated during check-ins.' }, 400);
  if (role === 'EMPLOYEE' && goal.userId !== actorId) return ok({ error: 'You can update only your own check-ins.' }, 403);
  if (role === 'MANAGER' && goal.user.managerId !== actorId) return ok({ error: 'Manager can update only direct report check-ins.' }, 403);

  const progressScore = calculateProgressScore(goal.uomType, goal.targetValue, parsed.data.actualAchievement);
  const checkin = await prisma.quarterlyCheckin.upsert({
    where: { goalId_quarter: { goalId: goal.id, quarter: parsed.data.quarter } },
    create: { ...parsed.data, plannedTarget: goal.targetValue, progressScore },
    update: { ...parsed.data, progressScore },
  });
  await prisma.goal.update({ where: { id: goal.id }, data: { actualValue: parsed.data.actualAchievement, status: parsed.data.status } });
  if (goal.sharedGoalId) await prisma.goal.updateMany({ where: { sharedGoalId: goal.sharedGoalId }, data: { actualValue: parsed.data.actualAchievement, status: parsed.data.status } });
  await prisma.auditLog.create({ data: { entityType: 'QuarterlyCheckin', entityId: checkin.id, action: 'UPSERT_CHECKIN', newValue: checkin as any, changedBy: actorId } });
  return ok(checkin);
}

export async function GET(req: Request) {
  const r = await requireRole(['EMPLOYEE', 'MANAGER', 'ADMIN']);
  if (r.error) return r.error;
  const role = (r.session!.user as any).role;
  const userId = (r.session!.user as any).id;
  const url = new URL(req.url);
  const take = Math.min(Number(url.searchParams.get('take') || 100), 200);
  return ok(await prisma.quarterlyCheckin.findMany({ where: { goal: goalWhereForRole(role, userId) }, include: { goal: { include: goalListInclude } }, orderBy: { checkinDate: 'desc' }, take }));
}
