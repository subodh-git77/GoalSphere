import { UomType } from '@prisma/client';
export function calculateProgressScore(uomType: UomType, targetValue: string, actualValue: string): number {
  const target = Number(targetValue); const actual = Number(actualValue);
  if (uomType === 'TIMELINE') { const targetDate = new Date(targetValue).getTime(); const actualDate = new Date(actualValue).getTime(); return actualDate <= targetDate ? 100 : Math.max(0, 100 - Math.ceil((actualDate-targetDate)/86400000)*2); }
  if (uomType === 'ZERO_BASED') return actual === 0 ? 100 : 0;
  if (!target || Number.isNaN(target) || Number.isNaN(actual)) return 0;
  if (uomType === 'NUMERIC_MAX') return Math.min(100, (target / Math.max(actual, 0.0001)) * 100);
  return Math.min(100, (actual / target) * 100);
}
