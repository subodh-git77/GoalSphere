import { prisma } from '@/lib/prisma';
import { ok, requireRole } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const r = await requireRole(['ADMIN']);
  if (r.error) return r.error;
  const body = await req.json();
  const old = await prisma.user.findUnique({ where: { id: params.id } });
  if (!old) return ok({ error: 'User not found' }, 404);
  const { password, ...data } = body;
  const updateData: any = { ...data };
  if (password) updateData.password = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({ where: { id: params.id }, data: updateData });
  await prisma.auditLog.create({ data: { entityType: 'User', entityId: user.id, action: 'UPDATE_USER', oldValue: old as any, newValue: user as any, changedBy: (r.session!.user as any).id } });
  return ok(user);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const r = await requireRole(['ADMIN']);
  if (r.error) return r.error;
  const old = await prisma.user.findUnique({ where: { id: params.id } });
  if (!old) return ok({ error: 'User not found' }, 404);
  const user = await prisma.user.update({ where: { id: params.id }, data: { isActive: false } });
  await prisma.auditLog.create({ data: { entityType: 'User', entityId: user.id, action: 'DISABLE_USER', oldValue: old as any, newValue: user as any, changedBy: (r.session!.user as any).id } });
  return ok(user);
}
