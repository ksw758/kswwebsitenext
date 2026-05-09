'use client';

import React from 'react';
import { GithubIcon, LinkedInIcon, RocketPunchIcon } from '@/src/styles/svgs';
import { useIsMobile } from '@/src/hooks/useIsMobile';

const SOCIAL = [
  { Icon: GithubIcon,      url: 'https://github.com/ksw7581' },
  { Icon: LinkedInIcon,    url: 'https://www.linkedin.com/in/james-kim-41b4671b3/' },
  { Icon: RocketPunchIcon, url: 'https://www.rocketpunch.com/@b00b23e820f041a1' },
];

const ICON_SIZE = 72;
const ICON_SIZE_MOBILE = 36;

const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer
      style={{
        background: '#161617',
        boxSizing: 'border-box',
        width: '100vw',
        padding: isMobile ? '30px 20px' : '60px 40px',
        position: 'relative',
        display: isMobile ? 'flex' : 'block',
        alignItems: isMobile ? 'center' : undefined,
      }}
    >
      {/* Logo + info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          position: isMobile ? 'relative' : 'absolute',
          top: isMobile ? 'auto' : 75,
          left: isMobile ? 'auto' : 40,
          width: isMobile ? '60%' : 'auto',
        }}
      >
        <div style={{ width: 50, marginRight: 10, flexShrink: 0 }}>
          <img
            src="https://yt3.googleusercontent.com/ytc/AGIKgqMxDVi0Qw4sNfz9te4eDBBRXnugZzzlefHIZoE2-A=s176-c-k-c0x00ffffff-no-rj"
            alt="logo"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ color: 'white', paddingTop: 5 }}>
          <div style={{ marginBottom: 5, fontSize: isMobile ? 12 : 14 }}>
            2023-2025 All Rights Reserved. James Kim
          </div>
          <div style={{ fontSize: isMobile ? 12 : 14 }}>
            Email : ksw75811@gmail.com
          </div>
        </div>
      </div>

      {/* Social icons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isMobile ? '40%' : 600,
          margin: isMobile ? '0' : '0 auto',
        }}
      >
        {SOCIAL.map(({ Icon, url }, i) => (
          <div
            key={i}
            onClick={() => window.open(url, '_blank')}
            style={{
              cursor: 'pointer',
              marginRight: i < SOCIAL.length - 1 ? (isMobile ? 20 : 60) : 0,
              width: isMobile ? ICON_SIZE_MOBILE : ICON_SIZE,
              height: isMobile ? ICON_SIZE_MOBILE : ICON_SIZE,
              flexShrink: 0,
            }}
          >
            <Icon />
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
