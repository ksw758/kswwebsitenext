'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { theme } from '@/src/const';
import GreekMeander from '@/src/components/GreekMeander';
import { useIsMobile } from '@/src/hooks/useIsMobile';

const PRIVACY_TEXT =
  '개인 및 기업정보의 수집·이용에 관한 사항\n' +
  '수집 목적 : 외주 프로젝트 문의 및 견적 안내\n' +
  '수집 항목 : 이름, 연락처, 상호명, 이메일, 문의내용\n' +
  '보유·이용 기간 : 문의 처리 완료 후 즉시 파기';

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: `${theme.color.parchment}CC`,
  border: `1px solid ${theme.color.gold}55`,
  borderRadius: 0,
  padding: '12px 14px',
  fontFamily: theme.font.serif,
  fontSize: 14,
  color: theme.color.sepia,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: theme.font.serif,
  fontSize: 10,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: theme.color.gold,
  marginBottom: 8,
};

type Status = 'idle' | 'loading' | 'success' | 'error';

const Contact = () => {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    company: '',
    email: '',
    contents: '',
    isAgreement: false,
  });
  const [status, setStatus] = useState<Status>('idle');

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async () => {
    if (!form.isAgreement) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await axios.post('/api/v1/inquiry', form);
      setStatus('success');
      setForm({ name: '', phone: '', company: '', email: '', contents: '', isAgreement: false });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="Contact"
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
      {/* Eyebrow */}
      <p style={{ margin: '0 0 14px 0', fontFamily: theme.font.serif, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: theme.color.gold }}>
        프로젝트 문의
      </p>

      {/* Meander */}
      <div style={{ width: 140, marginBottom: 22 }}>
        <GreekMeander id="gk-contact-top" strokeColor={theme.color.gold} />
      </div>

      {/* Title */}
      <h2 style={{ margin: '0 0 12px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 20 : 30, fontWeight: 700, color: theme.color.parchment, textAlign: 'center', lineHeight: 1.6 }}>
        Contact
      </h2>
      <p style={{ margin: '0 0 48px 0', fontFamily: theme.font.serif, fontSize: isMobile ? 12 : 14, color: `${theme.color.parchment}88`, textAlign: 'center', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
        {'프로젝트 규모, 예산, 일정을 간단히 알려주시면\n빠르게 검토 후 연락드리겠습니다.'}
      </p>

      {/* Form card */}
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          background: `${theme.color.parchment}0D`,
          border: `1px solid ${theme.color.gold}33`,
          padding: isMobile ? '32px 20px' : '48px 48px',
          boxSizing: 'border-box',
        }}
      >
        {/* Row 1: 이름 + 연락처 */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>이름 *</label>
            <input style={inputStyle} type="text" value={form.name} onChange={set('name')} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>연락처 *</label>
            <input style={inputStyle} type="text" value={form.phone} onChange={set('phone')} />
          </div>
        </div>

        {/* Row 2: 상호명 + 이메일 */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>상호명</label>
            <input style={inputStyle} type="text" value={form.company} onChange={set('company')} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>이메일 *</label>
            <input style={inputStyle} type="email" value={form.email} onChange={set('email')} />
          </div>
        </div>

        {/* 문의사항 */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>문의사항 *</label>
          <textarea
            style={{ ...inputStyle, minHeight: 160, resize: 'vertical' }}
            value={form.contents}
            onChange={set('contents')}
            placeholder="프로젝트 내용을 간략히 작성해주세요."
          />
        </div>

        {/* 개인정보 동의 */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>개인정보 수집·이용 동의 *</label>
          <div
            style={{
              ...inputStyle,
              minHeight: 100,
              whiteSpace: 'pre-line',
              fontSize: 12,
              color: `${theme.color.sepia}BB`,
              lineHeight: 1.8,
              marginBottom: 12,
              overflowY: 'auto',
            }}
          >
            {PRIVACY_TEXT}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.isAgreement}
              onChange={(e) => setForm({ ...form, isAgreement: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: theme.color.gold }}
            />
            <span style={{ fontFamily: theme.font.serif, fontSize: 12, color: `${theme.color.parchment}99`, letterSpacing: '1px' }}>
              개인·기업 정보 수집·이용에 동의합니다.
            </span>
          </label>
        </div>

        {/* 상태 메시지 */}
        {status === 'success' && (
          <p style={{ fontFamily: theme.font.serif, fontSize: 13, color: theme.color.gold, textAlign: 'center', marginBottom: 16 }}>
            문의가 접수되었습니다. 빠르게 검토 후 연락드리겠습니다.
          </p>
        )}
        {status === 'error' && (
          <p style={{ fontFamily: theme.font.serif, fontSize: 13, color: '#C0392B', textAlign: 'center', marginBottom: 16 }}>
            {!form.isAgreement ? '개인정보 수집·이용에 동의해주세요.' : '오류가 발생했습니다. 다시 시도해주세요.'}
          </p>
        )}

        {/* 제출 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onSubmit}
            disabled={status === 'loading'}
            style={{
              fontFamily: theme.font.serif,
              fontSize: 11,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: theme.color.gold,
              background: 'transparent',
              border: `1px solid ${theme.color.gold}`,
              padding: '14px 48px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.6 : 1,
              borderRadius: 0,
            }}
          >
            {status === 'loading' ? '전송 중...' : '문의하기'}
          </button>
        </div>
      </div>

      {/* Bottom meander */}
      <div style={{ width: 140, marginTop: 56 }}>
        <GreekMeander id="gk-contact-bottom" strokeColor={theme.color.gold} />
      </div>
    </section>
  );
};

export default Contact;