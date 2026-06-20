import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), '.rocketpunch-tokens.json');

function loadRefreshToken(): string {
  try {
    const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
    if (data.refreshToken) return data.refreshToken;
  } catch {}
  return process.env.ROCKETPUNCH_REFRESH_TOKEN!;
}

function saveRefreshToken(refreshToken: string): void {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ refreshToken, updatedAt: new Date().toISOString() }, null, 2));
  } catch (e) {
    console.warn('[Rocketpunch] 토큰 저장 실패:', e);
  }
}

const RP_HEADERS = {
  'origin': 'https://www.rocketpunch.com',
  'referer': 'https://www.rocketpunch.com/',
  'x-rocket-api-version': '3.0.0',
  'x-rocket-app-key': '077cd9d8-7237-4bee-b2d3-77690d163cca',
  'x-rocket-client-type': 'WEB',
  'x-rocket-device-type': 'PC',
  'x-rocket-os-type': 'MAC',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
};

function getBaseCookies(): string {
  return [
    `refreshToken=${loadRefreshToken()}`,
    `rocketClientId=${process.env.ROCKETPUNCH_CLIENT_ID}`,
    `rocketClientToken=${process.env.ROCKETPUNCH_CLIENT_TOKEN}`,
  ].join('; ');
}

// 홈페이지 SSR 호출로 accessToken 자동 갱신
async function getFreshCookies(): Promise<string> {
  const res = await fetch('https://www.rocketpunch.com/', {
    headers: { ...RP_HEADERS, cookie: getBaseCookies() },
    redirect: 'manual',
  });

  const setCookieHeaders = res.headers.getSetCookie?.() ?? [];
  const newTokens: Record<string, string> = {};

  for (const header of setCookieHeaders) {
    const [pair] = header.split(';');
    const [name, value] = pair.split('=');
    if (name && value && ['accessToken', 'refreshToken', '_rp_proxy_sig'].includes(name.trim())) {
      newTokens[name.trim()] = value.trim();
    }
  }

  if (!newTokens.accessToken) {
    throw new Error('accessToken 갱신 실패 — refreshToken이 만료되었습니다. Chrome DevTools에서 새 refreshToken을 추출해 .rocketpunch-tokens.json에 저장하세요.');
  }

  if (newTokens.refreshToken) {
    saveRefreshToken(newTokens.refreshToken);
  }

  return [
    `accessToken=${newTokens.accessToken}`,
    `refreshToken=${newTokens.refreshToken ?? loadRefreshToken()}`,
    `rocketClientId=${process.env.ROCKETPUNCH_CLIENT_ID}`,
    `rocketClientToken=${process.env.ROCKETPUNCH_CLIENT_TOKEN}`,
    ...(newTokens._rp_proxy_sig ? [`_rp_proxy_sig=${newTokens._rp_proxy_sig}`] : []),
  ].join('; ');
}

async function presignImage(fileName: string, cookies: string): Promise<{ presignedUrl: string; filePath: string }> {
  const params = new URLSearchParams({ fileName, contentType: 'image/png', fileType: 'post' });
  const res = await fetch(`https://www.rocketpunch.com/api/presign?${params}`, {
    method: 'POST',
    headers: { ...RP_HEADERS, cookie: cookies },
  });
  if (!res.ok) throw new Error(`presign 실패: ${res.status} ${await res.text()}`);
  return res.json();
}

async function uploadToS3(presignedUrl: string, imageBuffer: Buffer): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: new Uint8Array(imageBuffer),
  });
  if (!res.ok) throw new Error(`S3 업로드 실패: ${res.status} ${await res.text()}`);
}

export async function postToRocketpunch(
  title: string,
  content: string,
  thumbnailUrl: string,
  hashtags: string[],
): Promise<object> {
  const cookies = await getFreshCookies();
  // 1. presign
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -1);
  const { presignedUrl, filePath } = await presignImage(`thumbnail-${ts}.png`, cookies);

  // 2. 이미지 다운로드 → S3 업로드
  const imgRes = await fetch(thumbnailUrl);
  const imageBuffer = Buffer.from(await imgRes.arrayBuffer());
  await uploadToS3(presignedUrl, imageBuffer);

  // 3. 포스트 내용 조합 (최대 2000자)
  const hashtagText = hashtags.length > 0
    ? '\n' + hashtags.map(h => `#${h.replace(/\s/g, '')}`).join(' ')
    : '';
  const maxBody = 2000 - title.length - 2 - hashtagText.length;
  const body = content.length > maxBody ? content.slice(0, maxBody - 3) + '...' : content;
  const postContent = `${title}\n\n${body}${hashtagText}`;

  // 4. 포스트 발행
  const res = await fetch('https://www.rocketpunch.com/api/proxy/posts', {
    method: 'POST',
    headers: { ...RP_HEADERS, 'content-type': 'application/json', cookie: cookies },
    body: JSON.stringify({
      companyMentionIds: [],
      content: postContent,
      images: [{ path: filePath, width: 200, height: 200 }],
      ogs: [],
      userMentionIds: [],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Rocketpunch 포스팅 실패: ${res.status} ${err}`);
  }

  return res.json();
}
