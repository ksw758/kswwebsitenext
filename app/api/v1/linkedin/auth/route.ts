import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID!;
  const redirectUri = process.env.NODE_ENV === 'production'
    ? 'https://kswwebsitenext.vercel.app/api/v1/linkedin/callback'
    : 'http://localhost:3000/api/v1/linkedin/callback';

  const scope = 'openid profile w_member_social';
  const state = Math.random().toString(36).substring(2);

  const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);

  return NextResponse.redirect(url.toString());
}
