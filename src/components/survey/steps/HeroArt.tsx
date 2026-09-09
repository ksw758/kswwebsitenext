'use client';

import React, { useEffect, useRef } from 'react';

/**
 * 랜딩 히어로 일러스트.
 * GPT 3D 렌더 이미지(assets/*.png)를 자동 벡터변환하지 않고, 그 개념
 * (설문조사 → WBS 자동 생성 → DB 설계도 → 견적)만 가져와 손으로 그린 플랫 SVG.
 * 애니메이션: 카드 스태거 등장 + 상하 float 루프, 체크·연결선 stroke draw,
 * 화살표 흐름 펄스, 총 견적 카운트업. prefers-reduced-motion이면 전부 정지.
 */

const CSS = `
.swv-hero{max-width:620px;margin:0 auto;width:100%}
.swv-hero svg{width:100%;height:auto;display:block;overflow:visible}
.swv-hero text{font-family:inherit;fill:#212529}
.swv-title{font-size:12.5px;font-weight:700}
.swv-sub{font-size:8.5px;fill:#8b95a1}
.swv-card{opacity:0;transform:translateY(14px);
  animation:swv-enter .55s cubic-bezier(.22,1,.36,1) forwards,swv-float 4.6s linear infinite}
.swv-card-1{animation-delay:.05s,.75s}
.swv-card-2{animation-delay:.17s,1s;animation-duration:.55s,5.1s}
.swv-card-3{animation-delay:.29s,1.2s;animation-duration:.55s,4.3s}
.swv-card-4{animation-delay:.41s,1.4s;animation-duration:.55s,5.4s}
@keyframes swv-enter{to{opacity:1;transform:translateY(0)}}
@keyframes swv-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.swv-draw{stroke-dasharray:64;stroke-dashoffset:64;animation:swv-dash .55s ease forwards;animation-delay:1.05s}
.swv-draw-lg{stroke-dasharray:220;stroke-dashoffset:220;animation:swv-dash .8s ease forwards;animation-delay:1.15s}
@keyframes swv-dash{to{stroke-dashoffset:0}}
.swv-arrow{opacity:.22;animation:swv-arrow 2.6s ease-in-out infinite}
.swv-arrow-1{animation-delay:1.5s}
.swv-arrow-2{animation-delay:1.8s}
.swv-arrow-3{animation-delay:2.1s}
@keyframes swv-arrow{0%,100%{opacity:.2;transform:translateX(0)}50%{opacity:1;transform:translateX(3px)}}
@media (prefers-reduced-motion:reduce){
 .swv-hero *{animation:none!important}
 .swv-card{opacity:1!important;transform:none!important}
 .swv-draw,.swv-draw-lg{stroke-dashoffset:0!important}
 .swv-arrow{opacity:.5!important}
}
`;

type CardProps = {
  x: number;
  i: 1 | 2 | 3 | 4;
  accent: string;
  title: string;
  sub: [string, string];
  icon: React.ReactNode;
  children: React.ReactNode;
};

function Card({ x, i, accent, title, sub, icon, children }: CardProps) {
  // 바깥 g = 위치(속성 transform). 안쪽 g = 애니메이션(CSS transform) — 섞으면 CSS가 속성을 덮어써서 카드가 튄다.
  return (
    <g transform={`translate(${x} 58)`}>
      <g className={`swv-card swv-card-${i}`}>
        <rect width="160" height="260" rx="18" fill="#ffffff" filter="url(#swv-shadow)" />
        <rect x="16" y="16" width="34" height="34" rx="11" fill={accent} />
        <g transform="translate(16 16)">{icon}</g>
        <text className="swv-title" x="16" y="80">{title}</text>
        <text className="swv-sub" x="16" y="98">{sub[0]}</text>
        <text className="swv-sub" x="16" y="110">{sub[1]}</text>
        <g transform="translate(14 122)">{children}</g>
      </g>
    </g>
  );
}

const TOTAL = 950_000;

