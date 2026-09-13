import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'AI 견적 시뮬레이터 · 상원(SW)에이전츠';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * scripts/generate-survey-og.js 로 만든 public/asset/survey-og.png(카카오 등 정적 크롤러용 백업)와
 * 같은 디자인. 디자인을 바꾸면 두 파일을 같이 고칠 것.
 * next/og(satori)는 woff2·가변 폰트(fvar)를 지원하지 않아 700 웨이트만 고정 추출한 ttf 를 쓴다.
 */
export default async function Image() {
    const fontData = await readFile(
        join(process.cwd(), 'app/survey/fonts/Pretendard-Bold.ttf'),
    );

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px 96px',
                    background: '#191F28',
                    color: '#fff',
                    fontFamily: 'Pretendard',
                }}
            >
                <div style={{ display: 'flex', fontSize: 28, color: '#9DA7B3', letterSpacing: 2 }}>
                    상원(SW)에이전츠
                </div>
                <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, marginTop: 24, lineHeight: 1.3 }}>
                    AI 견적 시뮬레이터
                </div>
                <div style={{ display: 'flex', fontSize: 30, color: '#C7D0DA', marginTop: 20 }}>
                    웹·앱 개발, 1분이면 예상 견적이 나옵니다
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 48 }}>
                    <div style={{ display: 'flex', width: 12, height: 12, borderRadius: 6, background: '#3182F6' }} />
                    <div style={{ display: 'flex', fontSize: 22, color: '#8B95A1' }}>
                        WBS · 예상 견적 · DB 스키마까지 무료로 확인
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [{ name: 'Pretendard', data: fontData, style: 'normal', weight: 700 }],
        },
    );
}
