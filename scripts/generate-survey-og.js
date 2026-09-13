/**
 * app/survey/opengraph-image.tsx 와 동일한 디자인을 public/asset/survey-og.png 로 렌더링해 저장한다.
 * 카카오톡 등 동적 OG 이미지를 신뢰성 있게 못 읽는 크롤러를 위한 정적 백업용.
 * 디자인을 바꾸면 이 파일과 app/survey/opengraph-image.tsx 둘 다 맞춰서 고칠 것.
 * 실행: node scripts/generate-survey-og.js
 */
const { readFile, writeFile, mkdir } = require('node:fs/promises');
const { join } = require('node:path');
const React = require('react');
const { ImageResponse } = require('next/og.js');

const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
    // next/og(satori)는 woff2·가변 폰트(fvar)를 지원하지 않으므로
    // fonttools 로 700 웨이트만 고정 추출한 정적 ttf 를 쓴다.
    const fontData = await readFile(join(process.cwd(), 'app/survey/fonts/Pretendard-Bold.ttf'));

    const el = (type, style, ...children) =>
        React.createElement(type, { style: { display: 'flex', ...style } }, ...children);

    const element = el(
        'div',
        {
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 96px',
            background: '#191F28',
            color: '#fff',
            fontFamily: 'Pretendard',
        },
        el('div', { fontSize: 28, color: '#9DA7B3', letterSpacing: 2 }, '상원(SW)에이전츠'),
        el(
            'div',
            { fontSize: 64, fontWeight: 700, marginTop: 24, lineHeight: 1.3 },
            'AI 견적 시뮬레이터',
        ),
        el(
            'div',
            { fontSize: 30, color: '#C7D0DA', marginTop: 20 },
            '웹·앱 개발, 1분이면 예상 견적이 나옵니다',
        ),
        el(
            'div',
            { alignItems: 'center', gap: 12, marginTop: 48 },
            el('div', { width: 12, height: 12, borderRadius: 6, background: '#3182F6' }),
            el('div', { fontSize: 22, color: '#8B95A1' }, 'WBS · 예상 견적 · DB 스키마까지 무료로 확인'),
        ),
    );

    const image = new ImageResponse(element, {
        width: WIDTH,
        height: HEIGHT,
        fonts: [{ name: 'Pretendard', data: fontData, style: 'normal', weight: 700 }],
    });

    const buf = Buffer.from(await image.arrayBuffer());
    const outDir = join(process.cwd(), 'public/asset');
    await mkdir(outDir, { recursive: true });
    const outPath = join(outDir, 'survey-og.png');
    await writeFile(outPath, buf);
    console.log('wrote', outPath, buf.length, 'bytes');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
