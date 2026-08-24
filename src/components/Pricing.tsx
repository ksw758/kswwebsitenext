'use client';

import React, { useState } from 'react';
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
    title: '유지보수',
    period: '월 단위',
    price: '별도 협의',
    desc: '납품 후 운영 중 발생하는 버그 수정, 기능 추가, 서버 관리 등.',
    items: ['경미한 수정 무상 지원', '기능 추가·변경 월정액', '최소 1개월 단위 계약', '해지 14일 전 통보'],
  },
];

type Tier = {
  badge: string;
  grade: string;
  level: string;
  price: number;
  tagline: string;
  bullets: string[];
  highlight?: boolean;
  footnote?: string;
};

type TechService = {
  category: string;
  subtitle: string;
  tags: string[];
  note?: string;
  tiers: Tier[];
};

const techServices: TechService[] = [
  {
    category: 'AWS 장애대응 · 비용 최적화',
    subtitle: '8년 실무 운영 경험 · EC2 · S3 · RDS · Route53',
    tags: ['EC2', 'RDS', '비용절감', '장애대응'],
    tiers: [
      {
        badge: 'STANDARD',
        grade: 'BASIC',
        level: '비용 진단',
        price: 100000,
        tagline: '숨은 낭비를 찾아내는 AWS 비용 진단',
        bullets: ['인스턴스·스토리지·트래픽 사용량 전수 분석', '불필요한 리소스 및 유휴 자원 식별', '즉시 적용 가능한 절감안 리포트 제공'],
        footnote: '8년간 실서비스 운영 경험 기반의 실전형 진단입니다',
      },
      {
        badge: 'DELUXE',
        grade: 'ADVANCED',
        level: '장애 대응',
        price: 250000,
        highlight: true,
        tagline: '장애를 막고 반복을 끊어내는 대응',
        bullets: ['장애 원인 분석 및 긴급 대응 조치', '재발 방지를 위한 모니터링·알림 설정', 'AWS 계정 정지·이상 청구 대응 실전 경험 보유'],
        footnote: '계정 정지 해제, 수천만원 단위 청구 이의제기 및 환불 대응 경험',
      },
      {
        badge: 'PREMIUM',
        grade: 'EXPERT',
        level: '전체 최적화',
        price: 500000,
        tagline: '인프라 전체 점검 + 구조적 비용 최적화',
        bullets: ['RI · Savings Plan 적용으로 고정비 절감', 'CloudWatch 기반 상시 모니터링 세팅', 'AWS Support 에스컬레이션 노하우로 신속 대응'],
        footnote: 'AWS Support와의 직접 협상 · 환불 대응 경험을 그대로 적용합니다',
      },
    ],
  },
  {
    category: '엑셀 · 업무 자동화',
    subtitle: '엑셀 매크로 · 파이썬 스크립트 · 당일 대응',
    tags: ['VBA', '파이썬', '데이터정리', '당일작업'],
    note: '당일 처리가 필요한 급한 작업은 별도 문의 가능',
    tiers: [
      {
        badge: 'STANDARD',
        grade: 'BASIC',
        level: '초급 · 간단 매크로',
        price: 30000,
        tagline: '단일 파일 내 반복작업 자동화',
        bullets: ['매일 반복하는 매출 데이터 정렬 자동화', '여러 시트 서식(색상·테두리) 일괄 통일', '입력값 오류·중복 데이터 자동 하이라이트'],
      },
      {
        badge: 'DELUXE',
        grade: 'ADVANCED',
        level: '중급 · 복합 스크립트',
        price: 70000,
        highlight: true,
        tagline: '여러 파일 취합, 데이터 정리, 조건부 처리',
        bullets: ['여러 지점/부서 엑셀 파일 하나로 자동 취합', '조건별 데이터 자동 분류 및 집계표 생성', '월간·주간 리포트 자동 작성'],
      },
      {
        badge: 'PREMIUM',
        grade: 'EXPERT',
        level: '고급 · API 연동',
        price: 150000,
        tagline: '외부 API/DB 연동 포함한 고급 자동화',
        bullets: ['외부 API 데이터 자동 수집 및 실시간 업데이트', 'DB와 엑셀 양방향 동기화 스크립트', '매일 지정 시간 자동 실행(스케줄링) 설정'],
      },
    ],
  },
  {
    category: '바이브코딩 코드 최적화',
    subtitle: '코드 리뷰 · 리팩토링 · 배포 지원',
    tags: ['Cursor', 'React/Next.js', '보안점검', 'CI/CD'],
    tiers: [
      {
        badge: 'STANDARD',
        grade: 'BASIC',
        level: '초급 · 코드 리뷰+정리',
        price: 150000,
        tagline: '코드 구조 진단 및 경미한 정리',
        bullets: ['폴더 구조·네이밍 컨벤션 진단 리포트', '불필요한 코드·중복 로직 정리', 'JWT AuthGuard 등 인증 누락 여부 기본 점검'],
        footnote: '바이브코딩 특성상 자주 누락되는 인증/보안 요소는 기본 점검에 포함됩니다',
      },
      {
        badge: 'DELUXE',
        grade: 'ADVANCED',
        level: '중급 · 구조 리팩토링',
        price: 400000,
        highlight: true,
        tagline: '주요 모듈 리팩토링 및 보안 점검',
        bullets: ['핵심 API·상태관리 구조 리팩토링', 'JWT AuthGuard 등 인증/인가 누락 점검 및 보완', 'SQL Injection·XSS 등 주요 취약점 점검'],
      },
      {
        badge: 'PREMIUM',
        grade: 'EXPERT',
        level: '고급 · 배포+CI/CD',
        price: 800000,
        tagline: '전체 리팩토링 및 배포 파이프라인 구축',
        bullets: ['전체 코드베이스 리팩토링 + 배포 자동화', '인증·보안 취약점 전수 점검(JWT AuthGuard 포함)', 'CI/CD, 모니터링·로깅 세팅'],
      },
    ],
  },
];

