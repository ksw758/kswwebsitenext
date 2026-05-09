'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/src/hooks/useIsMobile';

const introImages = [
  '/images/aboutimage4.jpg',
  '/images/aboutimage.jpg',
  '/images/aboutimage3.jpg',
  '/images/aboutimage5.jpg',
];

const Main = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [slideIndex, setSlideIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1440);
  const imageSlide = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth || 1440);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!imageSlide.current) return;
      imageSlide.current.style.transitionDuration = '300ms';
      setSlideIndex((prev) => {
        const next = prev === introImages.length - 1 ? 0 : prev + 1;
        imageSlide.current!.style.transform = `translateX(${-(next * windowWidth)}px)`;
        return next;
      });
      setTimeout(() => {
        if (imageSlide.current) imageSlide.current.style.transitionDuration = '0ms';
      }, 300);
    }, 30000);
    return () => clearInterval(timer);
  }, [windowWidth]);

  const goToSlide = useCallback((index: number) => {
    if (!imageSlide.current) return;
    imageSlide.current.style.transitionDuration = '300ms';
    setSlideIndex(index);
    imageSlide.current.style.transform = `translateX(${-(index * windowWidth)}px)`;
    setTimeout(() => {
      if (imageSlide.current) imageSlide.current.style.transitionDuration = '0ms';
    }, 300);
  }, [windowWidth]);

  return (
    <section
      id="Home"
      style={{
        position: 'relative',
        width: '100vw',
        height: isMobile ? 470 : 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Slides strip */}
      <div
        ref={imageSlide}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          height: '100%',
          width: 'max-content',
        }}
      >
        {introImages.map((src, i) => (
          <div
            key={i}
            style={{
              width: windowWidth,
              minWidth: windowWidth,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={src}
              alt="intro"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        ))}
      </div>

      {/* Text overlay — bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? 20 : 40,
          left: isMobile ? 20 : 40,
          width: isMobile ? '60%' : 'auto',
        }}
      >
        {[
          t('main.intro.line1'),
          t('main.intro.line2'),
          t('main.intro.line3', { years: new Date().getFullYear() - 2017 + 1 }),
        ].map((line, i) => (
          <div
            key={i}
            style={{
              fontWeight: 300,
              fontSize: isMobile ? 14 : 24,
              color: 'white',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Dot indicators — bottom-right */}
      <div
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {introImages.map((_, i) => (
          <div
            key={i}
            onClick={() => goToSlide(i)}
            style={{
              width: isMobile ? 12 : 20,
              height: isMobile ? 12 : 20,
              borderRadius: '50%',
              margin: '5px 0',
              cursor: 'pointer',
              backgroundColor: i === slideIndex ? '#FFFFFF' : '#CECECE',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Main;
