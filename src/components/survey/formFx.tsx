'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 설문 폼 전용 canvas 이펙트 컴포넌트 (토스풍 — 테두리 대신 배경색·텍스트색으로 구분).
 *  - FxGauge   : 진행 게이지 (흐르는 하이라이트 + 스프링 채움)
 *  - FxOption  : 선택지(select) — 선택 시 좌→우 스윕, hover 글로우 / 상태는 bg·text 색으로
 *  - FxButton  : 버튼(파랑) — 프레스 리플 + hover 셰머
 *  - FxTextInput / FxTags : 입력(회색 필드→흰색) — 포커스 시 링 펄스 + 하단 글로우
 * 지속 표시는 DOM(CSS), canvas 는 전이 이펙트만 → 끝나면 RAF 정지.
 * prefers-reduced-motion 이면 canvas 이펙트 생략.
 */

const BLUE = '#3182F6';
const INK = '#191F28';
const SUB = '#4E5968';
const MUTED = '#8B95A1';
const TRACK = '#E5E8EB';
const FIELD = '#F2F4F6';
const FIELD_FOCUS = '#FFFFFF';
const SEL_BG = '#E8F3FF';
const DISABLED_BG = '#EDEFF3';
const DISABLED_TX = '#AEB6C1';

let _reduced: boolean | null = null;
const reduced = () => {
    if (_reduced === null) {
        _reduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return _reduced;
};

const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

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

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => boolean;

function useCanvasOverlay<H extends HTMLElement = HTMLDivElement>(
    draw: DrawFn,
    opts?: { persist?: boolean },
) {
    const hostRef = useRef<H>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const raf = useRef(0);
    const drawRef = useRef(draw);
    useEffect(() => {
        drawRef.current = draw;
    });
    const persist = !!opts?.persist;

    const run = useCallback(() => {
        if (raf.current) return;
        const t0 = performance.now();
        const frame = () => {
            const host = hostRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!host || !canvas || !ctx) {
                raf.current = 0;
                return;
            }
            const dpr = window.devicePixelRatio || 1;
            const w = host.clientWidth;
            const h = host.clientHeight;
            const W = Math.round(w * dpr);
            const Hh = Math.round(h * dpr);
            if (canvas.width !== W || canvas.height !== Hh) {
                canvas.width = W;
                canvas.height = Hh;
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            const more = drawRef.current(ctx, w, h, performance.now() - t0);
            if (more) {
                raf.current = requestAnimationFrame(frame);
            } else {
                if (!persist) ctx.clearRect(0, 0, w, h);
                raf.current = 0;
            }
        };
        raf.current = requestAnimationFrame(frame);
    }, [persist]);

    useEffect(
        () => () => {
            if (raf.current) cancelAnimationFrame(raf.current);
        },
        [],
    );

    return { hostRef, canvasRef, run };
}

const overlay: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    borderRadius: 'inherit',
};

