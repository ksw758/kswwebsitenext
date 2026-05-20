'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import { theme } from '@/src/const';
import GreekMeander from '@/src/components/GreekMeander';

const careerData: Record<string, Record<string, string[]>> = {
  '2026': { '5': ['career.events.2026_5_0'] },
  '2025': { '9': ['career.events.2025_9_0'], '5': ['career.events.2025_5_0'], '3': ['career.events.2025_3_0'] },
  '2024': { '9': ['career.events.2024_9_0'] },
  '2023': {
    '12': ['career.events.2023_12_0'],
    '9':  ['career.events.2023_9_0'],
    '4':  ['career.events.2023_4_0'],
    '2':  ['career.events.2023_2_0'],
  },
  '2022': {
    '11': ['career.events.2022_11_0'],
    '9':  ['career.events.2022_9_0'],
    '5':  ['career.events.2022_5_0'],
    '2':  ['career.events.2022_2_0'],
  },
  '2021': {
    '12': ['career.events.2021_12_0'],
    '9':  ['career.events.2021_9_0'],
    '1':  ['career.events.2021_1_0'],
  },
  '2020': {
    '8': ['career.events.2020_8_0'],
    '4': ['career.events.2020_4_0'],
    '3': ['career.events.2020_3_0'],
  },
  '2019': { '6': ['career.events.2019_6_0'], '5': ['career.events.2019_5_0'] },
  '2018': { '5': ['career.events.2018_5_0'], '1': ['career.events.2018_1_0'] },
  '2017': { '2': ['career.events.2017_2_0', 'career.events.2017_2_1'] },
  '2011': { '3': ['career.events.2011_3_0'] },
};

const Career = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const entries = Object.entries(careerData).reverse();

  const parallaxCard: React.CSSProperties = {
    backgroundImage: 'linear-gradient(rgba(10, 6, 1, 0.62), rgba(10, 6, 1, 0.62)), url("/images/aboutimage3.jpg")',
    backgroundAttachment: 'fixed',
    backgroundPosition: '50% 0',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: 4,
    padding: isMobile ? '20px 20px 20px 36px' : '24px 28px 24px 64px',
    marginBottom: 16,
    position: 'relative',
  };

  return (
    <section
      id="Career"
      style={{
        background: theme.color.parchment,
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
        경력 타임라인
      </p>

      {/* Meander accent */}
      <div style={{ width: 140, marginBottom: 22 }}>
        <GreekMeander id="gk-career-top" strokeColor={theme.color.gold} />
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
        Career
      </h2>

      {/* Timeline */}
      <div style={{ width: '100%', maxWidth: 720 }}>
        {entries.map(([year, months]) => (
          <div key={year} style={parallaxCard}>
            {/* Gold dot */}
            <div
              style={{
                position: 'absolute',
                top: 26,
                left: isMobile ? 12 : 26,
                width: 11,
                height: 11,
                borderRadius: '50%',
                border: `1.5px solid ${theme.color.gold}`,
                background: 'rgba(10, 6, 1, 0.8)',
              }}
            />

            {/* Year label */}
            <div
              style={{
                fontFamily: theme.font.serif,
                fontSize: isMobile ? 13 : 15,
                fontWeight: 700,
                color: theme.color.gold,
                letterSpacing: '2px',
                marginBottom: 12,
              }}
            >
              {year}{t('career.year')}
            </div>

            {/* Month rows */}
            {Object.entries(months)
              .reverse()
              .map(([month, keys], j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: 6,
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.font.serif,
                      fontSize: isMobile ? 11 : 12,
                      color: theme.color.gold,
                      letterSpacing: '1px',
                      flexShrink: 0,
                      width: isMobile ? 28 : 32,
                    }}
                  >
                    {month}{t('career.month')}
                  </span>
                  <div>
                    {keys.map((key, k) => (
                      <div
                        key={k}
                        style={{
                          fontFamily: theme.font.serif,
                          fontSize: isMobile ? 12 : 14,
                          color: theme.color.parchment,
                          lineHeight: 1.7,
                        }}
                      >
                        {t(key)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Bottom meander */}
      <div style={{ width: 140, marginTop: 40 }}>
        <GreekMeander id="gk-career-bottom" strokeColor={theme.color.gold} />
      </div>
    </section>
  );
};

export default Career;