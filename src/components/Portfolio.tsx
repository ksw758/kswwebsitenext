'use client';

import React from 'react';
import { theme } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import GreekMeander from '@/src/components/GreekMeander';

const portfolioData = [
  {
    title: 'MrCEO',
    year: '2021',
    logo: 'https://www.mrceo.kr/src/images/logo.png',
    introImage: '/images/mrceoIntro.png',
    url: 'https://www.mrceo.kr/',
    stacks: ['Node.js', 'React', 'TypeScript', 'MySQL'],
    category: 'B2B SaaS · 세무회계 자동화',
  },
  {
    title: 'MyPill',
    year: '2022',
    logo: 'https://mypill.io/images/MYPILL_logo.png',
    introImage: '/images/mypillIntro.png',
    url: 'https://mypill.io/',
    stacks: ['Node.js', 'React', 'TypeScript', 'MySQL'],
    category: 'B2C · 헬스테크 / 건강기능식품 커머스',
  },
  {
    title: 'TheFitLove',
    year: '2023',
    logo: '/images/thefitlove_logo.png',
    introImage: '/images/thefitlove_intro.png',
    url: 'https://thefitlove.co.kr/',
    stacks: ['Node.js', 'React Native', 'TypeScript', 'MySQL'],
    category: 'B2C · 소셜/데이팅 앱',
  },
];

const Portfolio = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="Portfolio"
      style={{
        background: theme.color.sepia,
        boxSizing: 'border-box',
        width: '100vw',
        padding: isMobile ? '60px 20px 72px' : '80px 40px 96px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Eyebrow label */}
      <p
        style={{
          margin: '0 0 14px 0',
          fontFamily: theme.font.serif,
          fontSize: 11,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: theme.color.gold,
        }}
      >
        서비스 중인 플랫폼
      </p>

      {/* Meander accent */}
      <div style={{ width: 140, marginBottom: 22 }}>
        <GreekMeander id="gk-portfolio-top" strokeColor={theme.color.gold} />
      </div>

      {/* Title */}
      <h2
        style={{
          margin: '0 0 60px 0',
          fontFamily: theme.font.serif,
          fontSize: isMobile ? 20 : 30,
          fontWeight: 700,
          color: theme.color.parchment,
          textAlign: 'center',
          lineHeight: 1.6,
          letterSpacing: '0.3px',
        }}
      >
        Portfolio
      </h2>

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 24,
          width: '100%',
          maxWidth: 1100,
          justifyContent: 'center',
        }}
      >
        {portfolioData.map((item) => (
          <div
            key={item.title}
            onClick={() => window.open(item.url, '_blank')}
            style={{
              boxSizing: 'border-box',
              background: theme.color.parchment,
              flex: isMobile ? undefined : '1 1 0',
              width: isMobile ? '100%' : undefined,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {/* Intro image */}
            <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
              <img
                src={item.introImage}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Card body */}
            <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Logo + year row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <img
                  src={item.logo}
                  alt={item.title}
                  style={{ maxWidth: 100, maxHeight: 32, objectFit: 'contain' }}
                />
                <span
                  style={{
                    fontFamily: theme.font.serif,
                    fontSize: 11,
                    letterSpacing: '2px',
                    color: theme.color.gold,
                  }}
                >
                  {item.year} · 운영 중
                </span>
              </div>

              {/* Gold rule */}
              <div style={{ width: '100%', height: 1, background: theme.color.gold, opacity: 0.3 }} />

              {/* Title */}
              <h3
                style={{
                  margin: 0,
                  fontFamily: theme.font.serif,
                  fontSize: 18,
                  fontWeight: 700,
                  color: theme.color.sepia,
                  letterSpacing: '0.3px',
                }}
              >
                {item.title}
              </h3>

              {/* Category */}
              <p
                style={{
                  margin: 0,
                  fontFamily: theme.font.serif,
                  fontSize: 12,
                  color: `${theme.color.sepia}99`,
                  lineHeight: 1.6,
                }}
              >
                {item.category}
              </p>

              {/* Stack tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.stacks.map((stack) => (
                  <span
                    key={stack}
                    style={{
                      fontFamily: theme.font.serif,
                      fontSize: 10,
                      letterSpacing: '1px',
                      color: theme.color.gold,
                      border: `1px solid ${theme.color.gold}`,
                      padding: '2px 8px',
                      opacity: 0.85,
                    }}
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom meander */}
      <div style={{ width: 140, marginTop: 56 }}>
        <GreekMeander id="gk-portfolio-bottom" strokeColor={theme.color.gold} />
      </div>
    </section>
  );
};

export default Portfolio;