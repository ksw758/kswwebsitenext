'use client';

import React from 'react';
import { theme } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import GreekMeander from '@/src/components/GreekMeander';

const problems = [
  {
    icon: '⚠',
    title: 'AI가 만든 코드, 왜 자꾸 망가질까요?',
    desc: '기능 하나 추가할 때마다 다른 곳이 깨지고, 같은 오류가 반복됩니다. 구조 없이 쌓인 코드는 AI도 고치기 어렵습니다.',
  },
  {
    icon: '⏱',
    title: '매번 AI에게 1시간씩 쓰고 계신가요?',
    desc: '처음부터 구조가 잡혀 있으면 같은 작업을 10분 안에 끝낼 수 있습니다. 반복되는 시간 낭비를 멈추세요.',
  },
  {
    icon: '🔒',
    title: '6개월 후엔 손도 못 댈 수 있습니다',
    desc: '지금은 돌아가도, 스파게티 코드는 유지보수와 확장이 불가능해집니다. 나중에 다시 만드는 비용이 훨씬 큽니다.',
  },
];

const steps = [
  { num: '01', title: '소스코드 전달', desc: '현재 프로젝트의 소스코드를 공유해주시면 분석을 시작합니다.' },
  { num: '02', title: '구조 진단 리포트', desc: '디렉토리 구조, 코드 스타일, 리팩토링 포인트를 정리한 진단서를 전달드립니다.' },
  { num: '03', title: '구조화 및 리팩토링', desc: '기능별 디렉토리 재구성, 코드 스타일 통일, 중복 제거 등 전면 정리를 진행합니다.' },
  { num: '04', title: '코드 스타일 가이드 제공', desc: '이후 AI와 협업할 때 일관성을 유지할 수 있는 가이드 문서를 함께 제공합니다.' },
];

const VibeCoding = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="VibeCoding"
      style={{
        background: theme.color.parchment,
        boxSizing: 'border-box',
        width: '100vw',
        padding: isMobile ? '60px 20px 72px' : '80px 40px 96px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 눈썹 */}
      <p style={{ margin: '0 0 14px 0', fontFamily: theme.font.serif, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: theme.color.gold }}>
        Vibe Coding Optimization
      </p>

      <div style={{ width: 140, marginBottom: 22 }}>
        <GreekMeander id="gk-vibe-top" strokeColor={theme.color.gold} />
      </div>

      <h2 style={{ margin: '0 0 12px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 20 : 30, fontWeight: 700, color: theme.color.sepia, textAlign: 'center', lineHeight: 1.6 }}>
        바이브코딩 최적화
      </h2>
      <p style={{ margin: '0 0 56px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 12 : 15, color: `${theme.color.sepia}99`, textAlign: 'center', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
        {'AI로 코딩은 하는데 결과물이 엉망인가요?\n노련한 개발자가 코드 구조부터 다시 잡아드립니다.'}
      </p>

      {/* 문제 카드 3개 */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, width: '100%', maxWidth: 1000, marginBottom: 72 }}>
        {problems.map((p) => (
          <div
            key={p.title}
            style={{
              flex: 1,
              background: theme.color.sepia,
              padding: '28px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontFamily: theme.font.serif, fontSize: 24, marginBottom: 14 }}>{p.icon}</div>
            <h3 style={{ margin: '0 0 10px 0', fontFamily: theme.font.serif, fontSize: 15, fontWeight: 700, color: theme.color.gold, lineHeight: 1.5 }}>
              {p.title}
            </h3>
            <p style={{ margin: 0, fontFamily: theme.font.serif, fontSize: 13, color: `${theme.color.parchment}AA`, lineHeight: 1.85 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 진행 과정 */}
      <p style={{ margin: '0 0 32px 0', fontFamily: theme.font.serif, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: theme.color.gold }}>
        진행 과정
      </p>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 0, width: '100%', maxWidth: 1000 }}>
        {steps.map((step, i) => (
          <div
            key={step.num}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '28px 20px',
              borderLeft: !isMobile && i > 0 ? `1px solid ${theme.color.gold}33` : 'none',
              borderTop: isMobile && i > 0 ? `1px solid ${theme.color.gold}33` : 'none',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              border: `1.5px solid ${theme.color.gold}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.font.serif, fontSize: 11, color: theme.color.gold,
              marginBottom: 14, flexShrink: 0,
            }}>
              {step.num}
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontFamily: theme.font.serif, fontSize: 14, fontWeight: 700, color: theme.color.sepia, textAlign: 'center' }}>
              {step.title}
            </h4>
            <div style={{ width: 24, height: 1, background: theme.color.gold, opacity: 0.5, margin: '0 auto 10px' }} />
            <p style={{ margin: 0, fontFamily: theme.font.serif, fontSize: 12, color: `${theme.color.sepia}99`, textAlign: 'center', lineHeight: 1.8 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{ width: 140, marginTop: 56 }}>
        <GreekMeander id="gk-vibe-bottom" strokeColor={theme.color.gold} />
      </div>
    </section>
  );
};

export default VibeCoding;
