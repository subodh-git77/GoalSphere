import { calculateProgressScore } from '@/lib/score';
test('numeric min score',()=>{ expect(calculateProgressScore('NUMERIC_MIN' as any,'100','80')).toBe(80); });
test('numeric max score caps at 100',()=>{ expect(calculateProgressScore('NUMERIC_MAX' as any,'5','4')).toBe(100); });
test('zero score',()=>{ expect(calculateProgressScore('ZERO_BASED' as any,'0','0')).toBe(100); expect(calculateProgressScore('ZERO_BASED' as any,'0','1')).toBe(0); });
