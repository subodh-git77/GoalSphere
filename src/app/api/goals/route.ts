import { prisma } from '@/lib/prisma';
import { goalSchema } from '@/lib/validations/goal';
import { ok, requireRole } from '@/lib/api-helpers';
import { goalListInclude, goalWhereForRole } from '@/lib/queries';

export async function GET(req: Request) {
  const r = await requireRole(['EMPLOYEE', 'MANAGER', 'ADMIN']);
  if (r.error) return r.error;
  const role = (r.session!.user as any).role;
  const userId = (r.session!.user as any).id;
  const url = new URL(req.url);
  const take = Math.min(Number(url.searchParams.get('take') || 100), 200);
  return ok(await prisma.goal.findMany({ where: goalWhereForRole(role, userId), include: goalListInclude, orderBy: { updatedAt: 'desc' }, take }));
}

export async function POST(req: Request) {
  const r = await requireRole(['EMPLOYEE', 'MANAGER', 'ADMIN']);
  if (r.error) return r.error;
  const body = await req.json();
  const parsed = goalSchema.safeParse(body);
  if (!parsed.success) return ok({ error: parsed.error.flatten() }, 400);

  const actorId = (r.session!.user as any).id;
  const role = (r.session!.user as any).role;
  const userId = role === 'ADMIN' || role === 'MANAGER' ? body.userId ?? actorId : actorId;

  const existing = await prisma.goal.findMany({ where: { userId, submissionStatus: { in: ['DRAFT', 'RETURNED', 'REJECTED'] } }, select: { id: true, weightage: true, locked: true } });
  if (existing.length >= 8) return ok({ error: 'Maximum 8 goals allowed' }, 400);
  if (existing.some((g) => g.locked)) return ok({ error: 'Locked goal sheet cannot be edited. Ask Admin to unlock.' }, 403);
  const nextTotal = existing.reduce((sum, g) => sum + g.weightage, 0) + parsed.data.weightage;
  if (nextTotal > 100) return ok({ error: `Total weightage cannot exceed 100%. Current total will become ${nextTotal}%.` }, 400);

  const goal = await prisma.goal.create({ data: { ...parsed.data, userId, createdBy: actorId } });
  await prisma.auditLog.create({ data: { entityType: 'Goal', entityId: goal.id, action: 'CREATE', newValue: goal as any, changedBy: actorId } });
  return ok(goal, 201);
}
