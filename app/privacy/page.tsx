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
        <p style={{ fontSize: 13, color: '#9A7B6A' }}>시행일: 2026년 06월 09일</p>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.9, color: '#4A3728', marginBottom: 36 }}>
        상원(SW)에이전츠(사업자등록번호: 148-17-02685, 이하 &quot;사업자&quot;)는 개인정보보호법에 따라 의뢰인의 개인정보를 보호하고 이와 관련한 고충을 신속하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
      </p>

      {section('제1조 (수집하는 개인정보 항목 및 수집 방법)', <>
        <p>① 수집 항목</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 12 }}>
          <li>필수: 이름, 연락처, 이메일 주소</li>
          <li>선택: 상호명, 문의 내용</li>
        </ul>
        <p>② 수집 방법: 웹사이트 문의 폼을 통한 직접 입력</p>
      </>)}

      {section('제2조 (개인정보의 수집 및 이용 목적)', <>
        <p>수집된 개인정보는 다음의 목적으로만 이용됩니다.</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>외주 프로젝트 문의 확인 및 답변</li>
          <li>견적 안내 및 계약 진행</li>
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

      {section('제7조 (개인정보 보호책임자)', <>
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
