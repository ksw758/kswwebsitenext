'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@store/languageStore';
import { useIsMobile } from '@/src/hooks/useIsMobile';

const NAV_ITEMS = ['Home', 'Career', 'Portfolio', 'Skills'] as const;

const Header = () => {
  useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  const [isScrolled, setIsScrolled] = useState(false);
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
        opacity: 0.7,
        transition: 'background 0.3s',
        background: isScrolled ? '#FFFFFF' : '#161617',
      }}
    >
      {/* Logo */}
      <div style={{ position: 'absolute', top: 10, left: 40, width: 50 }}>
        <img
          src="https://yt3.googleusercontent.com/ytc/AGIKgqMxDVi0Qw4sNfz9te4eDBBRXnugZzzlefHIZoE2-A=s176-c-k-c0x00ffffff-no-rj"
          alt="logo"
          style={{ width: '100%' }}
        />
      </div>

      {/* Nav — desktop only */}
      {!isMobile && (
        <nav style={{ position: 'absolute', top: 28, right: 70, display: 'flex', alignItems: 'center' }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              onClick={() => moveScroll(item)}
              style={{
                padding: '0 30px',
                fontWeight: 700,
                fontSize: 28,
                lineHeight: '20px',
                cursor: 'pointer',
                textDecoration: 'none',
                color: isScrolled ? '#161617' : '#FFFFFF',
                userSelect: 'none',
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      )}

      {/* Language toggle */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <button
          onClick={toggleLanguage}
          style={{
            background: 'transparent',
            height: 30,
            padding: '0 16px',
            borderRadius: 4,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.3s',
            border: `1px solid ${isScrolled ? '#161617' : '#FFFFFF'}`,
            color: isScrolled ? '#161617' : '#FFFFFF',
          }}
        >
          {language === 'ko' ? 'EN' : 'KO'}
        </button>
      </div>
    </header>
  );
};

export default Header;
