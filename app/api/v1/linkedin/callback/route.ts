import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.json({ error: error ?? 'No code received' }, { status: 400 });
  }

  const redirectUri = process.env.NODE_ENV === 'production'
    ? 'https://kswwebsitenext.vercel.app/api/v1/linkedin/callback'
    : 'http://localhost:3000/api/v1/linkedin/callback';

  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    return NextResponse.json({ error: tokenData }, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  // 내 LinkedIn sub(ID) 가져오기
  const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const me = await meRes.json();

  return NextResponse.json({
    message: '✅ 아래 값을 .env.local에 추가하세요',
    LINKEDIN_ACCESS_TOKEN: accessToken,
    LINKEDIN_PERSON_URN: `urn:li:person:${me.sub}`,
    expires_in: tokenData.expires_in,
  });
}
