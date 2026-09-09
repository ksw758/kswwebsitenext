'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * AI가 결과 데이터를 만드는 동안 보여주는 대기 화면 (토스 로딩 화면풍).
 * 중앙 캔버스 애니메이션: 문서 시트 + 줄이 채워지는 루프 + 스캔 빔 + 숨쉬는 글로우 + 진행 링.
 * - progress 를 넘기면 그 값(0~1)으로 링 표시, 생략하면 ~0.94 까지 자동으로 차오르며 대기.
 * - prefers-reduced-motion 이면 장식 모션(빔·글로우·펄스) 생략, 링만 부드럽게.
 */

const DEFAULT_MESSAGES = [
    '설문 내용을 정리하고 있어요',
    'WBS일정을 만들고 있어요',
    '예상 비용을 계산하고 있어요',
    'DB 스키마를 설계하고 있어요',
    '결과를 다듬고 있어요',
];

type ProcessingProps = {
    messages?: string[];
    /** 0~1. 주면 그 값으로 진행, 생략하면 자동 램프 */
    progress?: number;
    headline?: string;
};

const CSS = `
@keyframes svp-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.svp-msg{animation:svp-fade .3s linear both}
@media (prefers-reduced-motion:reduce){.svp-msg{animation:none}}
`;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rad = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
}

const isReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Processing({
    messages = DEFAULT_MESSAGES,
    progress,
    headline = '필요한 결과들을 수집하는 중입니다.',
}: ProcessingProps) {
    const [msgIdx, setMsgIdx] = useState(0);
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progRef = useRef(0);
    const targetRef = useRef(0);
    const rafRef = useRef(0);
    const propProgress = useRef<number | undefined>(progress);

    useEffect(() => {
        propProgress.current = progress;
    }, [progress]);

    // 상태 메시지 순환
    useEffect(() => {
        const id = window.setInterval(
            () => setMsgIdx((i) => (i + 1) % messages.length),
            1900,
        );
        return () => window.clearInterval(id);
    }, [messages.length]);

    // 캔버스
    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !wrap || !ctx) return;
        const t0 = performance.now();

        const frame = (now: number) => {
            const t = now - t0;
            const still = isReduced();
            const dpr = window.devicePixelRatio || 1;
            const w = wrap.clientWidth;
            const h = wrap.clientHeight;
            if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
                canvas.width = Math.round(w * dpr);
                canvas.height = Math.round(h * dpr);
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            // 진행값
            const pp = propProgress.current;
            if (typeof pp === 'number') targetRef.current = Math.max(0, Math.min(1, pp));
            else targetRef.current += (0.94 - targetRef.current) * 0.0018;
            progRef.current += (targetRef.current - progRef.current) * 0.08;
            const prog = progRef.current;

            const cx = w / 2;
            const cy = h / 2;
            const SW = Math.max(150, Math.min(200, w * 0.46));
            const SH = SW * 1.26;
            const sx = cx - SW / 2;
            const sy = cy - SH / 2;

            // 숨쉬는 글로우
            const pulse = still ? 0.1 : 0.09 + 0.05 * (0.5 + 0.5 * Math.sin(t / 700));
            const gr = SW * (still ? 1 : 1 + 0.05 * Math.sin(t / 700)) * 1.4;
            const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
            rg.addColorStop(0, `rgba(49,130,246,${pulse})`);
            rg.addColorStop(1, 'rgba(49,130,246,0)');
            ctx.fillStyle = rg;
            ctx.fillRect(cx - gr, cy - gr, gr * 2, gr * 2);

            // 시트 카드
            ctx.save();
            ctx.shadowColor = 'rgba(20,40,80,0.14)';
            ctx.shadowBlur = 24;
            ctx.shadowOffsetY = 10;
            ctx.fillStyle = '#fff';
            rr(ctx, sx, sy, SW, SH, 16);
            ctx.fill();
            ctx.restore();

            // 내용 줄 (채워지는 루프)
            const pad = 20;
            const lx = sx + pad;
            const lw = SW - pad * 2;
            const rows = 5;
            for (let i = 0; i < rows; i++) {
                const ly = sy + 28 + i * 22;
                rr(ctx, lx, ly, lw, 9, 4.5);
                ctx.fillStyle = '#EEF1F5';
                ctx.fill();
                let f = 1;
                if (!still) {
                    const c = (t / 1400 + i * 0.16) % 1.7;
                    f = c < 1 ? c : c < 1.35 ? 1 : Math.max(0, 1 - (c - 1.35) / 0.35);
                    f = Math.max(0, Math.min(1, f));
                }
                const fw = lw * (i === rows - 1 ? 0.6 : 1) * f;
                if (fw > 1) {
                    rr(ctx, lx, ly, fw, 9, 4.5);
                    ctx.fillStyle = '#CFDEF6';
                    ctx.fill();
                }
            }

            // 스캔 빔
            if (!still) {
                const by = sy + ((t / 1700) % 1) * SH;
                ctx.save();
                rr(ctx, sx, sy, SW, SH, 16);
                ctx.clip();
                const bg = ctx.createLinearGradient(0, by - 40, 0, by + 6);
                bg.addColorStop(0, 'rgba(49,130,246,0)');
                bg.addColorStop(1, 'rgba(49,130,246,0.16)');
                ctx.fillStyle = bg;
                ctx.fillRect(sx, by - 40, SW, 46);
                ctx.fillStyle = 'rgba(49,130,246,0.5)';
                ctx.fillRect(sx, by, SW, 1.5);
                ctx.restore();
            }

            // 진행 링
            const R = SW * 0.86;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#E9EEF5';
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.stroke();
            const a0 = -Math.PI / 2;
            const a1 = a0 + Math.PI * 2 * Math.max(0.001, prog);
            ctx.strokeStyle = '#3182F6';
            ctx.beginPath();
            ctx.arc(cx, cy, R, a0, a1);
            ctx.stroke();
            const dx = cx + Math.cos(a1) * R;
            const dy = cy + Math.sin(a1) * R;
            if (!still) {
                ctx.beginPath();
                ctx.arc(dx, dy, 9 + 3 * Math.sin(t / 250), 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(49,130,246,0.18)';
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(dx, dy, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#3182F6';
            ctx.fill();

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div
            style={{
                minHeight: '100dvh',
                maxWidth: 560,
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <style>{CSS}</style>
            <div style={{ paddingTop: '14vh' }}>
                <h1
                    style={{
                        margin: 0,
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.4,
                        color: '#191F28',
                        wordBreak: 'keep-all',
                    }}
                >
                    {headline}
                </h1>
                <p
                    key={msgIdx}
                    className="svp-msg"
                    aria-live="polite"
                    style={{ margin: '10px 0 0', fontSize: 15, color: '#8B95A1', minHeight: 22 }}
                >
                    {messages[msgIdx] ?? messages[0]}
                </p>
            </div>

            <div ref={wrapRef} style={{ flex: 1, position: 'relative', minHeight: 280 }}>
                <canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
}
