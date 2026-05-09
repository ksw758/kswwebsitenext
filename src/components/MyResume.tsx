'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  DagyeomIcon,
  FMCommunicationsIcon,
  GithubIcon,
  LinkedInIcon,
  PDFIcon,
  RocketPunchIcon,
} from '@/src/styles/svgs';

/* ── shared style tokens ── */
const s = {
  sectionBlock: {
    paddingTop: 10,
    marginBottom: 20,
  } as React.CSSProperties,
  h1: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 20,
  } as React.CSSProperties,
  h2Company: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 10,
  } as React.CSSProperties,
  paragraph: {
    fontSize: 16,
    fontWeight: 300,
    lineHeight: '24px',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottom: '1px solid black',
    whiteSpace: 'pre-line',
  } as React.CSSProperties,
  companyRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  } as React.CSSProperties,
  logoBox: {
    width: 80,
    height: 60,
    marginRight: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as React.CSSProperties,
  periodText: {
    fontSize: 16,
    fontWeight: 300,
    lineHeight: '24px',
  } as React.CSSProperties,
};

const MyResume = () => {
  const { t } = useTranslation();
  const [isDownload, setIsDownload] = useState(false);

  const onPDFDownload = async () => {
    setIsDownload(true);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const padding = 16;
    const pdfWidth = pdf.internal.pageSize.getWidth() - padding * 2;
    const pdfHeight = pdf.internal.pageSize.getHeight() - padding * 2;

    const renderElements = async (ids: string[], addPageFirst = false) => {
      const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
      if (!elements.length) return;
      if (addPageFirst) { pdf.addPage(); }
      let currentY = padding;
      for (const el of elements) {
        const canvas = await html2canvas(el!, { scale: 1, useCORS: true, allowTaint: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        const imgProps = pdf.getImageProperties(imgData);
        const scaledH = (imgProps.height * pdfWidth) / imgProps.width;
        if (currentY + scaledH > pdfHeight + padding) { pdf.addPage(); currentY = padding; }
        pdf.addImage(imgData, 'JPEG', padding, currentY, pdfWidth, scaledH);
        currentY += scaledH;
      }
    };

    await renderElements(['my-resume-page1-1', 'my-resume-page1-2', 'my-resume-page1-3']);
    await renderElements(['my-resume-page2-1', 'my-resume-page2-2'], true);
    pdf.save('resume.pdf');
    setIsDownload(false);
  };

  return (
    <div style={{ fontFamily: 'SF-Pro, sans-serif' }}>

      {/* ── Download button ── */}
      {!isDownload && (
        <header style={{ height: 60, width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 20px', boxSizing: 'border-box' }}>
          <button
            onClick={onPDFDownload}
            style={{ borderRadius: 10, height: 40, width: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #ccc', background: 'white', gap: 8 }}
          >
            <PDFIcon />
            PDF 다운로드
          </button>
        </header>
      )}

      {/* ── Page 1-1 : Profile header ── */}
      <div id="my-resume-page1-1" style={{ display: 'flex', height: 200, marginBottom: 20 }}>
        {/* Profile photo */}
        <div style={{ width: 200, height: '100%', flexShrink: 0 }}>
          <img alt="profile" src="/images/my_profile.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Name / title / contact */}
        <div style={{ flex: 1, background: '#86F6C0', padding: 40, boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{t('resume.name')}</h1>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>{t('resume.development')}</h2>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: '22px' }}>{t('resume.address')}</p>
          <p style={{ fontSize: 14, fontWeight: 300 }}>+821099107581 · ksw75811@gmail.com</p>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ display: 'flex' }}>

        {/* Left sidebar — 200px */}
        <div style={{ width: 200, flexShrink: 0 }}>
          {!isDownload && (
            <div style={{ display: 'flex', background: 'black', padding: '10px', boxSizing: 'border-box', gap: 8 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GithubIcon />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LinkedInIcon />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RocketPunchIcon />
              </div>
            </div>
          )}
        </div>

        {/* Right content — fills remaining width */}
        <div style={{ flex: 1, padding: 40, boxSizing: 'border-box' }}>

          {/* ── Page 1-2 : Profile description ── */}
          <div id="my-resume-page1-2" style={s.sectionBlock}>
            <h1 style={s.h1}>{t('resume.profile.title')}</h1>
            <p style={s.paragraph}>
              {'안녕하세요. 8년차 Full-Stack JavaScript 개발자 James Kim입니다.\n' +
                'FE는 React와 React Native 기반 프로젝트를, BE는 NodeJS (Express), NestJS, 그리고 일부 Python(FastAPI) 개발 경험이 있습니다.\n' +
                '또한 7년 이상 AWS EC2 기반 서버 배포 및 운영 경험이 있으며, ALB와 Let\'s Encrypt를 통한 SSL 인증, S3를 활용한 파일 관리, RDS 기반 데이터베이스 운영을 수행했습니다.\n' +
                '데이터베이스는 주로 MySQL을 사용하였으며, MongoDB와 PostgreSQL도 프로젝트 경험이 있습니다.\n' +
                '가장 익숙한 언어는 JavaScript로, 모듈화, 리팩토링, MDN 문서 기반의 함수·객체 활용에 익숙합니다.\n' +
                '최근에는 RAG기반으로 Q&A 챗봇 시스템을 학습해서 여러 서비스에 활용하고 있습니다.'}
            </p>
          </div>

          {/* ── Page 1-3 : Employment history ── */}
          <div id="my-resume-page1-3" style={s.sectionBlock}>
            <h1 style={s.h1}>{t('resume.employment_history.title')}</h1>

            {/* Dagyeom */}
            <div style={s.companyRow}>
              <div style={s.logoBox}><DagyeomIcon /></div>
              <div>
                <h2 style={s.h2Company}>{t('resume.employment_history.dagyeom.title')}</h2>
                <p style={s.periodText}>{t('resume.employment_history.dagyeom.period')}</p>
              </div>
            </div>
            <p style={s.paragraph}>{t('resume.employment_history.dagyeom.description')}</p>
            <p style={s.paragraph}>{t('resume.employment_history.dagyeom.key_experiences')}</p>

            {/* FM Communications */}
            <div style={s.companyRow}>
              <div style={s.logoBox}><FMCommunicationsIcon /></div>
              <div>
                <h2 style={s.h2Company}>{t('resume.employment_history.fm_communications.title')}</h2>
                <p style={s.periodText}>{t('resume.employment_history.fm_communications.period')}</p>
              </div>
            </div>
            <p style={s.paragraph}>{t('resume.employment_history.fm_communications.description')}</p>
            <p style={s.paragraph}>{t('resume.employment_history.fm_communications.key_experiences')}</p>

            {/* CMES */}
            <div style={s.companyRow}>
              <div style={s.logoBox}>
                <img alt="cmes logo" src="/images/cmes-logo.svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={s.h2Company}>{t('resume.employment_history.cmes.title')}</h2>
                <p style={s.periodText}>{t('resume.employment_history.cmes.period')}</p>
              </div>
            </div>
            <p style={s.paragraph}>{t('resume.employment_history.cmes.description')}</p>
          </div>

          {/* ── Page 2-1 : Education ── */}
          <div id="my-resume-page2-1" style={s.sectionBlock}>
            <h1 style={s.h1}>{t('resume.education.title')}</h1>
            <div style={s.companyRow}>
              <div style={s.logoBox}>
                <img alt="hansung" src="/images/hansung-univ.svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={s.h2Company}>{t('resume.education.university.title')}</h2>
                <p style={s.periodText}>{t('resume.education.university.period')}</p>
              </div>
            </div>
            <p style={s.paragraph}>{t('resume.education.university.description')}</p>
            <p style={s.paragraph}>{t('resume.education.university.key_activities')}</p>
          </div>

          {/* ── Page 2-2 : Extracurricular ── */}
          <div id="my-resume-page2-2" style={s.sectionBlock}>
            <h1 style={s.h1}>{t('resume.extracurricular_activities.title')}</h1>

            {/* SIGHT Coordinator */}
            <div style={s.companyRow}>
              <div style={s.logoBox}>
                <img src="/images/mensa-logo.svg" alt="mensa" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={s.h2Company}>{t('resume.extracurricular_activities.sight_coordinator.title')}</h2>
                <p style={s.periodText}>{t('resume.extracurricular_activities.sight_coordinator.period')}</p>
              </div>
            </div>
            <p style={s.paragraph}>{t('resume.extracurricular_activities.sight_coordinator.description')}</p>

            {/* IJS */}
            <div style={s.companyRow}>
              <div style={s.logoBox}>
                <img src="/images/IJS.svg" alt="IJS" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={s.h2Company}>{t('resume.extracurricular_activities.ijs.title')}</h2>
                <p style={s.periodText}>{t('resume.extracurricular_activities.ijs.period')}</p>
              </div>
            </div>
            <p style={s.paragraph}>{t('resume.extracurricular_activities.ijs.description')}</p>
            <img src="/images/IJS2023.jpg" alt="IJS 2023" style={{ maxWidth: 480, marginBottom: 20, display: 'block' }} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyResume;
