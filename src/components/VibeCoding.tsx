'use client';

import React, { useState } from 'react';
import { theme } from '@/src/const';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import GreekMeander from '@/src/components/GreekMeander';

const categories = [
  {
    key: 'aws',
    tabLabel: 'AWS 장애대응 · 비용 최적화',
    eyebrow: 'AWS Infra Optimization',
    title: 'AWS 장애대응 · 비용 최적화',
    subtitle: '인프라 장애로 잠 못 이루셨나요?\n8년간 실서비스를 운영하며 다져온 노하우로 안정성과 비용을 동시에 잡아드립니다.',
    tags: ['EC2', 'RDS', '비용절감', '장애대응'],
    problems: [
      {
        icon: '01',
        title: '매달 나가는 AWS 비용, 왜 이렇게 큰지 모르시겠나요?',
        desc: '쓰지 않는 인스턴스, 방치된 스토리지가 비용을 갚아먹습니다. 전수 분석 없이는 어디서 새는지 알 수 없습니다.',
      },
      {
        icon: '02',
        title: '장애가 터지면 그때부터 발등에 불이 붙나요?',
        desc: '원인 파악부터 복구까지 골든타임을 놓치면 피해가 커집니다. 사전 모니터링과 즉각 대응 체계가 없으면 반복됩니다.',
      },
      {
        icon: '03',
        title: 'AWS 계정 정지 · 과다 청구, 혼자 해결하기 막막하시죠?',
        desc: 'AWS Support와의 협상, 이의제기 경험이 없으면 시간만 흐릅니다. 실전 대응 경험이 곧 해결 속도입니다.',
      },
    ],
    steps: [
      { num: '01', title: '인프라 현황 전달', desc: 'AWS 계정 접근 권한 또는 사용량 리포트를 공유해주시면 진단을 시작합니다.' },
      { num: '02', title: '비용 · 장애 진단 리포트', desc: '인스턴스 · 스토리지 · 트래픽 사용량과 장애 이력을 분석한 진단서를 전달드립니다.' },
      { num: '03', title: '최적화 및 대응 조치', desc: '유휴 리소스 정리, RI/Savings Plan 적용, 모니터링 · 알림 설정을 진행합니다.' },
      { num: '04', title: '운영 가이드 제공', desc: '재발 방지를 위한 모니터링 대응 매뉴얼과 이후 운영 가이드를 함께 제공합니다.' },
    ],
  },
  {
    key: 'vibecoding',
    tabLabel: '바이브코딩 최적화',
    eyebrow: 'Vibe Coding Optimization',
    title: '바이브코딩 최적화',
    subtitle: 'AI로 코딩은 하는데 결과물이 엉망인가요?\n노련한 개발자가 코드 구조부터 보안까지 다시 잡아드립니다.',
    tags: ['Cursor', 'React/Next.js', '보안점검', 'CI/CD'],
    problems: [
      {
        icon: '01',
        title: 'AI가 만든 코드, 왜 자꾸 망가질까요?',
        desc: '기능 하나 추가할 때마다 다른 곳이 깨지고, 같은 오류가 반복됩니다. 구조 없이 쌓인 코드는 AI도 고치기 어렵습니다.',
      },
      {
        icon: '02',
        title: '인증 · 보안 취약점, 그대로 두고 계신가요?',
        desc: '바이브코딩 결과물은 JWT 인증 누락, SQL Injection·XSS 같은 취약점이 자주 숨어 있습니다. 발견되기 전에 점검해야 합니다.',
      },
      {
        icon: '03',
        title: '6개월 후엔 손도 못 댈 수 있습니다',
        desc: '지금은 돌아가도, 스파게티 코드는 유지보수와 확장이 불가능해집니다. 나중에 다시 만드는 비용이 훨씬 큽니다.',
      },
    ],
    steps: [
      { num: '01', title: '소스코드 전달', desc: '현재 프로젝트의 소스코드를 공유해주시면 분석을 시작합니다.' },
      { num: '02', title: '구조 · 보안 진단 리포트', desc: '디렉토리 구조, 코드 스타일, 인증 · 보안 취약점을 정리한 진단서를 전달드립니다.' },
      { num: '03', title: '구조화 및 리팩토링', desc: '기능별 디렉토리 재구성, 보안 취약점 보완, 중복 제거 등 전면 정리를 진행합니다.' },
      { num: '04', title: '코드 스타일 가이드 제공', desc: '이후 AI와 협업할 때 일관성을 유지할 수 있는 가이드 문서를 함께 제공합니다.' },
    ],
  },
  {
    key: 'excel',
    tabLabel: '엑셀 · 업무 자동화',
    eyebrow: 'Excel Automation',
    title: '엑셀 · 업무 자동화',
    subtitle: '매번 손으로 정리하는 그 엑셀 작업,\nVBA · 파이썬 스크립트로 몇 분 안에 끝내드립니다.',
    tags: ['VBA', '파이썬', '데이터정리', '당일작업'],
    problems: [
      {
        icon: '01',
        title: '매일 똑같은 엑셀 작업에 시간을 뺏기고 있나요?',
        desc: '데이터 정렬, 서식 통일, 오류 체크까지 반복하다 보면 정작 중요한 일에 쓸 시간이 사라집니다.',
      },
      {
        icon: '02',
        title: '여러 부서 · 지점 파일을 손으로 취합하고 있나요?',
        desc: '파일마다 다른 양식을 일일이 맞추다 보면 실수가 생기고, 매번 처음부터 다시 해야 합니다.',
      },
      {
        icon: '03',
        title: '외부 시스템 데이터를 엑셀로 옮기는 데 지치셨나요?',
        desc: 'API · DB 데이터를 수동으로 복사-붙여넣기 하다 보면 실시간성도, 정확도도 떨어집니다.',
      },
    ],
    steps: [
      { num: '01', title: '현재 업무 방식 전달', desc: '반복하고 있는 작업과 사용 중인 엑셀 파일 양식을 공유해주시면 분석을 시작합니다.' },
      { num: '02', title: '자동화 범위 진단', desc: '매크로 · 스크립트로 대체 가능한 구간과 예상 절감 시간을 정리해 안내드립니다.' },
      { num: '03', title: '매크로 · 스크립트 제작', desc: 'VBA 매크로 또는 파이썬 스크립트로 반복 작업을 자동화합니다.' },
      { num: '04', title: '사용 가이드 제공', desc: '비개발자도 바로 쓸 수 있도록 실행 방법을 정리한 가이드를 함께 전달드립니다.' },
    ],
  },
];