const categoryLabels = ['웹 / 앱 개발', ...techServices.map((service) => service.category)];

const Pricing = () => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState(0);
  const activeService = activeCategory > 0 ? techServices[activeCategory - 1] : null;

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
      <p style={{ margin: '0 0 32px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 12 : 14, color: `${theme.color.parchment}66`, textAlign: 'center', lineHeight: 1.9 }}>
        모든 금액은 부가세(VAT) 별도이며, 작업 범위에 따라 달라질 수 있습니다.
      </p>

      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: isMobile ? 8 : 12, justifyContent: 'center', marginBottom: 36 }}>
        {categoryLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveCategory(i)}
            style={{
              padding: isMobile ? '8px 14px' : '10px 22px',
              minHeight: isMobile ? 44 : undefined,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              border: `1px solid ${i === activeCategory ? theme.color.gold : `${theme.color.gold}44`}`,
              background: i === activeCategory ? theme.color.gold : 'transparent',
              color: i === activeCategory ? theme.color.sepia : `${theme.color.parchment}bb`,
              fontFamily: theme.font.serif,
              fontSize: isMobile ? 11 : 13,
              fontWeight: i === activeCategory ? 700 : 400,
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 250ms ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <p style={{ margin: '-12px 0 32px 0', fontFamily: theme.font.serif, fontSize: 11, color: `${theme.color.parchment}55`, textAlign: 'center' }}>
        탭을 눌러 다른 서비스의 가격을 확인해 보세요
      </p>

      {/* 웹/앱 개발 */}
      {activeCategory === 0 && (
        <>
          <p style={{ margin: '0 0 20px 0', fontFamily: theme.font.serif, fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase', color: theme.color.gold, opacity: 0.85, width: '100%', maxWidth: 1100, textAlign: isMobile ? 'center' : 'left' }}>
            웹 / 앱 개발
          </p>

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
        </>
      )}

      {/* 크몽 기술 서비스 3종 (선택된 카테고리만 표시) */}
      {activeService && (
        <div style={{ width: '100%', maxWidth: 1100 }}>
          {/* 카테고리 헤더 */}
          <h3 style={{ margin: '0 0 6px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 16 : 20, fontWeight: 700, color: theme.color.gold, textAlign: isMobile ? 'center' : 'left' }}>
            {activeService.category}
          </h3>
          <p style={{ margin: '0 0 14px 0', fontFamily: theme.font.serif, fontSize: 12, color: `${theme.color.parchment}77`, textAlign: isMobile ? 'center' : 'left' }}>
            {activeService.subtitle}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: activeService.note ? 12 : 24, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {activeService.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: theme.font.serif,
                  fontSize: 10,
                  letterSpacing: '1px',
                  color: theme.color.gold,
                  border: `1px solid ${theme.color.gold}`,
                  padding: '2px 8px',
                  opacity: 0.85,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          {activeService.note && (
            <p style={{
              margin: '0 0 24px 0',
              fontFamily: theme.font.serif,
              fontSize: 12,
              color: theme.color.parchment,
              lineHeight: 1.8,
              textAlign: isMobile ? 'center' : 'left',
              borderLeft: isMobile ? 'none' : `2px solid ${theme.color.gold}`,
              paddingLeft: isMobile ? 0 : 12,
            }}>
              {activeService.note}
            </p>
          )}

          {/* 3단계 티어 카드 */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: 20,
            width: '100%',
            justifyContent: 'center',
          }}>
            {activeService.tiers.map((tier) => (
              <div
                key={tier.badge}
                style={{
                  flex: isMobile ? undefined : '1 1 220px',
                  maxWidth: isMobile ? '100%' : 340,
                  boxSizing: 'border-box',
                  background: tier.highlight ? theme.color.gold : `${theme.color.parchment}0D`,
                  border: `1px solid ${tier.highlight ? theme.color.gold : `${theme.color.gold}33`}`,
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {tier.highlight && (
                  <p style={{ margin: '0 0 12px 0', fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '3px', color: theme.color.sepia, textTransform: 'uppercase' }}>
                    인기
                  </p>
                )}

                {/* 패키지 배지 */}
                <p style={{ margin: '0 0 8px 0', fontFamily: theme.font.serif, fontSize: 10, letterSpacing: '2px', color: tier.highlight ? theme.color.sepia : theme.color.gold, textTransform: 'uppercase' }}>
                  {tier.badge} PACKAGE
                </p>

                {/* 등급명 */}
                <h4 style={{ margin: '0 0 4px 0', fontFamily: theme.font.serif, fontSize: 22, fontWeight: 700, color: tier.highlight ? theme.color.sepia : theme.color.parchment }}>
                  {tier.grade}
                </h4>

                {/* 레벨 */}
                <p style={{ margin: '0 0 16px 0', fontFamily: theme.font.serif, fontSize: 12, color: tier.highlight ? `${theme.color.sepia}bb` : theme.color.gold }}>
                  {tier.level}
                </p>

                {/* 가격 */}
                <p style={{ margin: '0 0 16px 0', fontFamily: theme.font.serif, fontSize: 20, fontWeight: 700, color: tier.highlight ? theme.color.sepia : theme.color.gold }}>
                  {tier.price.toLocaleString('ko-KR')}원~
                </p>

                {/* 구분선 */}
                <div style={{ width: '100%', height: 1, background: tier.highlight ? `${theme.color.sepia}33` : `${theme.color.gold}33`, marginBottom: 16 }} />

                {/* 태그라인 */}
                <p style={{ margin: '0 0 16px 0', fontFamily: theme.font.serif, fontSize: 13, fontWeight: 700, color: tier.highlight ? theme.color.sepia : theme.color.parchment, lineHeight: 1.6 }}>
                  {tier.tagline}
                </p>

                {/* 불릿 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: tier.footnote ? 16 : 0 }}>
                  {tier.bullets.map((bullet) => (
                    <div key={bullet} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: tier.highlight ? theme.color.sepia : theme.color.gold, fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontFamily: theme.font.serif, fontSize: 12, color: tier.highlight ? theme.color.sepia : `${theme.color.parchment}99`, lineHeight: 1.6 }}>
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 각주 */}
                {tier.footnote && (
                  <p style={{ margin: 'auto 0 0 0', paddingTop: 12, fontFamily: theme.font.serif, fontSize: 11, fontStyle: 'italic', color: tier.highlight ? `${theme.color.sepia}99` : `${theme.color.parchment}66`, lineHeight: 1.6 }}>
                    ※ {tier.footnote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
