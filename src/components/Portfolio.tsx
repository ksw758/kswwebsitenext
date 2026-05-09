'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/src/hooks/useIsMobile';

const portfolioData = [
  {
    title: 'portfolio.projects.moyvle.title',
    logo: 'https://moyvle.com/assets/img/moyvle-logo.png',
    introImage: '/images/moyvle_intro.png',
    contents: 'portfolio.projects.moyvle.contents',
    url: 'https://moyvle.com/',
  },
  {
    title: 'portfolio.projects.dagyeom.title',
    logo: 'https://dagyeom.s3.ap-northeast-2.amazonaws.com/dagyeom_logo.png',
    introImage: '/images/dagyeom_portfolio.png',
    contents: 'portfolio.projects.dagyeom.contents',
    url: 'https://dagyeom-devsvc.com/',
  },
  {
    title: 'portfolio.projects.thefitlove.title',
    logo: '/images/thefitlove_logo.png',
    introImage: '/images/thefitlove_intro.png',
    contents: 'portfolio.projects.thefitlove.contents',
    url: 'https://thefitlove.co.kr/',
  },
  {
    title: 'portfolio.projects.mypill.title',
    logo: 'https://mypill.io/images/MYPILL_logo.png',
    introImage: '/images/mrceoIntro.png',
    contents: 'portfolio.projects.mypill.contents',
    url: 'https://mypill.io/',
  },
  {
    title: 'portfolio.projects.mrceo.title',
    logo: 'https://www.mrceo.kr/src/images/logo.png',
    introImage: '/images/mypillIntro.png',
    contents: 'portfolio.projects.mrceo.contents',
    url: 'https://www.mrceo.kr/',
  },
  {
    title: 'portfolio.projects.triptime.title',
    logo: '/images/triptime_logo.png',
    introImage: '/images/triptimeIntro.png',
    contents: 'portfolio.projects.triptime.contents',
    url: 'https://triptime.me/',
  },
];

const Portfolio = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <section
      id="Portfolio"
      style={{ background: '#000000', boxSizing: 'border-box', width: '100vw', padding: isMobile ? '30px 20px' : '60px 40px' }}
    >
      {/* Section title */}
      <div
        style={{
          display: 'inline-block',
          fontWeight: 700,
          fontSize: isMobile ? 24 : 48,
          color: '#FFFFFF',
          borderBottom: isMobile ? '2px solid white' : '5px solid white',
          paddingBottom: 6,
          marginBottom: isMobile ? 10 : 20,
        }}
      >
        Portfolio
      </div>

      {/* Cards grid — 3 col on desktop, 1 col on mobile */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {portfolioData.map((item, i) => (
          <div
            key={i}
            onClick={() => window.open(item.url, '_blank')}
            style={{
              boxSizing: 'border-box',
              background: 'white',
              borderRadius: 20,
              padding: 20,
              cursor: 'pointer',
              height: 493,
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 20,
              width: isMobile ? '100%' : 'calc(33.333% - 13.333px)',
              marginRight: isMobile ? 0 : (i + 1) % 3 === 0 ? 0 : 20,
            }}
          >
            {/* Logo */}
            <div style={{ marginBottom: 10 }}>
              <img
                src={item.logo}
                alt={t(item.title)}
                style={{ maxWidth: 120, maxHeight: 40, objectFit: 'contain' }}
              />
            </div>
            {/* Intro image */}
            <div style={{ marginBottom: 10, height: 300, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={item.introImage}
                alt={t(item.title)}
                style={{ height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Title */}
            <div style={{ marginBottom: 10, fontSize: 24, fontWeight: 'bold' }}>{t(item.title)}</div>
            {/* Description */}
            <div style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.4 }}>{t(item.contents)}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