export default function HeroArt() {
  const totalRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const el = totalRef.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = TOTAL.toLocaleString('en-US');
      return;
    }
    const dur = 1100;
    const start = performance.now() + 700;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(TOTAL * eased).toLocaleString('en-US');
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    el.textContent = '0';
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="swv-hero">
      <style>{CSS}</style>
      <svg
        viewBox="0 0 788 376"
        role="img"
        aria-label="설문조사에서 WBS 자동 생성, DB 설계도, 견적까지 이어지는 4단계 흐름"
      >
        <defs>
          <filter id="swv-shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#1A2A44" floodOpacity="0.1" />
          </filter>
          <filter id="swv-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* 배경 소프트 블롭 */}
        <g filter="url(#swv-blur)">
          <circle cx="120" cy="130" r="80" fill="#3182F6" opacity="0.13" />
          <circle cx="600" cy="250" r="95" fill="#FCA64D" opacity="0.13" />
        </g>

        {/* 단계 화살표 */}
        {[190, 394, 598].map((cx, idx) => (
          <g key={cx} transform={`translate(${cx} 188)`}>
            <path
              className={`swv-arrow swv-arrow-${idx + 1}`}
              d="M-5 -8 L 6 0 L -5 8"
              fill="none"
              stroke="#C1C8D0"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* 1. 간단한 설문조사 */}
        <Card
          x={8}
          i={1}
          accent="#3182F6"
          title="간단한 설문조사"
          sub={['원하는 서비스를 쉽고', '빠르게 알려주세요']}
          icon={
            <>
              <rect x="8" y="8" width="18" height="18" rx="5" fill="none" stroke="#fff" strokeWidth="2.2" />
              <path d="M11 17.5 l3.5 3.5 l7.5 -8.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </>
          }
        >
          {[0, 21, 42].map((y, idx) => (
            <g key={y}>
              <circle
                cx="6"
                cy={y + 6.5}
                r="5"
                fill={idx === 0 ? '#3182F6' : 'none'}
                stroke={idx === 0 ? '#3182F6' : '#D1D6DB'}
                strokeWidth="1.5"
              />
              {idx === 0 && (
                <path d={`M3 ${y + 6.5} l2 2 l4 -4.5`} fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              )}
              <rect x="18" y={y} width={idx === 2 ? 92 : 114} height="13" rx="6" fill="#F2F4F6" />
            </g>
          ))}
          <rect x="0" y="92" width="132" height="32" rx="13" fill="#3182F6" />
          <path className="swv-draw" d="M57 108 l6 6 l12 -15" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Card>

        {/* 2. WBS 자동 생성 */}
        <Card
          x={212}
          i={2}
          accent="#20C997"
          title="WBS 자동 생성"
          sub={['프로젝트 분해 구조를', '체계적으로 제안해요']}
          icon={
            <>
              <rect x="13" y="6" width="9" height="6.5" rx="1.6" fill="#fff" />
              <rect x="6" y="21" width="8" height="6.5" rx="1.6" fill="#fff" />
              <rect x="21" y="21" width="8" height="6.5" rx="1.6" fill="#fff" />
              <path d="M17.5 12.5 V16 M10 16 H25 M10 16 V21 M25 16 V21" fill="none" stroke="#fff" strokeWidth="1.6" />
            </>
          }
        >
          <rect x="40" y="0" width="52" height="20" rx="6" fill="#E6FCF5" stroke="#20C997" strokeWidth="1" />
          <text x="66" y="13.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#0CA678">프로젝트</text>
          <path
            className="swv-draw-lg"
            d="M66 20 V30 M18 30 H114 M18 30 V44 M66 30 V44 M114 30 V44"
            fill="none"
            stroke="#ADB5BD"
            strokeWidth="1"
          />
          {[
            { x: 0, label: '1.기획' },
            { x: 48, label: '2.개발' },
            { x: 96, label: '3.배포' },
          ].map((c) => (
            <g key={c.x}>
              <rect x={c.x} y="44" width="36" height="18" rx="5" fill="#E6FCF5" stroke="#20C997" strokeWidth="1" />
              <text x={c.x + 18} y="55.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#0CA678">{c.label}</text>
              <rect x={c.x} y="68" width="36" height="6" rx="3" fill="#F1F3F5" />
              <rect x={c.x} y="78" width="26" height="6" rx="3" fill="#F1F3F5" />
            </g>
          ))}
        </Card>

        {/* 3. DB 설계도 제공 */}
        <Card
          x={416}
          i={3}
          accent="#845EF7"
          title="DB 설계도 제공"
          sub={['요구사항에 맞는', '데이터베이스 설계도']}
          icon={
            <>
              <ellipse cx="17" cy="10" rx="9" ry="3.4" fill="#fff" />
              <path d="M8 10 V22 C8 24 12.5 25.4 17 25.4 C21.5 25.4 26 24 26 22 V10" fill="none" stroke="#fff" strokeWidth="2" />
              <path d="M8 16 C8 18 12.5 19.4 17 19.4 C21.5 19.4 26 18 26 16" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.7" />
            </>
          }
        >
          <g transform="translate(0 2)">
            <rect x="0" y="0" width="58" height="52" rx="5" fill="#ffffff" stroke="#E9ECEF" strokeWidth="1" />
            <rect x="0" y="0" width="58" height="14" rx="5" fill="#F3F0FF" />
            <rect x="0" y="9" width="58" height="5" fill="#F3F0FF" />
            <text x="6" y="10" fontSize="7" fontWeight="700" fill="#7048E8">users</text>
            {[20, 29, 38, 47].map((y, idx) => (
              <rect key={y} x="7" y={y} width={idx === 0 ? 30 : 40} height="5" rx="2.5" fill="#F1F3F5" />
            ))}
            <circle cx="4" cy="22.5" r="1.8" fill="#FCA64D" />
          </g>
          <g transform="translate(74 20)">
            <rect x="0" y="0" width="58" height="44" rx="5" fill="#ffffff" stroke="#E9ECEF" strokeWidth="1" />
            <rect x="0" y="0" width="58" height="14" rx="5" fill="#F3F0FF" />
            <rect x="0" y="9" width="58" height="5" fill="#F3F0FF" />
            <text x="6" y="10" fontSize="7" fontWeight="700" fill="#7048E8">orders</text>
            {[20, 29, 38].map((y, idx) => (
              <rect key={y} x="7" y={y} width={idx === 0 ? 30 : 40} height="5" rx="2.5" fill="#F1F3F5" />
            ))}
            <circle cx="4" cy="22.5" r="1.8" fill="#FCA64D" />
          </g>
          <path className="swv-draw" d="M58 16 C 68 16 64 40 74 40" fill="none" stroke="#B197FC" strokeWidth="1.5" />
          <circle cx="58" cy="16" r="2" fill="#B197FC" />
          <circle cx="74" cy="40" r="2" fill="#B197FC" />
        </Card>

        {/* 4. 견적까지 한 번에! */}
        <Card
          x={620}
          i={4}
          accent="#FCA64D"
          title="견적까지 한 번에!"
          sub={['모든 결과를 바탕으로', '상세 견적을 받아보세요']}
          icon={
            <g fill="#fff" stroke="#F08C00" strokeWidth="0.8">
              <ellipse cx="17" cy="22" rx="8.5" ry="3" />
              <ellipse cx="17" cy="16.5" rx="8.5" ry="3" />
              <ellipse cx="17" cy="11" rx="8.5" ry="3" />
            </g>
          }
        >
          {[
            { l: '개발비용', v: '500,000' },
            { l: '디자인비용', v: '250,000' },
            { l: '인프라비용', v: '100,000' },
            { l: '기타비용', v: '100,000' },
          ].map((r, idx) => {
            const y = 6 + idx * 17;
            return (
              <g key={r.l}>
                <text x="0" y={y} fontSize="9" fill="#495057">{r.l}</text>
                <text x="132" y={y} textAnchor="end" fontSize="9" fontWeight="600" fill="#212529">{r.v}</text>
              </g>
            );
          })}
          <line x1="0" y1="82" x2="132" y2="82" stroke="#E5E8EB" strokeWidth="1" />
          <text x="0" y="100" fontSize="10.5" fontWeight="700" fill="#212529">총 견적</text>
          <text ref={totalRef} x="132" y="101" textAnchor="end" fontSize="13" fontWeight="800" fill="#F76707">
            950,000
          </text>
        </Card>
      </svg>
    </div>
  );
}
