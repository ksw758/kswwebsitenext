import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '개인정보 처리방침 | 상원(SW)에이전츠',
  description: '상원(SW)에이전츠 개인정보 처리방침',
};

const section = (title: string, children: React.ReactNode) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C1A0E' }}>{title}</h2>
    <div style={{ fontSize: 14, lineHeight: 1.9, color: '#4A3728' }}>{children}</div>
  </div>
);

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px', fontFamily: 'Georgia, serif' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 48, borderBottom: '1px solid #C9A84C44', paddingBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>
          상원(SW)에이전츠
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#2C1A0E', marginBottom: 8 }}>개인정보 처리방침</h1>
        <p style={{ fontSize: 13, color: '#9A7B6A' }}>시행일: 2026년 10월 10일</p>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.9, color: '#4A3728', marginBottom: 36 }}>
        상원(SW)에이전츠(사업자등록번호: 148-17-02685, 이하 &quot;사업자&quot;)는 개인정보보호법에 따라 의뢰인의 개인정보를 보호하고 이와 관련한 고충을 신속하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
      </p>

      {section('제1조 (수집하는 개인정보 항목 및 수집 방법)', <>
        <p>① 수집 항목</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 12 }}>
          <li>필수: 이름, 연락처, 이메일 주소</li>
          <li>선택: 상호명, 문의 내용, 코멘트</li>
          <li>견적 설문 이용 시: 설문 응답(프로젝트 유형·규모·기능 등 요구사항 관련 답변) 및 생성된 견적 요약</li>
          <li>자동 수집: 광고 유입 정보(utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid), 방문 페이지, 기기·브라우저 정보, 쿠키</li>
        </ul>
        <p>② 수집 방법: 웹사이트 문의 폼 및 견적 설문을 통한 직접 입력, 웹사이트 이용 과정에서의 자동 수집</p>
        <p>③ 광고 유입 정보는 이용자의 브라우저(localStorage)에 최대 7일간 저장되며, 문의 접수 시 문의 내용과 함께 전달됩니다.</p>
      </>)}

      {section('제2조 (개인정보의 수집 및 이용 목적)', <>
        <p>수집된 개인정보는 다음의 목적으로만 이용됩니다.</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>외주 프로젝트 문의 확인 및 답변</li>
          <li>견적 설문 응답을 바탕으로 한 견적·일정(WBS) 생성 및 안내</li>
          <li>견적 안내 및 계약 진행</li>
          <li>광고 유입 경로 분석 및 서비스 개선</li>
          <li>서비스 제공 및 이행</li>
        </ul>
      </>)}

      {section('제3조 (개인정보의 보유 및 이용 기간)', <>
        <p>① 수집된 개인정보는 문의 처리 완료 후 즉시 파기함을 원칙으로 합니다.</p>
        <p>② 계약이 체결된 경우, 관련 법령에 따라 다음과 같이 보관합니다.</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
        </ul>
      </>)}

      {section('제4조 (개인정보의 제3자 제공)', <>
        <p>사업자는 의뢰인의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>의뢰인이 사전에 동의한 경우</li>
          <li>법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          <li>광고 성과 측정 및 잠재고객 매칭을 위해 이메일, 전화번호 등을 암호화(해시)된 형태로 Meta(Advanced Matching)에 제공하는 경우</li>
        </ul>
      </>)}

      {section('제5조 (개인정보의 파기)', <>
        <p>① 사업자는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때 지체 없이 해당 개인정보를 파기합니다.</p>
        <p>② 전자적 파일 형태의 정보는 복구 및 재생이 불가능한 기술적 방법을 이용하여 삭제합니다.</p>
      </>)}

      {section('제6조 (의뢰인의 권리)', <>
        <p>의뢰인은 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리 정지 요구</li>
        </ul>
        <p style={{ marginTop: 8 }}>권리 행사는 이메일(ksw75811@naver.com) 또는 연락처(010-9910-7581)로 요청하시면 됩니다.</p>
      </>)}

      {section('제7조 (쿠키 및 광고 추적기술의 사용)', <>
        <p>① 사업자는 웹사이트 이용 현황 분석 및 온라인 광고 최적화를 위해 쿠키(Cookie) 및 이와 유사한 추적기술(예: Meta(Facebook) 픽셀, LinkedIn Insight Tag 등)을 사용할 수 있습니다.</p>
        <p>② 이러한 기술을 통해 방문 페이지, 기기 정보, 광고 클릭 여부 등 비식별 정보가 수집되며, 수집된 정보는 광고 성과 측정 및 잠재고객 맞춤형 광고 노출 목적으로만 활용됩니다.</p>
        <p>③ 이용자는 웹브라우저의 설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우 일부 서비스 이용에 제약이 있을 수 있습니다.</p>
        <p>④ Meta 픽셀을 통해 수집·처리되는 정보는 Meta의 개인정보처리방침(https://www.facebook.com/privacy/policy/)의, LinkedIn Insight Tag를 통해 수집·처리되는 정보는 LinkedIn의 개인정보처리방침(https://www.linkedin.com/legal/privacy-policy)의 적용을 받습니다.</p>
      </>)}

      {section('제8조 (개인정보 처리 위탁 및 국외 이전)', <>
        <p>사업자는 서비스 제공 및 광고 운영을 위해 아래와 같이 개인정보 처리를 위탁하거나 국외로 이전합니다.</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 12 }}>
          <li>
            Meta Platforms, Inc. / Meta Platforms Ireland Ltd. (미국, 아일랜드): 방문 페이지, 기기·브라우저 정보, 이벤트 정보(설문 시작·설문 완료·문의 제출) 및 광고 클릭 정보. 목적: 광고 성과 측정 및 최적화. 보유: 목적 달성 시까지(Meta의 정책에 따름)
          </li>
          <li>
            LinkedIn Corporation 등 LinkedIn 계열사 (미국, 아일랜드): 방문 페이지, 기기·브라우저 정보. 목적: 광고 성과 측정. 보유: 목적 달성 시까지(LinkedIn의 정책에 따름)
          </li>
          <li>
            OpenAI, L.L.C. (미국): 견적 설문 응답. 목적: 견적·일정(WBS) 생성. 이름·연락처·이메일은 견적 생성 과정에 전송되지 않습니다. 보유: OpenAI의 데이터 보관 정책에 따름
          </li>
          <li>
            Vercel Inc. (미국): 웹사이트 접속 기록 및 방문 통계. 목적: 웹사이트 호스팅 및 서비스 안정성·통계. 보유: 목적 달성 시까지
          </li>
          <li>
            Google LLC (미국): 문의 접수 알림 메일(문의 내용 및 설문 응답 포함). 목적: 문의 접수 안내. 보유: 문의 처리 완료 후 이용자 요청 시 또는 보유기간 경과 시 삭제
          </li>
        </ul>
        <p>이전 시기 및 방법: 서비스 이용 시점에 정보통신망을 통해 수시로 전송됩니다.</p>
        <p style={{ marginTop: 8 }}>이용자는 국외 이전을 거부할 수 있으며, 거부를 원하는 경우 아래 제10조의 연락처로 요청하시거나 문의 폼·견적 설문의 이용을 중단하시면 됩니다. 이 경우 문의 접수 및 견적 확인이 제한될 수 있습니다.</p>
      </>)}

      {section('제9조 (동의 거부권 및 불이익)', <>
        <p>① 이용자는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.</p>
        <p>② 필수 항목(이름, 연락처, 이메일)에 대한 동의를 거부하는 경우 문의 접수 및 상세 견적 확인 서비스 이용이 제한됩니다.</p>
        <p>③ 쿠키 및 광고 추적기술은 웹브라우저 설정 또는 Meta·LinkedIn의 광고 설정에서 거부할 수 있습니다.</p>
      </>)}

      {section('제10조 (개인정보 보호책임자)', <>
        <ul style={{ paddingLeft: 20 }}>
          <li>성명: 김상원</li>
          <li>연락처: 010-9910-7581</li>
          <li>이메일: ksw75811@naver.com</li>
        </ul>
        <p style={{ marginTop: 8 }}>개인정보 처리에 관한 불만 처리 및 피해구제를 위하여 개인정보 분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터(국번없이 118) 등에 분쟁 해결을 신청할 수 있습니다.</p>
      </>)}

      {/* 하단 링크 */}
      <div style={{ borderTop: '1px solid #C9A84C44', paddingTop: 24, display: 'flex', gap: 20 }}>
        <Link href="/terms" style={{ fontSize: 13, color: '#C9A84C', textDecoration: 'none' }}>
          이용약관 →
        </Link>
        <Link href="/" style={{ fontSize: 13, color: '#9A7B6A', textDecoration: 'none' }}>
          홈으로 →
        </Link>
      </div>
    </main>
  );
}
