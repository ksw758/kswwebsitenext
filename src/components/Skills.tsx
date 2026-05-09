'use client';

import React from 'react';
import { MySkills } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';

const Skills = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="Skills"
      style={{
        background: '#1D1D1F',
        boxSizing: 'border-box',
        width: '100vw',
        padding: isMobile ? '30px 20px' : '60px 40px',
      }}
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
        Skills
      </div>

      {/* Icon grid */}
      <div>
        {Object.entries(MySkills).map(([, value], i) => (
          <div key={i} style={{ display: 'inline-block', marginBottom: isMobile ? 0 : 10 }}>
            {Object.entries(value).map(([key2, value2], j) => (
              <div
                key={j}
                onClick={() => window.open(value2.url, '_blank')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  borderRadius: 20,
                  cursor: 'pointer',
                  padding: 20,
                  marginRight: 10,
                  marginBottom: 10,
                  width: isMobile ? 60 : 80,
                  height: isMobile ? 60 : 80,
                  verticalAlign: 'top',
                  boxSizing: 'border-box',
                }}
              >
                <img src={`/images/skills/${key2}.png`} alt={key2} style={{ width: '100%' }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
