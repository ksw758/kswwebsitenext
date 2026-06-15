'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@store/languageStore';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import { theme } from '@/src/const';
import GreekMeander from '@/src/components/GreekMeander';

const NAV_ITEMS = ['Home', 'Processing', 'Portfolio', 'Career', 'Contact'] as const;

const Header = () => {
  useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const moveScroll = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  }, []);

  const textColor = isScrolled ? theme.color.sepia : theme.color.parchment;
  const goldColor = isScrolled ? theme.color.gold : theme.color.goldFaded;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        maxWidth: 1920,
        margin: '0 auto',
        width: '100%',
        height: 80,
        background: isScrolled ? theme.color.parchment : theme.color.heroBg,
        transition: 'background 0.4s ease',
        fontFamily: theme.font.serif,
        boxSizing: 'border-box',
      }}
    >
      {/* Logo + wordmark */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 32,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <img
          src="/images/logo.svg"
          alt="상원(SW)에이전츠 로고"
          style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
        />
        {!isMobile && (
          <>
            <div style={{ width: 1, height: 28, background: goldColor, opacity: 0.7 }} />
            <span
              style={{
                fontSize: 10,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: goldColor,
                fontFamily: theme.font.serif,
                fontWeight: 400,
              }}
            >
              상원(SW)에이전츠
            </span>
          </>
        )}
      </div>

      {/* Nav — desktop */}
      {!isMobile && (
        <nav
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {NAV_ITEMS.map((item, index) => (
            <React.Fragment key={item}>
              {index > 0 && (
                <span style={{ color: goldColor, fontSize: 8, opacity: 0.8, margin: '0 4px' }}>
                  ◆
                </span>
              )}
              <a
                onClick={() => moveScroll(item)}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  position: 'relative',
                  padding: '0 18px',
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: '3.5px',
                  textTransform: 'uppercase',
                  fontFamily: theme.font.serif,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: hoveredItem === item ? goldColor : textColor,
                  userSelect: 'none',
                  transition: 'color 0.25s ease',
                  lineHeight: '20px',
                }}
              >
                {item}
                <span
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: hoveredItem === item ? 'calc(100% - 36px)' : '0%',
                    height: 1,
                    background: goldColor,
                    transition: 'width 0.2s ease',
                    display: 'block',
                  }}
                />
              </a>
            </React.Fragment>
          ))}
        </nav>
      )}
      {/* Greek meander border at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <GreekMeander id="gk-header" strokeColor={goldColor} />
      </div>
    </header>
  );
};

export default Header;