// ───────────────── Gauge ─────────────────
export const FxGauge: React.FC<{ value: number }> = ({ value }) => {
    const target = Math.max(0, Math.min(1, value));
    const targetRef = useRef(target);
    const cur = useRef(0);

    const { hostRef, canvasRef, run } = useCanvasOverlay<HTMLDivElement>(
        (ctx, w, h, t) => {
            const tg = targetRef.current;
            cur.current += (tg - cur.current) * 0.14;
            const settled = Math.abs(tg - cur.current) < 0.0015;
            if (settled) cur.current = tg;
            const p = cur.current;
            const r = h / 2;

            ctx.fillStyle = TRACK;
            rr(ctx, 0, 0, w, h, r);
            ctx.fill();

            if (p > 0.001) {
                const fw = Math.max(h, w * p);
                const grad = ctx.createLinearGradient(0, 0, fw, 0);
                grad.addColorStop(0, BLUE);
                grad.addColorStop(1, '#5B9BFF');
                ctx.fillStyle = grad;
                rr(ctx, 0, 0, fw, h, r);
                ctx.fill();

                if (!reduced()) {
                    ctx.save();
                    rr(ctx, 0, 0, fw, h, r);
                    ctx.clip();
                    const hx = ((t / 850) % 1) * (fw + 80) - 40;
                    const g2 = ctx.createLinearGradient(hx - 34, 0, hx + 34, 0);
                    g2.addColorStop(0, 'rgba(255,255,255,0)');
                    g2.addColorStop(0.5, 'rgba(255,255,255,0.55)');
                    g2.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = g2;
                    ctx.fillRect(hx - 34, 0, 68, h);
                    ctx.restore();

                    ctx.beginPath();
                    ctx.arc(fw, h / 2, h * 0.95, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(49,130,246,0.16)';
                    ctx.fill();
                }
            }

            const flowing = !reduced() && cur.current > 0.006 && cur.current < 0.994;
            return !settled || flowing;
        },
        { persist: true },
    );

    useEffect(() => {
        targetRef.current = target;
        run();
    }, [target, run]);

    return (
        <div ref={hostRef} style={{ position: 'relative', flex: 1, height: 6, borderRadius: 3 }}>
            <canvas ref={canvasRef} aria-hidden="true" style={overlay} />
        </div>
    );
};

// ───────────────── Option (select) ─────────────────
export const FxOption: React.FC<{
    label: string;
    desc?: string;
    selected: boolean;
    multi?: boolean;
    onToggle: () => void;
}> = ({ label, desc, selected, multi, onToggle }) => {
    const sweep = useRef(0);
    const hover = useRef(false);
    const was = useRef(selected);

    const { hostRef, canvasRef, run } = useCanvasOverlay<HTMLButtonElement>((ctx, w, h) => {
        let alive = false;

        if (sweep.current) {
            const p = (performance.now() - sweep.current) / 440;
            if (p >= 1) sweep.current = 0;
            else {
                const x = w * ease(p);
                ctx.save();
                rr(ctx, 0, 0, w, h, 12);
                ctx.clip();
                ctx.fillStyle = `rgba(49,130,246,${0.14 * (1 - p * 0.5)})`;
                ctx.fillRect(0, 0, x, h);
                ctx.fillStyle = `rgba(49,130,246,${0.5 * (1 - p)})`;
                ctx.fillRect(x - 2, 0, 2, h);
                ctx.restore();
                alive = true;
            }
        }

        if (hover.current && !selected && !reduced()) {
            ctx.save();
            rr(ctx, 0, 0, w, h, 12);
            ctx.clip();
            const g = ctx.createRadialGradient(w * 0.16, h / 2, 0, w * 0.16, h / 2, w * 0.7);
            g.addColorStop(0, 'rgba(49,130,246,0.06)');
            g.addColorStop(1, 'rgba(49,130,246,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            ctx.restore();
            alive = true;
        }

        return alive;
    });

    useEffect(() => {
        if (selected && !was.current && !reduced()) {
            sweep.current = performance.now();
            run();
        }
        was.current = selected;
    }, [selected, run]);

    return (
        <button
            ref={hostRef}
            type="button"
            role="option"
            aria-selected={selected}
            onPointerEnter={() => {
                hover.current = true;
                run();
            }}
            onPointerLeave={() => {
                hover.current = false;
            }}
            onClick={onToggle}
            style={{
                position: 'relative',
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: 'none',
                background: selected ? SEL_BG : FIELD,
                borderRadius: 12,
                padding: '15px 16px',
                cursor: 'pointer',
                transition: 'background .18s linear',
            }}
        >
            <canvas ref={canvasRef} aria-hidden="true" style={overlay} />
            <span style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                <span
                    style={{
                        display: 'block',
                        fontSize: 15,
                        fontWeight: selected ? 700 : 500,
                        color: selected ? BLUE : SUB,
                        transition: 'color .18s linear',
                    }}
                >
                    {label}
                </span>
                {desc && (
                    <span style={{ display: 'block', fontSize: 12.5, color: MUTED, marginTop: 2 }}>{desc}</span>
                )}
            </span>
            <span
                style={{
                    position: 'relative',
                    zIndex: 1,
                    width: 20,
                    height: 20,
                    flexShrink: 0,
                    borderRadius: multi ? 6 : '50%',
                    background: selected ? BLUE : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background .18s linear',
                }}
            >
                {selected && (
                    <svg width="11" height="11" viewBox="0 0 12 12">
                        <path
                            d="M2 6.2 4.6 9 10 3"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </span>
        </button>
    );
};

// ───────────────── Button ─────────────────
export const FxButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}> = ({ children, onClick, disabled }) => {
    const ripple = useRef<{ x: number; y: number; t0: number } | null>(null);
    const hover = useRef(false);

    const { hostRef, canvasRef, run } = useCanvasOverlay<HTMLButtonElement>((ctx, w, h, t) => {
        let alive = false;

        if (hover.current && !disabled && !reduced()) {
            ctx.save();
            rr(ctx, 0, 0, w, h, 14);
            ctx.clip();
            const x = ((t / 1150) % 1) * (w + 140) - 70;
            const g = ctx.createLinearGradient(x - 46, 0, x + 46, 0);
            g.addColorStop(0, 'rgba(255,255,255,0)');
            g.addColorStop(0.5, 'rgba(255,255,255,0.18)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.fillRect(x - 46, 0, 92, h);
            ctx.restore();
            alive = true;
        }

        const rp = ripple.current;
        if (rp) {
            const p = (performance.now() - rp.t0) / 460;
            if (p >= 1) ripple.current = null;
            else {
                ctx.save();
                rr(ctx, 0, 0, w, h, 14);
                ctx.clip();
                ctx.beginPath();
                ctx.arc(rp.x, rp.y, p * Math.hypot(w, h), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${(1 - p) * 0.32})`;
                ctx.fill();
                ctx.restore();
                alive = true;
            }
        }

        return alive;
    });

    return (
        <button
            ref={hostRef}
            type="button"
            disabled={disabled}
            onPointerEnter={() => {
                hover.current = true;
                run();
            }}
            onPointerLeave={() => {
                hover.current = false;
            }}
            onPointerDown={(e) => {
                if (disabled) return;
                const r = e.currentTarget.getBoundingClientRect();
                ripple.current = { x: e.clientX - r.left, y: e.clientY - r.top, t0: performance.now() };
                run();
            }}
            onClick={() => !disabled && onClick?.()}
            style={{
                position: 'relative',
                width: '100%',
                border: 'none',
                borderRadius: 14,
                padding: '16px 20px',
                fontSize: 16,
                fontWeight: 700,
                color: disabled ? DISABLED_TX : '#fff',
                background: disabled ? DISABLED_BG : BLUE,
                cursor: disabled ? 'default' : 'pointer',
                overflow: 'hidden',
                transition: 'background .18s linear, color .18s linear',
            }}
        >
            <canvas ref={canvasRef} aria-hidden="true" style={overlay} />
            <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
        </button>
    );
};

// 포커스 시 링 펄스 + 하단 글로우 (전이 이펙트만). dir: 1 focus-in, -1 focus-out
type FocusAnim = { dir: 1 | -1; t0: number } | null;

function drawFocusRing(ctx: CanvasRenderingContext2D, w: number, h: number, a: FocusAnim): boolean {
    if (!a) return false;
    const dur = a.dir === 1 ? 260 : 180;
    const p = Math.min(1, (performance.now() - a.t0) / dur);
    const k = a.dir === 1 ? ease(p) : 1 - ease(p);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `rgba(49,130,246,${0.8 * k})`;
    rr(ctx, 1, 1, w - 2, h - 2, 12);
    ctx.stroke();

    if (!reduced()) {
        const g = ctx.createLinearGradient(0, h, 0, h - 18);
        g.addColorStop(0, `rgba(49,130,246,${0.15 * k})`);
        g.addColorStop(1, 'rgba(49,130,246,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, h - 18, w, 18);
    }
    return p < 1;
}

const fieldBox = (focused: boolean): React.CSSProperties => ({
    position: 'relative',
    background: focused ? FIELD_FOCUS : FIELD,
    borderRadius: 12,
    transition: 'background .18s linear',
});

// ───────────────── Text / Number 입력 ─────────────────
export const FxTextInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    onEnter?: () => void;
    placeholder?: string;
    numeric?: boolean;
}> = ({ value, onChange, onEnter, placeholder, numeric }) => {
    const [focused, setFocused] = useState(false);
    const anim = useRef<FocusAnim>(null);
    const { hostRef, canvasRef, run } = useCanvasOverlay<HTMLDivElement>((ctx, w, h) => {
        const alive = drawFocusRing(ctx, w, h, anim.current);
        if (!alive) anim.current = null;
        return alive;
    });

    return (
        <div ref={hostRef} style={fieldBox(focused)}>
            <canvas ref={canvasRef} aria-hidden="true" style={overlay} />
            <input
                value={value}
                inputMode={numeric ? 'numeric' : undefined}
                placeholder={placeholder}
                onChange={(e) =>
                    onChange(numeric ? e.target.value.replace(/[^\d]/g, '') : e.target.value)
                }
                onFocus={() => {
                    setFocused(true);
                    anim.current = { dir: 1, t0: performance.now() };
                    run();
                }}
                onBlur={() => {
                    setFocused(false);
                    anim.current = { dir: -1, t0: performance.now() };
                    run();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onEnter?.();
                }}
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    border: 'none',
                    background: 'transparent',
                    padding: '15px 16px',
                    fontSize: 17,
                    color: INK,
                    outline: 'none',
                }}
            />
        </div>
    );
};

// ───────────────── Tags 입력 ─────────────────
export const FxTags: React.FC<{
    value: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
    const [draft, setDraft] = useState('');
    const [focused, setFocused] = useState(false);
    const anim = useRef<FocusAnim>(null);
    const { hostRef, canvasRef, run } = useCanvasOverlay<HTMLDivElement>((ctx, w, h) => {
        const alive = drawFocusRing(ctx, w, h, anim.current);
        if (!alive) anim.current = null;
        return alive;
    });

    const add = (raw: string) => {
        const t = raw.replace(/,/g, '').trim();
        if (!t || value.includes(t)) return;
        onChange([...value, t]);
        setDraft('');
    };

    return (
        <div ref={hostRef} style={fieldBox(focused)}>
            <canvas ref={canvasRef} aria-hidden="true" style={overlay} />
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    alignItems: 'center',
                    padding: '10px 12px',
                    minHeight: 48,
                }}
            >
                {value.map((tag) => (
                    <span
                        key={tag}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: '#fff',
                            color: BLUE,
                            fontSize: 14,
                            fontWeight: 600,
                            padding: '6px 10px',
                            borderRadius: 8,
                        }}
                    >
                        #{tag}
                        <button
                            type="button"
                            onClick={() => onChange(value.filter((v) => v !== tag))}
                            aria-label={`${tag} 삭제`}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: MUTED,
                                cursor: 'pointer',
                                fontSize: 14,
                                lineHeight: 1,
                                padding: 0,
                            }}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    value={draft}
                    placeholder={value.length === 0 ? placeholder : ''}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v.endsWith(',')) add(v);
                        else setDraft(v);
                    }}
                    onFocus={() => {
                        setFocused(true);
                        anim.current = { dir: 1, t0: performance.now() };
                        run();
                    }}
                    onBlur={() => {
                        setFocused(false);
                        anim.current = { dir: -1, t0: performance.now() };
                        run();
                        if (draft.trim()) add(draft);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            add(draft);
                        } else if (e.key === 'Backspace' && !draft && value.length) {
                            onChange(value.slice(0, -1));
                        }
                    }}
                    style={{
                        flex: 1,
                        minWidth: 120,
                        border: 'none',
                        background: 'transparent',
                        fontSize: 16,
                        color: INK,
                        outline: 'none',
                        padding: '5px 0',
                    }}
                />
            </div>
        </div>
    );
};

export const FORM_COLORS = { INK, SUB, MUTED, BLUE, TRACK, FIELD };
