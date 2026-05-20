'use client';

import React from 'react';
import { theme } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import GreekMeander from '@/src/components/GreekMeander';

const steps = [
  {
    number: '01',
    title: '무료 상담',
    description: '요구사항 가능여부, 예산 책정, 작업 기간 산정',
    image: '/images/MainSecondSection/process1.png',
  },
  {
    number: '02',
    title: '기획 및 설계',
    description: '사이트맵, 화면 구성, 기술 스택 확정',
    image: '/images/MainSecondSection/process2.png',
  },
  {
    number: '03',
    title: '개발',
    description: '프론트엔드·백엔드·DB 구축',
    image: '/images/MainSecondSection/process3.png',
  },
  {
    number: '04',
    title: '검수 및 피드백',
    description: '테스트, 수정, 최종 확인',
    image: '/images/MainSecondSection/process4.png',
  },
  {
    number: '05',
    title: '배포 및 유지보수',
    description: '런칭 후 안정적인 운영 지원',
    image: '/images/MainSecondSection/process5.png',
  },
];

const Processing = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="Processing"
      style={{
        background: theme.color.parchment,
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
        외주 프로젝트 진행 과정
      </p>

      {/* Meander accent */}
      <div style={{ width: 140, marginBottom: 22 }}>
        <GreekMeander id="gk-proc-top" strokeColor={theme.color.gold} />
      </div>

      {/* Title */}
      <h2
        style={{
          margin: '0 0 60px 0',
          fontFamily: theme.font.serif,
          fontSize: isMobile ? 20 : 30,
          fontWeight: 700,
          color: theme.color.sepia,
          textAlign: 'center',
          maxWidth: 680,
          lineHeight: 1.6,
          letterSpacing: '0.3px',
        }}
      >
        효율적인 시스템 구축으로
        <br />
        최상의 사용자 경험을 제공합니다.
      </h2>

      {/* ── Desktop: flex row ── Mobile: block (vertical stack) ── */}
      <div
        style={
          isMobile
            ? { display: 'block', width: '100%', maxWidth: 480 }
            : {
                display: 'flex',
                gap: 8,
                width: '100%',
                maxWidth: 1400,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }
        }
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>

            {/* ── Card ── */}
            {isMobile ? (
              /* Mobile card: vertical (image top, text bottom) */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {/* Image — full width, natural ratio */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.title}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />

                {/* Step number bubble */}
                <div
                  style={{
                    marginTop: 16,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    border: `1.5px solid ${theme.color.gold}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.color.gold,
                    fontFamily: theme.font.serif,
                    fontSize: 9,
                    letterSpacing: '1px',
                    background: theme.color.parchment,
                  }}
                >
                  {step.number}
                </div>

                <h3
                  style={{
                    margin: '10px 0 0 0',
                    fontFamily: theme.font.serif,
                    fontSize: 15,
                    fontWeight: 700,
                    color: theme.color.sepia,
                    textAlign: 'center',
                    letterSpacing: '0.3px',
                  }}
                >
                  {step.title}
                </h3>

                <div
                  style={{
                    margin: '8px auto',
                    width: 24,
                    height: 1,
                    background: theme.color.gold,
                    opacity: 0.55,
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    fontFamily: theme.font.serif,
                    fontSize: 12,
                    color: `${theme.color.sepia}AA`,
                    textAlign: 'center',
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ) : (
              /* Desktop card: vertical column */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: '1 1 0',
                  minWidth: 0,
                }}
              >
                {/* Arch image — desktop: natural 582×914 ratio, no clipping */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.title}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />

                {/* Step number bubble */}
                <div
                  style={{
                    marginTop: 16,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: `1.5px solid ${theme.color.gold}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.color.gold,
                    fontFamily: theme.font.serif,
                    fontSize: 10,
                    letterSpacing: '1px',
                    flexShrink: 0,
                    background: theme.color.parchment,
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3
                  style={{
                    margin: '10px 0 0 0',
                    fontFamily: theme.font.serif,
                    fontSize: 15,
                    fontWeight: 700,
                    color: theme.color.sepia,
                    textAlign: 'center',
                    letterSpacing: '0.3px',
                  }}
                >
                  {step.title}
                </h3>

                {/* Gold rule */}
                <div
                  style={{
                    margin: '8px auto',
                    width: 28,
                    height: 1,
                    background: theme.color.gold,
                    opacity: 0.55,
                  }}
                />

                {/* Description */}
                <p
                  style={{
                    margin: 0,
                    fontFamily: theme.font.serif,
                    fontSize: 12,
                    color: `${theme.color.sepia}AA`,
                    textAlign: 'center',
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </div>
            )}

            {/* Connector — desktop: › arrow / mobile: vertical divider line */}
            {index < steps.length - 1 && (
              isMobile ? null : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: 'calc(13.5% - 11px)',
                    color: theme.color.gold,
                    fontSize: 22,
                    opacity: 0.5,
                    flexShrink: 0,
                    userSelect: 'none',
                    lineHeight: 1,
                  }}
                >
                  ›
                </div>
              )
            )}

          </React.Fragment>
        ))}
      </div>

      {/* Bottom meander */}
      <div style={{ width: 140, marginTop: 56 }}>
        <GreekMeander id="gk-proc-bottom" strokeColor={theme.color.gold} />
      </div>
    </section>
  );
};

export default Processing;