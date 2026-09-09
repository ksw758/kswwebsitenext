'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

/**
 * 결과 화면 섹션 리빌 이펙트 (방식 B — 세로 순차).
 * - 위에서부터 섹션이 하나씩 순서대로 "생성"된다 (등록 순 = DOM 순 = 위→아래).
 * - 콘텐츠: CSS 리빌 (fade + 위→아래 clip-path 와이프).
 * - 액센트: 화면 전체 공유 <canvas> 1장. 각 섹션이 켜질 때 가로 스캔 라인이 위→아래로 훑음.
 * 가드: prefers-reduced-motion / 모바일(<=767px) → canvas 생략 (순차 CSS 리빌은 유지).
 */

type RegisterFn = (el: HTMLElement, reveal: () => void) => () => void;
const Ctx = createContext<RegisterFn>(() => () => {});

const STAGGER = 1000; // 섹션 간 시작 간격(ms)
const START_DELAY = 200;
const SWEEP_DUR = 820;
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

const REVEAL_CSS = `
.swf-reveal{opacity:0;transform:translateY(10px);clip-path:inset(0 0 100% 0);will-change:opacity,transform,clip-path}
.swf-reveal.swf-in{opacity:1;transform:none;clip-path:inset(0 0 0 0);
  transition:opacity .55s ease,transform .65s cubic-bezier(.22,1,.36,1),clip-path .78s cubic-bezier(.22,1,.36,1)}
@media (prefers-reduced-motion:reduce){
  .swf-reveal{opacity:1;transform:none;clip-path:none}
  .swf-reveal.swf-in{transition:none}
}
`;

type Sub = { el: HTMLElement; reveal: () => void };
type Sweep = { el: HTMLElement; t0: number };

export const SectionFxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const subs = useRef<Sub[]>([]);
    const drained = useRef(false);
    const sweeps = useRef<Sweep[]>([]);
    const raf = useRef(0);
    const enabled = useRef(true);
    const loopRef = useRef<() => void>(() => {});

    const register = useCallback<RegisterFn>((el, reveal) => {
        const entry: Sub = { el, reveal };
        subs.current.push(entry);
        if (drained.current) {
            // 시퀀스가 끝난 뒤 뒤늦게 마운트된 섹션은 즉시 노출
            queueMicrotask(reveal);
        }
        return () => {
            subs.current = subs.current.filter((s) => s !== entry);
        };
    }, []);

    useEffect(() => {
        enabled.current =
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
            !window.matchMedia('(max-width: 767px)').matches;

        // ── canvas 스캔 라인 루프 ──
        const loop = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) {
                raf.current = 0;
                return;
            }
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
                canvas.width = Math.round(w * dpr);
                canvas.height = Math.round(h * dpr);
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            const now = performance.now();
            sweeps.current = sweeps.current.filter((s) => {
                const p = (now - s.t0) / SWEEP_DUR;
                if (p >= 1) return false;

                const r = s.el.getBoundingClientRect();
                if (r.bottom < 0 || r.top > h || r.height < 1 || r.width < 1) return true;

                const e = ease(p);
                const y = r.top + r.height * e;
                const a = p < 0.15 ? p / 0.15 : p > 0.78 ? (1 - p) / 0.22 : 1;

                // 라인 위쪽으로 채워지는 옅은 틴트
                ctx.fillStyle = `rgba(49,130,246,${0.05 * a})`;
                ctx.fillRect(r.left, r.top, r.width, Math.max(0, y - r.top));

                // 트레일 글로우 (라인 위)
                const g = ctx.createLinearGradient(0, y - 64, 0, y);
                g.addColorStop(0, 'rgba(49,130,246,0)');
                g.addColorStop(1, `rgba(49,130,246,${0.2 * a})`);
                ctx.fillStyle = g;
                ctx.fillRect(r.left, y - 64, r.width, 64);

                // 코어 라인 (가로)
                ctx.fillStyle = `rgba(49,130,246,${0.45 * a})`;
                ctx.fillRect(r.left, y - 2, r.width, 4);
                ctx.fillStyle = `rgba(255,255,255,${0.85 * a})`;
                ctx.fillRect(r.left, y - 1, r.width, 1.5);

                // 잔불꽃
                for (let i = 0; i < 6; i++) {
                    const sx = r.left + ((i * 131 + Math.floor(now / 38) * 17) % r.width);
                    const sa = a * (0.5 + 0.5 * Math.sin(now / 85 + i));
                    ctx.fillStyle = `rgba(120,170,255,${0.5 * sa})`;
                    ctx.beginPath();
                    ctx.arc(sx, y + (i % 2 ? 3 : -3), 1.3, 0, Math.PI * 2);
                    ctx.fill();
                }
                return true;
            });

            if (sweeps.current.length > 0) {
                raf.current = requestAnimationFrame(loop);
            } else {
                ctx.clearRect(0, 0, w, h);
                raf.current = 0;
            }
        };
        loopRef.current = loop;

        // ── 위→아래 순차 시퀀스 ──
        let i = 0;
        let t: ReturnType<typeof setTimeout>;
        const step = () => {
            const entry = subs.current[i];
            if (!entry) {
                drained.current = true;
                return;
            }
            entry.reveal();
            if (enabled.current) {
                sweeps.current.push({ el: entry.el, t0: performance.now() });
                if (!raf.current) raf.current = requestAnimationFrame(loopRef.current);
            }
            i += 1;
            t = setTimeout(step, STAGGER);
        };
        t = setTimeout(step, START_DELAY);

        return () => {
            clearTimeout(t);
            if (raf.current) cancelAnimationFrame(raf.current);
            raf.current = 0;
        };
    }, []);

    return (
        <Ctx.Provider value={register}>
            <style>{REVEAL_CSS}</style>
            {/* JS 꺼진 환경 대비 */}
            <noscript>
                <style>{`.swf-reveal{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
            </noscript>
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 40,
                }}
            />
            {children}
        </Ctx.Provider>
    );
};

/** 섹션 래퍼에 붙일 ref + className. 등록 순서대로(위→아래) 순차 리빌된다. */
export function useSectionReveal<T extends HTMLElement = HTMLElement>() {
    const register = useContext(Ctx);
    const ref = useRef<T>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        return register(el, () => setShown(true));
    }, [register]);

    return { ref, className: shown ? 'swf-reveal swf-in' : 'swf-reveal' };
}

/** <Section> 이 아닌 블록(헤더·폼 등)용 간단 래퍼. */
export const Reveal: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
    children,
    style,
}) => {
    const { ref, className } = useSectionReveal<HTMLDivElement>();
    return (
        <div ref={ref} className={className} style={style}>
            {children}
        </div>
    );
};
