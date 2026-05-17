import { prisma } from '@/lib/prisma';
import type { Role } from '@prisma/client';

export function goalWhereForRole(role: Role | string, userId: string) {
  if (role === 'EMPLOYEE') return { userId };
  if (role === 'MANAGER') return { user: { managerId: userId } };
  return {};
}

export const goalListInclude = {
  user: { select: { id: true, name: true, email: true, department: true, designation: true, managerId: true } },
  checkins: { orderBy: { checkinDate: 'desc' as const }, take: 1 },
};

export async function getScopedGoals(role: Role | string, userId: string, limit = 120) {
  return prisma.goal.findMany({
    where: goalWhereForRole(role, userId),
    include: goalListInclude,
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
}
