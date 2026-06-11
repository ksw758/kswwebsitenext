'use client';

import React from 'react';
import { GithubIcon, LinkedInIcon, RocketPunchIcon } from '@/src/styles/svgs';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import { theme } from '@/src/const';
import GreekMeander from '@/src/components/GreekMeander';

const SOCIAL = [
  { Icon: GithubIcon,      url: 'https://github.com/ksw7581' },
  { Icon: LinkedInIcon,    url: 'https://www.linkedin.com/in/james-kim-41b4671b3/' },
  { Icon: RocketPunchIcon, url: 'https://www.rocketpunch.com/@b00b23e820f041a1' },
];

const BIZ_INFO = [
  { label: '상호', value: '상원(SW)에이전츠' },
  { label: '대표자', value: '김상원' },
  { label: '사업자등록번호', value: '148-17-02685' },
  { label: '사업장', value: '서울특별시 금천구 가산디지털1로 168, B동 901호 일부' },
  { label: '연락처', value: '010-9910-7581' },
  { label: '이메일', value: 'ksw75811@naver.com' },
];

const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer
      style={{
        background: theme.color.sepia,
        boxSizing: 'border-box',
        width: '100vw',
        padding: isMobile ? '48px 20px 36px' : '56px 40px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Top meander */}
      <div style={{ width: 140, marginBottom: 36 }}>
        <GreekMeander id="gk-footer-top" strokeColor={theme.color.gold} />
      </div>

      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <img
          src="https://yt3.googleusercontent.com/ytc/AGIKgqMxDVi0Qw4sNfz9te4eDBBRXnugZzzlefHIZoE2-A=s176-c-k-c0x00ffffff-no-rj"
          alt="logo"
          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ width: 1, height: 28, background: theme.color.gold, opacity: 0.6 }} />
        <span
          style={{
            fontFamily: theme.font.serif,
            fontSize: 10,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: theme.color.gold,
          }}
        >
          상원(SW)에이전츠
        </span>
      </div>

      {/* Social icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 24 : 40, marginBottom: 28 }}>
        {SOCIAL.map(({ Icon, url }, i) => (
          <div
            key={i}
            onClick={() => window.open(url, '_blank')}
            style={{
              cursor: 'pointer',
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              flexShrink: 0,
              opacity: 0.8,
            }}
          >
            <Icon />
          </div>
        ))}
      </div>

      {/* Gold rule */}
      <div
        style={{
          width: isMobile ? '100%' : 640,
          height: 1,
          background: theme.color.gold,
          opacity: 0.3,
          marginBottom: 24,
        }}
      />

      {/* 사업자 정보 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        {BIZ_INFO.map(({ label, value }) => (
          <p
            key={label}
            style={{
              margin: 0,
              fontFamily: theme.font.serif,
              fontSize: 11,
              letterSpacing: '1px',
              color: `${theme.color.parchment}88`,
              textAlign: 'center',
            }}
          >
            <span style={{ color: theme.color.gold, opacity: 0.7 }}>{label}</span>
            {'  '}
            {value}
          </p>
        ))}
      </div>

      {/* Gold rule */}
      <div
        style={{
          width: isMobile ? 160 : 240,
          height: 1,
          background: theme.color.gold,
          opacity: 0.2,
          marginBottom: 16,
        }}
      />

      {/* 이용약관 링크 */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        <a
          href="/terms"
          style={{
            fontFamily: theme.font.serif,
            fontSize: 11,
            letterSpacing: '1.5px',
            color: `${theme.color.parchment}66`,
            textDecoration: 'none',
          }}
        >
          이용약관
        </a>
        <span style={{ color: `${theme.color.parchment}33` }}>|</span>
        <a
          href="/privacy"
          style={{
            fontFamily: theme.font.serif,
            fontSize: 11,
            letterSpacing: '1.5px',
            color: `${theme.color.parchment}66`,
            textDecoration: 'none',
          }}
        >
          개인정보 처리방침
        </a>
      </div>

      {/* Copyright */}
      <p
        style={{
          margin: 0,
          fontFamily: theme.font.serif,
          fontSize: 10,
          letterSpacing: '1px',
          color: `${theme.color.parchment}44`,
          textAlign: 'center',
        }}
      >
        © 2026 상원(SW)에이전츠 · All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
