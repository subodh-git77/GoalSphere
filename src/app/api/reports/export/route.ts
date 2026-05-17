import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-helpers';
import { goalWhereForRole } from '@/lib/queries';
import ExcelJS from 'exceljs';

export async function GET(req: Request) {
  const r = await requireRole(['ADMIN', 'MANAGER']);
  if (r.error) return r.error;
  const role = (r.session!.user as any).role;
  const userId = (r.session!.user as any).id;
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'csv';
  const goals = await prisma.goal.findMany({ where: goalWhereForRole(role, userId), include: { user: true, checkins: { orderBy: { checkinDate: 'desc' }, take: 1 } }, orderBy: { updatedAt: 'desc' }, take: 1000 });
  const rows = goals.map((g) => ({ Employee: g.user.name, Department: g.user.department, ThrustArea: g.thrustArea, Goal: g.title, UoM: g.uomType, Target: g.targetValue, Actual: g.actualValue || '', Weightage: g.weightage, Status: g.status, Submission: g.submissionStatus, Approval: g.approvalStatus, Progress: g.checkins[0]?.progressScore ?? 0 }));
  if (format === 'xlsx') {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Achievement Report');
    ws.columns = Object.keys(rows[0] || { Employee: '' }).map((k) => ({ header: k, key: k, width: 22 }));
    ws.addRows(rows);
    ws.getRow(1).font = { bold: true };
    const buf = await wb.xlsx.writeBuffer();
    return new Response(buf, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="goalsphere-report.xlsx"' } });
  }
  const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map((r) => Object.values(r).map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="goalsphere-report.csv"' } });
}
