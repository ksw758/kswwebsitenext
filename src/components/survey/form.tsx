'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Questions, toChoice, type Answers, type QuestionType } from './const';
import { FORM_COLORS, FxButton, FxGauge, FxOption, FxTags, FxTextInput } from './formFx';
import Processing from './processing';

const { INK, MUTED } = FORM_COLORS;
const FADE = 210; // ms — 질문 전환 페이드

// TODO: 테스트용. true 면 제출 시 API 호출 없이 10초 Processing 후 결과(MOCK)로 이동.
//       실제 OpenAI 연동 확인 시 false 로.
const MOCK_SUBMIT = true;
const MOCK_PROCESSING_MS = 10_000;

const visibleFor = (a: Answers): QuestionType[] => Questions.filter((q) => !q.showIf || q.showIf(a));

const Form = () => {
    const router = useRouter();
    const [answers, setAnswers] = useState<Answers>({});
    const [step, setStep] = useState(0);
    const [phase, setPhase] = useState<'in' | 'out'>('in');
    const [submitting, setSubmitting] = useState(false);
    const [stage, setStage] = useState<'form' | 'processing' | 'error'>('form');
    const busy = useRef(false);
    const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const visible = useMemo(() => visibleFor(answers), [answers]);
    const total = visible.length;
    const idx = Math.min(step, Math.max(0, total - 1));
    const q = visible[idx];

    useEffect(
        () => () => {
            if (advanceTimer.current) clearTimeout(advanceTimer.current);
        },
        [],
    );

    if (stage === 'processing') return <Processing />;
    if (stage === 'error') {
        return (
            <div
                style={{
                    maxWidth: 460,
                    margin: '0 auto',
                    minHeight: '100dvh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 14,
                    padding: '0 24px',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: INK }}>
                    결과를 만들지 못했어요
                </h1>
                <p style={{ margin: 0, fontSize: 14, color: MUTED, lineHeight: 1.6 }}>
                    잠시 후 다시 시도해 주세요. 계속 안 되면 카카오톡으로 문의해 주세요.
                </p>
                <div style={{ marginTop: 8 }}>
                    <FxButton
                        onClick={() => {
                            setStage('form');
                            setPhase('in');
                            setSubmitting(false);
                            busy.current = false;
                        }}
                    >
                        다시 시도
                    </FxButton>
                </div>
            </div>
        );
    }

    if (!q) return null;

    const cur = answers[q.id];
    const curArr = Array.isArray(cur) ? cur : [];
    const curStr = typeof cur === 'string' ? cur : '';
    const isLast = idx >= total - 1;
    const min = q.min ?? 0;

    const progress = submitting ? 1 : total > 0 ? Math.min(1, (idx + 0.12) / total) : 0;

    // 답 반영 + 숨겨진 문항의 답 제거
    const commit = (next: Answers) => {
        const validIds = new Set(visibleFor(next).map((v) => v.id));
        const pruned: Answers = {};
        for (const k of Object.keys(next)) if (validIds.has(k)) pruned[k] = next[k];
        setAnswers(pruned);
    };

    // 페이드 아웃 → step 변경 → 페이드 인
    const go = (compute: (s: number) => number) => {
        if (busy.current) return;
        const cap = total;
        busy.current = true;
        setPhase('out');
        window.setTimeout(() => {
            setStep((s) => Math.max(0, Math.min(compute(s), cap - 1)));
            setPhase('in');
            busy.current = false;
        }, FADE);
    };

    const submitFlow = async () => {
        if (busy.current) return;
        busy.current = true;
        setPhase('out');
        setSubmitting(true); // 게이지 100%

        try {
            sessionStorage.setItem('survey:answers', JSON.stringify(answers));
        } catch {
            /* 접근 불가 환경 무시 */
        }

        // 폼 페이드아웃 후 대기(Processing) 화면으로
        window.setTimeout(() => setStage('processing'), FADE);

        if (MOCK_SUBMIT) {
            // API 호출 없이 10초 Processing 노출 후 결과(MOCK)로 이동
            try {
                sessionStorage.removeItem('survey:result'); // MOCK 폴백 강제
            } catch {
                /* 무시 */
            }
            window.setTimeout(() => router.push('/survey/result'), MOCK_PROCESSING_MS);
            return;
        }

        try {
            const res = await fetch('/api/v1/estimate/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            try {
                sessionStorage.setItem('survey:result', JSON.stringify(data));
            } catch {
                /* 무시 */
            }
            // Processing 은 응답이 올 때까지 노출됨 (서버 생성 시간이 곧 대기 시간)
            router.push('/survey/result');
        } catch {
            setStage('error');
            setPhase('in');
            busy.current = false;
        }
    };

    const goNext = () => (isLast ? submitFlow() : go((s) => s + 1));
    const goBack = () => go((s) => s - 1);

    const pickSingle = (val: string) => {
        commit({ ...answers, [q.id]: val });
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => {
            if (isLast) submitFlow();
            else go((s) => s + 1);
        }, 430); // 선택 스윕 보고 넘어감
    };
    const toggleMulti = (val: string) => {
        const s = new Set(curArr);
        if (s.has(val)) s.delete(val);
        else s.add(val);
        commit({ ...answers, [q.id]: [...s] });
    };

    const canProceed =
        q.type === 'single'
            ? typeof cur === 'string'
            : q.type === 'multi'
              ? curArr.length >= Math.max(1, min)
              : q.type === 'tags'
                ? curArr.length >= Math.max(1, min)
                : curStr.trim().length > 0;

    return (
        <div
            style={{
                maxWidth: 560,
                margin: '0 auto',
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                padding: '18px 20px 32px',
            }}
        >
            {/* 상단: 뒤로 + 게이지 (페이드 안 함) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                    type="button"
                    onClick={goBack}
                    disabled={idx === 0}
                    aria-label="이전 질문"
                    style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: idx === 0 ? 'default' : 'pointer',
                        color: idx === 0 ? '#CDD3DA' : INK,
                        fontSize: 24,
                        lineHeight: 1,
                        padding: 4,
                    }}
                >
                    ‹
                </button>
                <FxGauge value={progress} />
                <span style={{ fontSize: 12, color: MUTED, minWidth: 40, textAlign: 'right' }}>
                    {Math.min(idx + 1, total)} / {total}
                </span>
            </div>

            {/* 질문 영역 — 전환 시 페이드 */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: phase === 'in' ? 1 : 0,
                    transform: phase === 'in' ? 'none' : 'translateY(6px)',
                    transition: `opacity ${FADE}ms linear, transform ${FADE}ms linear`,
                    pointerEvents: phase === 'in' ? 'auto' : 'none',
                }}
            >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 44 }}>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: 24,
                            fontWeight: 700,
                            lineHeight: 1.42,
                            letterSpacing: '-0.02em',
                            color: INK,
                            wordBreak: 'keep-all',
                        }}
                    >
                        {q.title}
                    </h1>

                    <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {(q.type === 'single' || q.type === 'multi') &&
                            q.choices?.map((c) => {
                                const ch = toChoice(c);
                                const on =
                                    q.type === 'single' ? cur === ch.value : curArr.includes(ch.value);
                                return (
                                    <FxOption
                                        key={ch.value}
                                        label={ch.label}
                                        desc={ch.desc}
                                        selected={on}
                                        multi={q.type === 'multi'}
                                        onToggle={() =>
                                            q.type === 'single'
                                                ? pickSingle(ch.value)
                                                : toggleMulti(ch.value)
                                        }
                                    />
                                );
                            })}

                        {(q.type === 'text' || q.type === 'number') && (
                            <FxTextInput
                                value={curStr}
                                onChange={(v) => commit({ ...answers, [q.id]: v })}
                                onEnter={() => canProceed && goNext()}
                                placeholder={q.placeholder}
                                numeric={q.type === 'number'}
                            />
                        )}

                        {q.type === 'tags' && (
                            <>
                                <FxTags
                                    value={curArr}
                                    onChange={(v) => commit({ ...answers, [q.id]: v })}
                                    placeholder={q.placeholder}
                                />
                                <p style={{ margin: '4px 2px 0', fontSize: 12, color: MUTED }}>
                                    {curArr.length}개 입력 · 최소 {Math.max(1, min)}개
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* 하단 액션 — single 은 선택 시 자동 진행이라 버튼 없음 */}
                {q.type !== 'single' && (
                    <div style={{ marginTop: 24 }}>
                        <FxButton onClick={goNext} disabled={!canProceed}>
                            {isLast ? '완료하고 결과 보기' : '다음'}
                        </FxButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;
