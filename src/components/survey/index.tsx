'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/src/hooks/useIsMobile';
import HeroArt from './steps/HeroArt';
import SurveyFooter from './SurveyFooter';

const Survey = () => {
    const isMobile = useIsMobile();
    const router = useRouter();

    return <>
        {/* 밝은 톤 배경 — 화면 전체 고정, 콘텐츠 뒤에 깔림 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src="/images/survey-bg.svg"
            alt=""
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        />

        <section
            style={{
                position: 'relative',
                zIndex: 1,
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '104px 24px 64px' : '80px 40px',
                background: 'transparent',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 1080,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    gap: isMobile ? 36 : 56,
                }}
            >
                {/* 좌: 텍스트 + 버튼 */}
                <div
                    style={{
                        flex: '1 1 0',
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'center' : 'flex-start',
                        textAlign: isMobile ? 'center' : 'left',
                        gap: 20,
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: isMobile ? 26 : 40,
                            lineHeight: 1.35,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: '#191F28',
                            wordBreak: 'keep-all',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {'어떤 자동화 혹은 서비스를\n하고 싶으신가요?'}
                    </h1>
                    <p
                        style={{
                            margin: 0,
                            fontSize: isMobile ? 15 : 18,
                            lineHeight: 1.65,
                            fontWeight: 500,
                            color: '#4E5968',
                            wordBreak: 'keep-all',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {'3분만 간단한 설문 받아보시고, 견적도 확인해보세요!'}
                    </p>
                    <button
                        onClick={() => router.push('/survey/form')}
                        style={{
                            marginTop: 8,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            border: 'none',
                            borderRadius: 16,
                            padding: '16px 28px',
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#fff',
                            background: '#191F28',
                            cursor: 'pointer',
                        }}
                    >
                        시작하기
                        <span
                            aria-hidden="true"
                            style={{
                                display: 'inline-flex',
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.16)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 13,
                            }}
                        >
                            →
                        </span>
                    </button>
                </div>

                {/* 우: 애니메이션 */}
                <div
                    style={{
                        flex: '1 1 0',
                        minWidth: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <HeroArt />
                </div>
            </div>
        </section>
        <SurveyFooter />
    </>
};

export default Survey;
