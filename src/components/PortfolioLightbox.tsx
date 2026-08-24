'use client';

import React, { useEffect, useState } from 'react';
import { theme } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';

interface PortfolioLightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
}

const PortfolioLightbox = ({ images, index, onClose }: PortfolioLightboxProps) => {
  const isMobile = useIsMobile();
  const [current, setCurrent] = useState(index);

  const goPrev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % images.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(28, 15, 0, 0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        boxSizing: 'border-box',
        padding: isMobile ? '20px' : '40px',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: isMobile ? 12 : 24,
          right: isMobile ? 12 : 24,
          background: 'none',
          border: `1px solid ${theme.color.gold}`,
          color: theme.color.parchment,
          fontFamily: theme.font.serif,
          fontSize: 16,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label="닫기"
      >
        ×
      </button>

      {/* Image + arrows */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 12 : 24,
          maxWidth: '100%',
          maxHeight: '82vh',
        }}
      >
        {!isMobile && (
          <button onClick={goPrev} style={arrowStyle} aria-label="이전 이미지">
            ‹
          </button>
        )}

        <img
          src={images[current]}
          alt={`${current + 1} / ${images.length}`}
          style={{
            maxWidth: isMobile ? '100%' : '70vw',
            maxHeight: '82vh',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        {!isMobile && (
          <button onClick={goNext} style={arrowStyle} aria-label="다음 이미지">
            ›
          </button>
        )}
      </div>

      {/* Mobile arrows below image */}
      {isMobile && (
        <div style={{ display: 'flex', gap: 32, marginTop: 16 }} onClick={(e) => e.stopPropagation()}>
          <button onClick={goPrev} style={arrowStyle} aria-label="이전 이미지">
            ‹
          </button>
          <button onClick={goNext} style={arrowStyle} aria-label="다음 이미지">
            ›
          </button>
        </div>
      )}

      {/* Counter */}
      <p
        style={{
          margin: '16px 0 0 0',
          fontFamily: theme.font.serif,
          fontSize: 12,
          letterSpacing: '2px',
          color: theme.color.gold,
        }}
      >
        {current + 1} / {images.length}
      </p>
    </div>
  );
};

const arrowStyle: React.CSSProperties = {
  background: 'none',
  border: `1px solid ${theme.color.gold}`,
  color: theme.color.parchment,
  fontFamily: theme.font.serif,
  fontSize: 24,
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  cursor: 'pointer',
};

export default PortfolioLightbox;
