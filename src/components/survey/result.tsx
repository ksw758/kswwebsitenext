'use client';

import React, { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import { Reveal, SectionFxProvider, useSectionReveal } from './sectionFx';
import type { Money, ResultData } from './resultTypes';

/**
 * 결과 화면 — 현재 전부 MOCK.
 * 제출(이름·이메일·전화·코멘트) 후 게이트 이후 섹션(견적 상세 · DB 스키마)이
 * 실제 GenerateResponse 데이터로 교체될 예정.
 *
 * 공개 경계
 *   1 가능여부·요약 / 2 기술스택 / 3 WBS·기간 / 4 범위관리 / 5 버전관리 / 6 견적 총액(범위)  → 무료
 *   ── 게이트: 이름·이메일·전화·코멘트 ──
 *   7 견적 상세 / 8 DB 스키마                                                              → 제출 후
 *
 * 레이아웃 참고 이미지: assets/WBS_Example.png, project_details.png,
 *                       db_schema_design_pattern_example.png, pricing.png
 */

const C = {
    ink: '#191F28',
    sub: '#4E5968',
    muted: '#8B95A1',
    line: '#E5E8EB',
    soft: '#F2F4F6',
    blue: '#3182F6',
    ok: '#12B886',
};

const won = (n: number) => n.toLocaleString('ko-KR') + '원';

// ───────────── MOCK (제출 후 실데이터로 교체) ─────────────
const MOCK: ResultData = {
    headline: 'Next.js 기반 예약 웹서비스 · MVP · 약 8주 · 800만 ~ 1,200만원',
    feasible: true,
    summary:
        '입력하신 내용은 충분히 구현 가능한 범위입니다. 예약·결제·관리자 페이지를 포함한 MVP를 먼저 완성하고, 실제 트래픽이 확인되면 알림·정산 등은 2차로 확장하는 방식을 권장드립니다.',
    outOfScope: [
        '실시간 채팅 상담 (2차 확장 권장)',
        '외부 정산 · 세금계산서 연동',
        '네이티브 앱 (현재는 반응형 웹 기준)',
    ],
    stack: [
        { layer: '프론트엔드', choice: 'Next.js (App Router) + TypeScript' },
        { layer: '백엔드', choice: 'Next.js Route Handlers / NestJS' },
        { layer: '데이터베이스', choice: 'PostgreSQL + Prisma' },
        { layer: '인프라', choice: 'AWS EC2 t3.small · RDS · S3' },
        { layer: '배포', choice: 'GitHub → CI → AWS' },
    ],
    wbs: [
        { phase: '기획 · 설계', task: '요구사항 정리, 화면 설계, DB 설계', days: 7 },
        { phase: 'UI 개발', task: '공통 컴포넌트, 예약 플로우, 마이페이지', days: 15 },
        { phase: '백엔드 · API', task: '인증, 예약 / 결제 API, 관리자 API', days: 14 },
        { phase: '관리자 페이지', task: '예약 관리, 회원 관리, 기본 통계', days: 7 },
        { phase: 'QA · 배포', task: '통합 테스트, 버그 수정, 배포 세팅', days: 7 },
    ],
    totalDays: 50,
    includedByDefault: [
        '회원가입 · 로그인 (이메일 + 소셜)',
        '이용약관 · 개인정보 처리방침 페이지',
        'SSL 인증서 세팅',
        '메타 픽셀 · GA 설치',
    ],
    assumptions: [
        '디자인 시안(Figma) 제공 기준 — 미제공 시 디자인 비용 별도',
        '결제는 PG사 1곳(토스페이먼츠 등) 연동 기준',
        '3rd party API 사용료(SMS · 지도 등)는 견적 미포함',
        'MVP 범위이며 대규모 트래픽 대응 · 고도화는 2차',
    ],
    versioning: [
        'Git(GitHub) · 브랜치 전략, PR 리뷰',
        '주 단위 진행 상황 공유 (WBS 기준)',
        '비상주 · 주말은 best effort 대응',
        '납품 전 자체 QA 후 인수인계',
    ],
    price: { low: 8_000_000, high: 12_000_000 },
    monthlyNote: '월 약 3.5만원 (인프라) · 초기 개발비와 별도',
    breakdown: [
        { label: '기획 · 설계', amount: 1_200_000 },
        { label: '프론트엔드 개발', amount: 3_600_000 },
        { label: '백엔드 · API', amount: 3_400_000 },
        { label: '관리자 페이지', amount: 1_500_000 },
        { label: 'QA · 배포 세팅', amount: 800_000 },
        { label: '변경 대응 버퍼 (15%)', amount: 1_600_000 },
    ],
    total: 12_100_000,
    monthly: [
        { label: 'AWS EC2 t3.small', amount: 22_000 },
        { label: 'AWS RDS (PostgreSQL, 최소 사양)', amount: 8_000 },
        { label: 'S3 · 트래픽', amount: 5_000 },
    ],
    oneTime: [
        { label: '도메인 (.com) — 1년 주기 갱신', amount: 20_000 },
        // 앱 개발 시: 구글 플레이 25 USD(1회), Apple Developer 99 USD/년 반드시 포함
    ],
    schema: [
        {
            table: 'users',
            columns: [
                { name: 'id', type: 'uuid', note: 'PK' },
                { name: 'email', type: 'varchar', note: 'unique' },
                { name: 'name', type: 'varchar' },
                { name: 'role', type: 'enum', note: 'user / admin' },
                { name: 'created_at', type: 'timestamptz' },
            ],
        },
        {
            table: 'reservations',
            columns: [
                { name: 'id', type: 'uuid', note: 'PK' },
                { name: 'user_id', type: 'uuid', note: 'FK → users' },
                { name: 'slot_id', type: 'uuid', note: 'FK → slots' },
                { name: 'status', type: 'enum', note: 'pending / paid / cancelled' },
                { name: 'amount', type: 'int' },
                { name: 'created_at', type: 'timestamptz' },
            ],
        },
        {
            table: 'slots',
            columns: [
                { name: 'id', type: 'uuid', note: 'PK' },
                { name: 'starts_at', type: 'timestamptz' },
                { name: 'capacity', type: 'int' },
                { name: 'booked', type: 'int' },
            ],
        },
        {
            table: 'payments',
            columns: [
                { name: 'id', type: 'uuid', note: 'PK' },
                { name: 'reservation_id', type: 'uuid', note: 'FK → reservations' },
                { name: 'pg_tid', type: 'varchar' },
                { name: 'status', type: 'enum' },
                { name: 'paid_at', type: 'timestamptz' },
            ],
        },
    ],
};

// ───────────── 공통 UI ─────────────
const Section: React.FC<{ title: string; hint?: string; children: React.ReactNode }> = ({
    title,
    hint,
    children,
}) => {
    const { ref, className } = useSectionReveal<HTMLElement>();
    return (
        <section
            ref={ref}
            className={className}
            style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}
        >
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.ink }}>{title}</h2>
            {hint && <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>{hint}</p>}
            <div style={{ marginTop: 14 }}>{children}</div>
        </section>
    );
};

