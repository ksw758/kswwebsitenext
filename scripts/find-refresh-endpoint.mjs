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

// 모든 rocketpunch API 요청 캡처
page.on('request', req => {
  const url = req.url();
  if (url.includes('api.rocketpunch') || (url.includes('rocketpunch') && req.method() !== 'GET')) {
    console.log(`REQ [${req.method()}] ${url}`);
    if (req.postData()) console.log('  BODY:', req.postData()?.slice(0, 200));
    const auth = req.headers()['authorization'];
    if (auth) console.log('  AUTH:', auth.slice(0, 50) + '...');
  }
});

page.on('response', async res => {
  const url = res.url();
  if (url.includes('api.rocketpunch') || (url.includes('rocketpunch.com/api'))) {
    try {
      const body = await res.text();
      console.log(`RES [${res.status()}] ${url}`);
      if (url.includes('token') || url.includes('auth') || url.includes('refresh')) {
        console.log('  BODY:', body.slice(0, 300));
      }
    } catch {}
  }
});

// refreshToken만 주입해서 자동 갱신 유도
await page.setCookie(
  { name: 'refreshToken', value: env.ROCKETPUNCH_REFRESH_TOKEN, domain: '.rocketpunch.com', path: '/' },
  { name: 'rocketClientId', value: env.ROCKETPUNCH_CLIENT_ID, domain: '.rocketpunch.com', path: '/' },
  { name: 'rocketClientToken', value: decodeURIComponent(env.ROCKETPUNCH_CLIENT_TOKEN), domain: '.rocketpunch.com', path: '/' },
);

await page.goto('https://www.rocketpunch.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 8000));

console.log('\n현재 URL:', page.url());
const cookies = await page.cookies();
const rp = cookies.filter(c => c.domain.includes('rocketpunch'));
console.log('\n현재 쿠키:', rp.map(c => `${c.name}=${c.value.slice(0, 30)}...`).join('\n'));

await browser.close();
