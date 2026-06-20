import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.match(/^([^=]+)=(.*)$/)?.slice(1) ?? [])
    .filter(([k]) => k)
    .map(([k, v]) => [k.trim(), v?.replace(/^"|"$/g, '').trim()])
);

const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
const page = await browser.newPage();

// refreshToken 주입 → 홈 방문으로 accessToken 자동 갱신
await page.setCookie(
  { name: 'refreshToken', value: env.ROCKETPUNCH_REFRESH_TOKEN, domain: '.rocketpunch.com', path: '/' },
  { name: 'rocketClientId', value: env.ROCKETPUNCH_CLIENT_ID, domain: '.rocketpunch.com', path: '/' },
  { name: 'rocketClientToken', value: decodeURIComponent(env.ROCKETPUNCH_CLIENT_TOKEN), domain: '.rocketpunch.com', path: '/' },
);

await page.goto('https://www.rocketpunch.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 8000));

// 갱신된 accessToken 확인
const cookies = await page.cookies('https://www.rocketpunch.com');
const accessToken = cookies.find(c => c.name === 'accessToken');
console.log('accessToken 갱신 여부:', accessToken ? '✅ 갱신됨' : '❌ 없음');
console.log('현재 URL:', page.url());

if (!accessToken) {
  console.log('쿠키 목록:', cookies.map(c => c.name).join(', '));
  await browser.close();
  process.exit(1);
}

// 글쓰기 버튼 클릭 (직접 URL 대신 버튼 클릭)
const writeBtn = await page.$('button:has-text("글쓰기")') ||
  await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.trim() === '글쓰기') || null;
  });

if (writeBtn) {
  await writeBtn.click();
  console.log('글쓰기 버튼 클릭');
} else {
  // 직접 URL 이동
  await page.goto('https://www.rocketpunch.com/blog/write', { waitUntil: 'domcontentloaded', timeout: 15000 });
}

await new Promise(r => setTimeout(r, 5000));
await page.screenshot({ path: path.join(__dirname, 'rocketpunch-write.png'), fullPage: true });
console.log('스크린샷 저장, URL:', page.url());

// 폼 구조 파악
const structure = await page.evaluate(() => {
  const els = document.querySelectorAll('input, textarea, [contenteditable="true"], [contenteditable="plaintext-only"]');
  return Array.from(els).map(el => ({
    tag: el.tagName,
    type: el.type || '',
    name: el.name || '',
    id: el.id || '',
    class: el.className?.toString().slice(0, 80) || '',
    placeholder: el.getAttribute('placeholder') || '',
    contenteditable: el.getAttribute('contenteditable') || '',
    'data-placeholder': el.getAttribute('data-placeholder') || '',
    ariaLabel: el.getAttribute('aria-label') || '',
  }));
});

console.log('\n=== 폼 요소 ===');
structure.forEach(el => console.log(JSON.stringify(el)));

await browser.close();