const VibeCoding = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(0);
  const active = categories[activeTab];

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
        {active.eyebrow}
      </p>

      <div style={{ width: 140, marginBottom: 22 }}>
        <GreekMeander id="gk-vibe-top" strokeColor={theme.color.gold} />
      </div>

      <h2 style={{ margin: '0 0 12px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 20 : 30, fontWeight: 700, color: theme.color.sepia, textAlign: 'center', lineHeight: 1.6 }}>
        {active.title}
      </h2>
      <p style={{ margin: '0 0 24px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 12 : 15, color: `${theme.color.sepia}99`, textAlign: 'center', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
        {active.subtitle}
      </p>

      {/* 태그 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
        {active.tags.map((tag) => (
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

      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: isMobile ? 8 : 12, justifyContent: 'center', marginBottom: 12 }}>
        {categories.map((cat, i) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(i)}
            style={{
              padding: isMobile ? '8px 14px' : '10px 22px',
              borderRadius: 999,
              border: `1px solid ${i === activeTab ? theme.color.gold : `${theme.color.sepia}33`}`,
              background: i === activeTab ? theme.color.gold : 'transparent',
              color: i === activeTab ? theme.color.sepia : `${theme.color.sepia}99`,
              fontFamily: theme.font.serif,
              fontSize: isMobile ? 11 : 13,
              fontWeight: i === activeTab ? 700 : 400,
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 250ms ease',
            }}
          >
            {cat.tabLabel}
          </button>
        ))}
      </div>
      <p style={{ margin: '0 0 44px 0', fontFamily: theme.font.serif, fontSize: 11, color: `${theme.color.sepia}55`, textAlign: 'center' }}>
        탭을 눌러 다른 전문 분야를 확인해 보세요
      </p>

      {/* 문제 카드 3개 */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, width: '100%', maxWidth: 1000, marginBottom: 72 }}>
        {active.problems.map((p) => (
          <div
            key={p.title}
            style={{
              flex: 1,
              background: theme.color.sepia,
              padding: '28px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontFamily: theme.font.serif, fontSize: 13, letterSpacing: '3px', color: theme.color.gold, marginBottom: 14 }}>{p.icon}</div>
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
        {active.steps.map((step, i) => (
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
