import { z } from 'zod';
import type { ResultData } from './resultTypes';

/**
 * `ResultData`(resultTypes.ts) 를 미러링한 zod 스키마.
 * /api/v1/estimate/generate 에서 OpenAI 구조화 출력 검증에 사용 (서버 전용).
 * resultTypes.ts 는 client(result.tsx) 가 import 하므로 zod 를 섞지 않고 손수 타입 유지 —
 * 두 곳이 어긋나면 아래 `satisfies` 가 컴파일 에러를 낸다.
 */

const Money = z.object({
    label: z.string(),
    amount: z.number().int().describe('원(KRW) 단위 정수'),
});

const Column = z.object({
    name: z.string().describe('컬럼명 (snake_case)'),
    type: z.string().describe('타입 (uuid, varchar, int, timestamptz, enum 등)'),
    note: z.string().optional().describe('PK / FK → table / unique / enum 값 등'),
});

export const ResultSchema = z.object({
    // ── 무료 공개 ──
    headline: z
        .string()
        .describe('한 줄 요약. "OO 서비스 · 단계 · 약 N주 · 최소~최대 만원" 형식'),
    feasible: z.boolean().describe('원칙적으로 true. 불가한 부분은 outOfScope 로'),
    summary: z.string().describe('2~4문장, 고객이 읽는 톤의 개략 설명'),
    outOfScope: z.array(z.string()).describe('이번 범위 밖 · 별도 논의 항목 (2차 확장 등)'),
    stack: z.array(
        z.object({
            layer: z.string().describe('프론트엔드 / 백엔드 / 데이터베이스 / 인프라 / 배포'),
            choice: z.string(),
        }),
    ),
    wbs: z
        .array(
            z.object({
                phase: z.string().describe('단계명'),
                task: z.string().describe('주요 작업 요약'),
                days: z.number().int().describe('영업일 수'),
            }),
        )
        .describe('작업 분해 구조. 단계별 행'),
    totalDays: z.number().int().describe('wbs days 합계'),
    includedByDefault: z
        .array(z.string())
        .describe(
            '추가 비용 없이 기본 제공: 이메일+소셜 로그인, 이용약관·개인정보 처리방침, SSL, 메타 픽셀 등. 견적 항목에 이중 계산 금지',
        ),
    assumptions: z.array(z.string()).describe('견적 전제 (디자인 시안 제공 기준, MVP 범위 등)'),
    versioning: z.array(z.string()).describe('버전 관리 · 협업 방식'),
    price: z.object({
        low: z.number().int().describe('최소 예상 개발비(원), 10만원 단위 라운딩'),
        high: z.number().int().describe('최대 예상 개발비(원), 10만원 단위 라운딩'),
    }),
    monthlyNote: z.string().describe('"월 약 N원 · 초기 개발비와 별도" 형식'),
    // ── 게이트 이후 ──
    breakdown: z
        .array(Money)
        .describe('항목별 개발비 내역 (기획·프론트·백엔드·관리자·QA·변경 버퍼 등). 금액 10만원 단위'),
    total: z.number().int().describe('breakdown 합계(원), 10만원 단위 라운딩'),
    monthly: z.array(Money).describe('배포 후 월 운영비 (EC2, RDS, S3, AI API 등)'),
    oneTime: z
        .array(Money)
        .describe('1회성 비용 (도메인 1년 주기, 앱이면 Google Play·Apple Developer 등록비)'),
    schema: z
        .array(
            z.object({
                table: z.string(),
                columns: z.array(Column),
            }),
        )
        .describe('예상 DB 스키마. 핵심 테이블 3~6개'),
}) satisfies z.ZodType<ResultData>;
