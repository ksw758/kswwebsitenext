// 결과 데이터 스키마 — result.tsx(렌더) 와 /api/v1/estimate/generate(생성) 가 공유.
// 서버 라우트에서도 import 하므로 컴포넌트가 아닌 순수 타입 모듈로 분리.

export type Money = { label: string; amount: number };

export type ResultData = {
    // ── 무료 공개 ──
    headline: string;
    feasible: boolean;
    summary: string;
    outOfScope: string[];
    stack: { layer: string; choice: string }[];
    wbs: { phase: string; task: string; days: number }[];
    totalDays: number;
    includedByDefault: string[];
    assumptions: string[];
    versioning: string[];
    price: { low: number; high: number };
    monthlyNote: string;
    // ── 게이트 이후 (제출 후 blur 해제) ──
    breakdown: Money[];
    total: number;
    monthly: Money[];
    oneTime: Money[];
    schema: { table: string; columns: { name: string; type: string; note?: string }[] }[];
};
