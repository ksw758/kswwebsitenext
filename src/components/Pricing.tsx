'use client';

import React from 'react';
import { theme } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import GreekMeander from '@/src/components/GreekMeander';

const plans = [
  {
    title: '소개 페이지',
    period: '1~2주',
    price: '100만원~',
    desc: '기업·제품·서비스 소개용 단일 페이지. 반응형 디자인, 문의 폼 포함.',
    items: ['반응형 웹 디자인', '문의 폼 연동', '도메인·배포 설정', '기본 SEO 세팅'],
  },
  {
    title: '웹서비스 / 앱 MVP',
    period: '1~3개월',
    price: '500만원~',
    desc: '회원가입, 결제, API 연동 등 실제 서비스 운영이 가능한 MVP 개발.',
    items: ['웹 또는 iOS/Android 앱', '백엔드 API 설계·개발', '데이터베이스 설계', '스토어 출시 지원 (앱)'],
    highlight: true,
  },
  {
    title: '바이브코딩 최적화',
    period: '1주 내외',
    price: '50~150만원',
    desc: 'AI로 만든 코드의 구조를 정리하고 유지보수 가능한 상태로 개선.',
    items: ['소스코드 진단 리포트', '디렉토리 구조화', '리팩토링 및 코드 정리', '코드 스타일 가이드 제공'],
  },
  {
    title: '유지보수',
    period: '월 단위',
    price: '별도 협의',
    desc: '납품 후 운영 중 발생하는 버그 수정, 기능 추가, 서버 관리 등.',
    items: ['경미한 수정 무상 지원', '기능 추가·변경 월정액', '최소 1개월 단위 계약', '해지 14일 전 통보'],
  },
];

const Pricing = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="Pricing"
      style={{
        background: theme.color.sepia,
        boxSizing: 'border-box',
        width: '100vw',
        padding: isMobile ? '60px 20px 72px' : '80px 40px 96px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <p style={{ margin: '0 0 14px 0', fontFamily: theme.font.serif, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: theme.color.gold }}>
        서비스 요금 안내
      </p>

      <div style={{ width: 140, marginBottom: 22 }}>
        <GreekMeander id="gk-pricing-top" strokeColor={theme.color.gold} />
      </div>

      <h2 style={{ margin: '0 0 12px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 20 : 30, fontWeight: 700, color: theme.color.parchment, textAlign: 'center', lineHeight: 1.6 }}>
        Pricing
      </h2>
      <p style={{ margin: '0 0 56px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 12 : 14, color: `${theme.color.parchment}66`, textAlign: 'center', lineHeight: 1.9 }}>
        모든 금액은 부가세(VAT) 별도이며, 작업 범위에 따라 달라질 수 있습니다.
      </p>

      {/* 카드 그리드 */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: 20,
        width: '100%',
        maxWidth: 1100,
        justifyContent: 'center',
      }}>
        {plans.map((plan) => (
          <div
            key={plan.title}
            style={{
              flex: isMobile ? undefined : '1 1 220px',
              maxWidth: isMobile ? '100%' : 280,
              boxSizing: 'border-box',
              background: plan.highlight ? theme.color.gold : `${theme.color.parchment}0D`,
              border: `1px solid ${plan.highlight ? theme.color.gold : `${theme.color.gold}33`}`,
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {plan.highlight && (
              <p style={{ margin: '0 0 12px 0', fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '3px', color: theme.color.sepia, textTransform: 'uppercase' }}>
                인기
              </p>
            )}

            {/* 기간 */}
            <p style={{ margin: '0 0 8px 0', fontFamily: theme.font.serif, fontSize: 11, letterSpacing: '2px', color: plan.highlight ? theme.color.sepia : theme.color.gold }}>
              {plan.period}
            </p>

            {/* 제목 */}
            <h3 style={{ margin: '0 0 16px 0', fontFamily: theme.font.serif, fontSize: 18, fontWeight: 700, color: plan.highlight ? theme.color.sepia : theme.color.parchment, lineHeight: 1.4 }}>
              {plan.title}
            </h3>

            {/* 가격 */}
            <p style={{ margin: '0 0 16px 0', fontFamily: theme.font.serif, fontSize: 22, fontWeight: 700, color: plan.highlight ? theme.color.sepia : theme.color.gold }}>
              {plan.price}
            </p>

            {/* 구분선 */}
            <div style={{ width: '100%', height: 1, background: plan.highlight ? `${theme.color.sepia}33` : `${theme.color.gold}33`, marginBottom: 16 }} />

            {/* 설명 */}
            <p style={{ margin: '0 0 20px 0', fontFamily: theme.font.serif, fontSize: 12, color: plan.highlight ? theme.color.sepia : `${theme.color.parchment}88`, lineHeight: 1.8 }}>
              {plan.desc}
            </p>

            {/* 포함 항목 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
              {plan.items.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: plan.highlight ? theme.color.sepia : theme.color.gold, fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontFamily: theme.font.serif, fontSize: 12, color: plan.highlight ? theme.color.sepia : `${theme.color.parchment}99`, lineHeight: 1.6 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 안내 */}
      <p style={{ margin: '48px 0 0 0', fontFamily: theme.font.serif, fontSize: 12, color: `${theme.color.parchment}55`, textAlign: 'center', lineHeight: 1.9 }}>
        정확한 견적은 요구사항 확인 후 안내드립니다. 먼저 부담 없이 문의해 주세요.
      </p>

      <div style={{ width: 140, marginTop: 40 }}>
        <GreekMeander id="gk-pricing-bottom" strokeColor={theme.color.gold} />
      </div>
    </section>
  );
};

export default Pricing;
