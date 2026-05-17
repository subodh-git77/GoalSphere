import { prisma } from '@/lib/prisma'; import { ok, requireRole } from '@/lib/api-helpers';
export async function GET(){ const r=await requireRole(['ADMIN']); if(r.error) return r.error; return ok(await prisma.auditLog.findMany({include:{actor:true},orderBy:{timestamp:'desc'},take:200})); }
