/**
 * 설문 답변 → OpenAI 구조화 출력으로 견적·WBS·DB 스키마 생성.
 * 요청: POST { answers: Record<string, string | string[]> }
 * 응답: ResultData (resultTypes.ts) — result.tsx 가 그대로 렌더.
 * env: OPEN_AI_KEY 필요 (로컬은 .env.local, 배포는 Vercel 프로젝트 env).
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateText, Output } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { isSameOrigin } from '@/src/lib/guard';
import { checkRateLimit, clientIp } from '@/src/lib/rateLimit';
import { ResultSchema } from '@/src/components/survey/resultSchema';
import {
    answersToBrief,
    ESTIMATE_SYSTEM_PROMPT,
    PAST_PROJECTS_CONTEXT,
} from '@/src/components/survey/estimatePrompt';

// OpenAI 호출 여유 (기본은 배포 플랫폼 설정값)
export const maxDuration = 60;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const openai = createOpenAI({ apiKey: process.env.OPEN_AI_KEY });

export async function POST(req: NextRequest) {
    if (!isSameOrigin(req)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rl = checkRateLimit(`estimate:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS);
    if (!rl.ok) {
        return NextResponse.json(
            { error: '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.' },
            { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
        );
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }
    const answers = (body as { answers?: Record<string, unknown> } | null)?.answers;
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const brief = answersToBrief(answers as Record<string, string | string[]>);
    if (brief.length === 0) {
        return NextResponse.json({ error: '설문 답변이 비어 있습니다.' }, { status: 400 });
    }

    try {
        // AI SDK v6: generateObject 는 deprecated → generateText + Output.object
        const { output } = await generateText({
            model: openai('gpt-4o'),
            system: `${ESTIMATE_SYSTEM_PROMPT}\n\n${PAST_PROJECTS_CONTEXT}`,
            prompt: JSON.stringify({ survey: brief }, null, 2),
            output: Output.object({
                schema: ResultSchema,
                name: 'ProjectEstimate',
                description: '설문 기반 프로젝트 견적 · WBS · 범위 · 예상 DB 스키마',
            }),
            maxOutputTokens: 4000,
        });
        return NextResponse.json(output);
    } catch (e) {
        console.error('[estimate/generate]', e);
        return NextResponse.json({ error: '견적 생성에 실패했습니다.' }, { status: 500 });
    }
}
