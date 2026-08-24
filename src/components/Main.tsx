'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import { theme } from '@/src/const';
import GreekMeander from '@/src/components/GreekMeander';

const slides = [
  {
    image: '/images/MainFirstSection/Parthenon._Photo_taken_in_2023.jpg',
    title: '기초가 비즈니스를 결정합니다',
    subtitle:
      '홈페이지는 하나의 건물과 같습니다.\n대충 지어진 건물은 쉽게 흔들리고, 완성 후에도 끊임없이 손이 갑니다.\n반면 처음부터 기초를 탄탄히 세운 건물은 오랫동안 제 역할을 해냅니다.\n9년 이상의 홈페이지 설계 및 구축 노하우를 바탕으로, 처음부터 제대로 지어진 홈페이지를 만들어드립니다.',
  },
  {
    image: '/images/MainFirstSection/Death-of-Socrates-canvas-Jacques-Louis-David-New-1787.webp',
    title: '웹개발 뿐만 아니라 앱 출시도 문제없어요!',
    subtitle:
      '앱 시장의 주도권은 여전히 애플과 구글이 쥐고 있습니다.\n출시하려면 그들의 배포 정책을 확인하고 요구하는 가이드라인을 반드시 통과해야 시장에 내놓을 수 있고 업데이트를 할 수 있습니다.\nReact Native 기반으로 4개 이상의 Android, iOS 앱을 직접 심사 통과시키고 배포까지 해봤습니다.\n출시 과정이 막막하게 느껴지신다면, 그 부분까지 제가 책임지겠습니다.',
  },
  {
    image: '/images/MainFirstSection/_The_School_of_Athens__by_Raffaello_Sanzio_da_Urbino.jpg',
    title: '바이브코딩은 이제 선택이 아닌 필수!',
    subtitle:
      '시대는 빠르게 격변하고 있고, 전통 방식을 고수하는 개발자들도 바이브코딩을 택한 개발자의 속도를 따라가기 어렵습니다.\n이제 누구나 바이브코딩으로 프로젝트 하나쯤은 만들 수 있는 시대가 왔습니다. 하지만 노련한 개발자는 방대한 레퍼런스를 바탕으로,\n같은 AI를 쓰더라도 훨씬 적은 비용과 시간으로 완성도 높은 결과물을 만들어냅니다.',
  },
  {
    image: '/images/MainFirstSection/British_Museum_-_Four_Greek_philosophers.jpg',
    title: '반복되는 내 일, 컴퓨터한테 맡겨버리세요',
    subtitle:
      '누군가가 내 일을 대신해준다면 그만큼 더 중요한 일에 집중할 수 있습니다. 하지만 사람을 쓰면 그게 곧 비용이 됩니다.\n반복적인 작업을 자동화하면 그 비용까지 아낄 수 있습니다. 웹 크롤링, 스케줄링을 통한 일정 관리, 자동 메신저 발송,\n실시간 예약 시스템까지 전부 만들어드립니다.',
  },
];

const SLIDE_INTERVAL_MS = 7000;
const TRANSITION_MS = 500;

const Main = () => {
  const isMobile = useIsMobile();
  const [slideIndex, setSlideIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1440);
  const imageSlide = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth || 1440);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (!imageSlide.current) return;
      currentIndexRef.current = index;
      setTextVisible(false);
      setTimeout(() => {
        if (!imageSlide.current) return;
        imageSlide.current.style.transitionDuration = `${TRANSITION_MS}ms`;
        imageSlide.current.style.transform = `translateX(${-(index * windowWidth)}px)`;
        setSlideIndex(index);
        setTimeout(() => {
          if (imageSlide.current) imageSlide.current.style.transitionDuration = '0ms';
          setTextVisible(true);
        }, TRANSITION_MS);
      }, 200);
    },
    [windowWidth],
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next =
        currentIndexRef.current === slides.length - 1 ? 0 : currentIndexRef.current + 1;
      goToSlide(next);
    }, SLIDE_INTERVAL_MS);
  }, [goToSlide]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleDotClick = (index: number) => {
    goToSlide(index);
    startTimer();
  };

  const sectionHeight = isMobile ? 500 : 800;

  return (
    <section
      id="Home"
      style={{
        position: 'relative',
        width: '100vw',
        height: sectionHeight,
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
        {slides.map((slide, i) => (
          <div key={i} style={{ width: windowWidth, minWidth: windowWidth, height: '100%' }}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        ))}
      </div>

      {/* Warm sepia gradient overlay — matches heroBg tone */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom,
            rgba(10,6,1,0.08) 0%,
            rgba(10,6,1,0.48) 50%,
            rgba(10,6,1,0.80) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Text overlay — bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? 60 : 80,
          left: isMobile ? 20 : 60,
          right: isMobile ? 16 : '28%',
          opacity: textVisible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      >
        <h2
          style={{
            margin: '0 0 14px 0',
            fontFamily: theme.font.serif,
            fontWeight: 700,
            fontSize: isMobile ? 18 : 34,
            color: theme.color.parchment,
            lineHeight: 1.35,
            letterSpacing: isMobile ? '0.3px' : '0.8px',
          }}
        >
          {slides[slideIndex].title}
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: theme.font.serif,
            fontWeight: 300,
            fontSize: isMobile ? 11 : 15,
            color: `${theme.color.parchment}CC`, /* CC = 80% opacity */
            lineHeight: 1.85,
            whiteSpace: 'pre-line',
            letterSpacing: '0.3px',
          }}
        >
          {slides[slideIndex].subtitle}
        </p>

        {/* CTA 버튼 */}
        <button
          onClick={() => {
            const el = document.getElementById('Contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            marginTop: isMobile ? 20 : 28,
            padding: isMobile ? '10px 24px' : '13px 32px',
            minHeight: isMobile ? 44 : undefined,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: theme.font.serif,
            fontSize: isMobile ? 11 : 13,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: theme.color.sepia,
            background: theme.color.gold,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          무료 상담 문의
        </button>
      </div>

      {/* Dot indicators — bottom-right */}
      <div
        style={{
          position: 'absolute',
          right: 34,
          bottom: 44,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            aria-label={`슬라이드 ${i + 1}`}
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span
              style={{
                width: isMobile ? 10 : 14,
                height: isMobile ? 10 : 14,
                borderRadius: '50%',
                display: 'block',
                backgroundColor: i === slideIndex ? theme.color.gold : theme.color.goldFaded,
                transition: 'background-color 300ms ease',
              }}
            />
          </button>
        ))}
      </div>

      {/* Greek meander strip at the bottom edge — mirrors the header */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <GreekMeander id="gk-main" strokeColor={theme.color.goldFaded} />
      </div>
    </section>
  );
};

export default Main;
