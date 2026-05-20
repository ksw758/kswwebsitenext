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
          KSW
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
          width: isMobile ? 160 : 240,
          height: 1,
          background: theme.color.gold,
          opacity: 0.3,
          marginBottom: 20,
        }}
      />

      {/* Info text */}
      <p
        style={{
          margin: '0 0 6px 0',
          fontFamily: theme.font.serif,
          fontSize: 11,
          letterSpacing: '1.5px',
          color: `${theme.color.parchment}99`,
          textAlign: 'center',
        }}
      >
        ksw75811@gmail.com
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: theme.font.serif,
          fontSize: 10,
          letterSpacing: '1px',
          color: `${theme.color.parchment}55`,
          textAlign: 'center',
        }}
      >
        © 2023–2026 James Kim · All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
