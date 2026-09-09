'use client';

import React from 'react';
import { useIsMobile } from '@/src/hooks/useIsMobile';

/**
 * /survey 전용 푸터.
 * 텍스트·정보는 메인 푸터(src/components/Footer.tsx)와 동일하게 가져오되,
 * 스타일은 hero 섹션(밝은 톤 + Pretendard)에 맞춰 토스풍으로 재구성.
 * 폰트는 app/survey/layout.tsx 래퍼에서 상속.
 */

const SOCIAL = [
  { label: 'GitHub', url: 'https://github.com/ksw758' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sangwon-kim-dev/' },
  { label: 'RocketPunch', url: 'https://www.rocketpunch.com/@ksw75811' },
];

const BIZ_INFO = [
  { label: '상호', value: '상원(SW)에이전츠' },
  { label: '대표자', value: '김상원' },
  { label: '사업자등록번호', value: '148-17-02685' },
  { label: '사업장', value: '서울특별시 금천구 가산디지털1로 168, B동 901호' },
  { label: '연락처', value: '010-9910-7581' },
  { label: '이메일', value: 'ksw75811@naver.com' },
];

const C = {
  grey900: '#191F28',
  grey700: '#4E5968',
  grey500: '#8B95A1',
  grey400: '#ADB5BD',
  grey200: '#E5E8EB',
};

const SurveyFooter = () => {
  const isMobile = useIsMobile();

  const linkStyle: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: '-0.01em',
    color: C.grey500,
    textDecoration: 'none',
  };

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box',
        width: '100%',
        padding: isMobile ? '44px 24px 40px' : '60px 40px 48px',
        borderTop: `1px solid ${C.grey200}`,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}
    >
      {/* 로고 + 워드마크 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.svg"
          alt="상원(SW)에이전츠 로고"
          style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover' }}
        />
        <span style={{ fontSize: 14, fontWeight: 700, color: C.grey900, letterSpacing: '-0.01em' }}>
          상원(SW)에이전츠
        </span>
      </div>

      {/* 소셜 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {SOCIAL.map(({ label, url }, i) => (
          <React.Fragment key={label}>
            {i > 0 && <span style={{ color: C.grey200, fontSize: 12 }}>·</span>}
            <a href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {label}
            </a>
          </React.Fragment>
        ))}
      </div>

      <div style={{ width: isMobile ? '100%' : 640, height: 1, background: C.grey200 }} />

      {/* 사업자 정보 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        {BIZ_INFO.map(({ label, value }) => (
          <p
            key={label}
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
              color: C.grey500,
              textAlign: 'center',
              wordBreak: 'keep-all',
            }}
          >
            <span style={{ color: C.grey700, fontWeight: 600, marginRight: 6 }}>{label}</span>
            {value}
          </p>
        ))}
      </div>

      <div style={{ width: isMobile ? 160 : 240, height: 1, background: C.grey200 }} />

      {/* 약관 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a href="/terms" style={linkStyle}>이용약관</a>
        <span style={{ color: C.grey200 }}>|</span>
        <a href="/privacy" style={linkStyle}>개인정보 처리방침</a>
      </div>

      {/* SSL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill={C.grey200} stroke={C.grey400} strokeWidth="1.5" />
          <path d="M9 12l2 2 4-4" stroke={C.grey500} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 10, letterSpacing: '1px', color: C.grey400 }}>SSL SECURED</span>
      </div>

      {/* Copyright */}
      <p style={{ margin: 0, fontSize: 11, letterSpacing: '-0.01em', color: C.grey400, textAlign: 'center' }}>
        © 2026 상원(SW)에이전츠 · All Rights Reserved
      </p>
    </footer>
  );
};

export default SurveyFooter;