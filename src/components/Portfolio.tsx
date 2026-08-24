'use client';

import React, { useState } from 'react';
import { theme } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import GreekMeander from '@/src/components/GreekMeander';
import PortfolioLightbox from '@/src/components/PortfolioLightbox';

const portfolioData = [
  {
    title: 'MrCEO',
    period: '2021',
    status: '운영 중',
    mainImage: '/portfolios/mrceo/mrceo_main.png',
    detailImages: [
      '/portfolios/mrceo/mrceo_detail_crawling.png',
      '/portfolios/mrceo/mrceo_detail_finance.png',
      '/portfolios/mrceo/mrceo_detail_hr.png',
    ],
    url: 'https://www.mrceo.kr/',
    stacks: ['Node.js', 'React', 'TypeScript', 'MySQL'],
    category: 'B2B SaaS · 세무회계 자동화',
  },
  {
    title: 'MyPill',
    period: '2022',
    status: '운영 중',
    mainImage: '/portfolios/mypill/mypill_main.png',
    detailImages: [
      '/portfolios/mypill/mypill_detail_analysis.png',
      '/portfolios/mypill/mypill_detail_recommend.png',
      '/portfolios/mypill/mypill_detail_delivery.png',
    ],
    url: 'https://mypill.io/',
    stacks: ['Node.js', 'React', 'TypeScript', 'MySQL'],
    category: 'B2C · 헬스테크 / 건강기능식품 커머스',
  },
  {
    title: 'TheFitLove',
    period: '2023',
    status: '운영 중',
    mainImage: '/portfolios/thefitlove/fitlove_main.png',
    detailImages: [
      '/portfolios/thefitlove/fitlove_detail_app.png',
      '/portfolios/thefitlove/fitlove_detail_matching.png',
      '/portfolios/thefitlove/fitlove_detail_payment.png',
    ],
    url: 'https://thefitlove.co.kr/',
    stacks: ['Node.js', 'React Native', 'TypeScript', 'MySQL'],
    category: 'B2C · 소셜/데이팅 앱',
  },
  {
    title: 'DrLab',
    period: '2024.10 - 2025.8',
    status: '구축 완료',
    mainImage: '/portfolios/doctorlab/drlab_main.png',
    detailImages: [
      '/portfolios/doctorlab/drlab_detail_dashboard.png',
      '/portfolios/doctorlab/drlab_detail_expand.png',
      '/portfolios/doctorlab/drlab_detail_survey.png',
    ],
    url: 'https://doctorlab.kr/',
    stacks: ['NestJS', 'React', 'TypeScript', 'PostgreSQL'],
    category: 'B2B SaaS · 병원 경영 데이터 분석',
  },
  {
    title: 'K·DOC',
    period: '2025.11 ~',
    status: '진행 중',
    mainImage: '/portfolios/kdocfinder/kdoc_main.png',
    detailImages: [
      '/portfolios/kdocfinder/kdoc_detail_backend.png',
      '/portfolios/kdocfinder/kdoc_detail_matching.png',
      '/portfolios/kdocfinder/kdoc_detail_sns.png',
    ],
    url: 'https://kdocfinder.com/',
    stacks: ['NestJS', 'Prisma', 'PostgreSQL', 'React'],
    category: 'B2C · 글로벌 병원 매칭·예약 플랫폼',
  },
];

const Portfolio = () => {
  const isMobile = useIsMobile();
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

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
          flexWrap: 'wrap',
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
              flex: isMobile ? undefined : '1 1 300px',
              maxWidth: isMobile ? '100%' : 340,
              width: isMobile ? '100%' : undefined,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {/* Cover image */}
            <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
              <img
                src={item.mainImage}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Card body */}
            <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Title + period row */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
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
                <span
                  style={{
                    fontFamily: theme.font.serif,
                    fontSize: 11,
                    letterSpacing: '1px',
                    color: theme.color.gold,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.period} · {item.status}
                </span>
              </div>

              {/* Gold rule */}
              <div style={{ width: '100%', height: 1, background: theme.color.gold, opacity: 0.3 }} />

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

              {/* Lightbox trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ images: [item.mainImage, ...item.detailImages], index: 0 });
                }}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 4,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontFamily: theme.font.serif,
                  fontSize: 12,
                  letterSpacing: '0.5px',
                  color: theme.color.sepia,
                  cursor: 'pointer',
                }}
              >
                상세 이미지 보기 →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom meander */}
      <div style={{ width: 140, marginTop: 56 }}>
        <GreekMeander id="gk-portfolio-bottom" strokeColor={theme.color.gold} />
      </div>

      {lightbox && (
        <PortfolioLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
};

export default Portfolio;
