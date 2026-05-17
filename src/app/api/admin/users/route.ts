import { prisma } from '@/lib/prisma';
import { ok, requireRole } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userSchema = z.object({
  employeeId: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.enum(['EMPLOYEE', 'MANAGER', 'ADMIN']),
  department: z.string().min(2),
  designation: z.string().min(2),
  managerId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const r = await requireRole(['ADMIN', 'MANAGER']);
  if (r.error) return r.error;
  const role = (r.session!.user as any).role;
  const userId = (r.session!.user as any).id;
  return ok(await prisma.user.findMany({
    where: role === 'MANAGER' ? { OR: [{ managerId: userId }, { id: userId }] } : {},
    include: { manager: { select: { id: true, name: true, email: true } } },
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    take: 200,
  }));
}

export async function POST(req: Request) {
  const r = await requireRole(['ADMIN']);
  if (r.error) return r.error;
  const parsed = userSchema.safeParse(await req.json());
  if (!parsed.success) return ok({ error: parsed.error.flatten() }, 400);
  const password = await bcrypt.hash(parsed.data.password || 'Password@123', 10);
  const { password: _password, ...safeData } = parsed.data;
  const user = await prisma.user.create({ data: { ...safeData, password } });
  await prisma.auditLog.create({ data: { entityType: 'User', entityId: user.id, action: 'CREATE_USER', newValue: user as any, changedBy: (r.session!.user as any).id } });
  return ok(user, 201);
}