const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((s) => (
            <li key={s} style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.5 }}>
                {s}
            </li>
        ))}
    </ul>
);

const td: React.CSSProperties = {
    padding: '10px 12px',
    fontSize: 13,
    color: C.sub,
    borderTop: `1px solid ${C.line}`,
    verticalAlign: 'top',
};

const MoneyTable: React.FC<{ rows: Money[]; suffix?: string }> = ({ rows, suffix = '' }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
            {rows.map((r) => (
                <tr key={r.label}>
                    <td style={td}>{r.label}</td>
                    <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {won(r.amount)}
                        {suffix}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const Result = () => {
    const isMobile = useIsMobile();

    // 설문 제출 시 저장된 결과를 읽는다. SSR/hydration 안전하게 useSyncExternalStore 로.
    // 서버: null → MOCK. 클라이언트: sessionStorage 값 → 파싱, 누락 필드는 MOCK 폴백.
    const rawResult = useSyncExternalStore(
        () => () => {},
        () => {
            try {
                return sessionStorage.getItem('survey:result');
            } catch {
                return null;
            }
        },
        () => null,
    );
    const data = useMemo<ResultData>(() => {
        if (!rawResult) return MOCK;
        try {
            return { ...MOCK, ...(JSON.parse(rawResult) as Partial<ResultData>) };
        } catch {
            return MOCK;
        }
    }, [rawResult]);
    const [unlocked, setUnlocked] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', email: '', comment: '', agree: false });
    const gatedRef = useRef<HTMLDivElement>(null);

    const canSubmit = !!form.name && !!form.phone && !!form.email && form.agree;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        // MOCK: 실제로는 POST /api/v1/... 로 리드 저장 + trackLead,
        //       응답의 GenerateResponse 로 setData 후 unlock.
        setUnlocked(true);
        requestAnimationFrame(() =>
            gatedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        );
    };

    const set =
        (k: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, [k]: e.target.value }));

    const input: React.CSSProperties = {
        width: '100%',
        boxSizing: 'border-box',
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: '12px 14px',
        fontSize: 14,
        color: C.ink,
        outline: 'none',
        background: '#fff',
    };

    return (
        <SectionFxProvider>
        <div
            style={{
                maxWidth: 760,
                margin: '0 auto',
                padding: isMobile ? '32px 16px 72px' : '48px 24px 96px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
            }}
        >
            {/* TL;DR */}
            <Reveal
                style={{
                    background: C.ink,
                    color: '#fff',
                    borderRadius: 16,
                    padding: isMobile ? '20px 18px' : '26px 24px',
                }}
            >
                <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.04em', color: '#9DA7B3' }}>예상 결과</p>
                <p style={{ margin: '8px 0 0', fontSize: isMobile ? 17 : 20, fontWeight: 700, lineHeight: 1.45 }}>
                    {data.headline}
                </p>
            </Reveal>

            {/* 1. 가능여부 + 요약 — 입력 사항 개략 설명, 기본적으로 가능하다고 안내 */}
            <Section title="구현 가능 여부">
                {data.feasible && (
                    <span
                        style={{
                            display: 'inline-block',
                            background: `${C.ok}1A`,
                            color: C.ok,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 999,
                        }}
                    >
                        구현 가능
                    </span>
                )}
                <p style={{ margin: '12px 0 0', fontSize: 14, color: C.sub, lineHeight: 1.7 }}>{data.summary}</p>
                <p style={{ margin: '14px 0 6px', fontSize: 13, fontWeight: 700, color: C.ink }}>
                    이번 범위 밖 (별도 논의)
                </p>
                <Bullets items={data.outOfScope} />
            </Section>

            {/* 2. 기술 스택 */}
            <Section title="추천 기술 스택">
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8 }}>
                    {data.stack.map((s) => (
                        <div key={s.layer} style={{ background: C.soft, borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ fontSize: 11, color: C.muted }}>{s.layer}</div>
                            <div style={{ fontSize: 13, color: C.ink, fontWeight: 600, marginTop: 2 }}>{s.choice}</div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 3. WBS — 테이블 형태 (WBS_Example.png 참고) */}
            <Section
                title="WBS · 작업 분해"
                hint={`예상 총 개발 기간 약 ${data.totalDays}일 (약 ${Math.round(data.totalDays / 5)}주)`}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                        <thead>
                            <tr>
                                {['단계', '주요 작업', '기간'].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: '0 12px 8px',
                                            fontSize: 11,
                                            color: C.muted,
                                            textAlign: h === '기간' ? 'right' : 'left',
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.wbs.map((r) => (
                                <tr key={r.phase}>
                                    <td style={{ ...td, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap' }}>{r.phase}</td>
                                    <td style={td}>{r.task}</td>
                                    <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>{r.days}일</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            {/* 4. 프로젝트 범위 관리 (project_details.png 참고) */}
            <Section title="프로젝트 범위">
                <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: C.ink }}>
                    기본 포함 (추가 비용 없음)
                </p>
                <div style={{ marginBottom: 14 }}>
                    <Bullets items={data.includedByDefault} />
                </div>
                <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: C.ink }}>견적 전제</p>
                <Bullets items={data.assumptions} />
            </Section>

            {/* 5. 버전 관리 · 협업 */}
            <Section title="버전 관리 · 협업 방식">
                <Bullets items={data.versioning} />
            </Section>

            {/* 6. 견적 티저 (pricing.png 참고) */}
            <Section title="예상 견적" hint="항목별 상세 내역은 아래에서 확인하실 수 있어요">
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color: C.ink }}>
                    약 {won(data.price.low)} ~ {won(data.price.high)}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: C.sub }}>{data.monthlyNote}</div>
            </Section>

            {/* ── 게이트 폼 ── */}
            <Reveal>
            <form
                onSubmit={onSubmit}
                style={{
                    background: '#fff',
                    border: `2px solid ${C.blue}`,
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}
            >
                <div>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.ink }}>상세 견적 · DB 스키마 열어보기</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.sub }}>
                        연락처를 남기시면 항목별 견적과 예상 DB 스키마가 열리고, 검토 후 연락드려요.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexDirection: isMobile ? 'column' : 'row' }}>
                    <input style={input} placeholder="이름" value={form.name} onChange={set('name')} />
                    <input style={input} placeholder="전화번호" value={form.phone} onChange={set('phone')} />
                </div>
                <input style={input} type="email" placeholder="이메일" value={form.email} onChange={set('email')} />
                <textarea
                    style={{ ...input, minHeight: 72, resize: 'vertical' }}
                    placeholder="짧은 코멘트 (선택)"
                    value={form.comment}
                    onChange={set('comment')}
                />
                <label
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.sub, cursor: 'pointer' }}
                >
                    <input
                        type="checkbox"
                        checked={form.agree}
                        onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: C.blue }}
                    />
                    개인정보 수집 · 이용에 동의합니다 (견적 안내 목적, 처리 후 파기)
                </label>
                <button
                    type="submit"
                    disabled={!canSubmit || unlocked}
                    style={{
                        border: 'none',
                        borderRadius: 12,
                        padding: '14px 20px',
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#fff',
                        background: !canSubmit || unlocked ? '#C7D0DA' : C.blue,
                        cursor: !canSubmit || unlocked ? 'default' : 'pointer',
                    }}
                >
                    {unlocked ? '열림 ✓' : '제출하고 상세 결과 보기'}
                </button>
            </form>
            </Reveal>

            {/* ── 게이트 이후 (제출 전 blur) ── */}
            <div ref={gatedRef} style={{ position: 'relative' }}>
                <div
                    aria-hidden={!unlocked}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                        filter: unlocked ? 'none' : 'blur(9px)',
                        pointerEvents: unlocked ? 'auto' : 'none',
                        userSelect: unlocked ? 'auto' : 'none',
                        transition: 'filter .45s ease',
                    }}
                >
                    {/* 7. 견적 상세 */}
                    <Section title="견적 상세">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {data.breakdown.map((r) => (
                                    <tr key={r.label}>
                                        <td style={td}>{r.label}</td>
                                        <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>{won(r.amount)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td style={{ ...td, fontWeight: 800, color: C.ink }}>총 예상 견적</td>
                                    <td style={{ ...td, fontWeight: 800, color: C.ink, textAlign: 'right' }}>{won(data.total)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p style={{ margin: '16px 0 6px', fontSize: 13, fontWeight: 700, color: C.ink }}>
                            월 운영비 (배포 후)
                        </p>
                        <MoneyTable rows={data.monthly} suffix=" / 월" />

                        <p style={{ margin: '16px 0 6px', fontSize: 13, fontWeight: 700, color: C.ink }}>1회성 비용</p>
                        <MoneyTable rows={data.oneTime} />

                        <p style={{ margin: '16px 0 0', fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                            AI가 생성한 개략 견적입니다. 실제 계약 금액은 상담 후 확정되며, 요구사항 변동에 따라 달라질 수 있습니다.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                /* TODO: jspdf 로 견적서 PDF 생성 */
                            }}
                            style={{
                                marginTop: 14,
                                border: `1px solid ${C.line}`,
                                borderRadius: 10,
                                padding: '10px 16px',
                                fontSize: 13,
                                fontWeight: 600,
                                color: C.sub,
                                background: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            견적서 PDF 받기
                        </button>
                    </Section>

                    {/* 8. DB 스키마 (db_schema_design_pattern_example.png 참고) */}
                    <Section title="예상 DB 스키마">
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
                            {data.schema.map((t) => (
                                <div key={t.table} style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'hidden' }}>
                                    <div style={{ background: C.soft, padding: '8px 12px', fontSize: 13, fontWeight: 700, color: C.ink }}>
                                        {t.table}
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            {t.columns.map((col) => (
                                                <tr key={col.name}>
                                                    <td style={{ ...td, fontFamily: 'ui-monospace, monospace', color: C.ink }}>{col.name}</td>
                                                    <td style={{ ...td, color: C.muted }}>{col.type}</td>
                                                    <td style={{ ...td, fontSize: 11, color: C.muted }}>{col.note ?? ''}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {!unlocked && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingTop: 56,
                        }}
                    >
                        <div
                            style={{
                                background: '#fff',
                                border: `1px solid ${C.line}`,
                                borderRadius: 12,
                                padding: '14px 18px',
                                fontSize: 13,
                                color: C.sub,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                            }}
                        >
                            🔒 위 폼을 제출하면 열려요
                        </div>
                    </div>
                )}
            </div>

            {/* 다음 단계 (항상 노출) */}
            <Section title="다음 단계">
                <p style={{ margin: 0, fontSize: 13.5, color: C.sub, lineHeight: 1.7 }}>
                    제출해 주시면 상원(SW)에이전츠에서 24~48시간 내 검토 후 연락드립니다. 급하시면 카카오톡으로 바로
                    상담하실 수 있어요.
                </p>
                <a
                    href="https://open.kakao.com/o/st6GX9wi"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        marginTop: 12,
                        background: '#FEE500',
                        color: '#191600',
                        fontSize: 13,
                        fontWeight: 700,
                        padding: '10px 18px',
                        borderRadius: 10,
                        textDecoration: 'none',
                    }}
                >
                    카카오톡 상담하기
                </a>
            </Section>
        </div>
        </SectionFxProvider>
    );
};

export default Result;
