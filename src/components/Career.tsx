'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/src/hooks/useIsMobile';

const careerData: Record<string, Record<string, string[]>> = {
  '2025': { '5': ['career.events.2025_5_0'], '3': ['career.events.2025_3_0'] },
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

  return (
    <section
      id="Career"
      style={{
        background: '#86868B',
        boxSizing: 'border-box',
        width: '100vw',
        padding: isMobile ? '30px 20px' : '60px 40px',
      }}
    >
      {/* ── Section title ── */}
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
        Career
      </div>

      {/* ── Cards wrapper ── */}
      <div style={{ width: isMobile ? '100%' : 960, margin: '0 auto' }}>
        {Object.entries(careerData)
          .reverse()
          .map(([year, months], i) => (
            <div
              key={i}
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: 20,
                borderRadius: 20,
                backgroundImage: 'url("/images/aboutimage2.jpg")',
                backgroundPosition: '50% 0px',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                color: 'white',
                marginBottom: 20,
              }}
            >
              {/* Year heading */}
              <div style={{ fontSize: isMobile ? 16 : 24, marginBottom: 5 }}>
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
                      fontSize: isMobile ? 12 : 18,
                      marginBottom: 5,
                    }}
                  >
                    <div style={{ width: 40, marginRight: 20, flexShrink: 0 }}>
                      {month}{t('career.month')}
                    </div>
                    <div>
                      {keys.map((key, k) => (
                        <div key={k}>{t(key)}</div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </section>
  );
};

export default Career;
