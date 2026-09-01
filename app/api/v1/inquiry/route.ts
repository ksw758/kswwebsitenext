import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { isSameOrigin } from '@/src/lib/guard';
import { checkRateLimit, clientIp } from '@/src/lib/rateLimit';

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX = { name: 50, company: 100, email: 254, contents: 5000 };

export async function POST(req: NextRequest) {
  // 1. 동일 출처만 허용
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  // 2. 허니팟 — 봇이 채우는 숨김 필드. 채워졌으면 조용히 버리지 않고,
  //    메일은 보내되 제목에 [의심] 표시를 붙여 사람이 판단하게 한다.
  //    (자동완성 확장이 실수로 채우는 오탐으로도 리드를 잃지 않기 위함)
  const isSuspicious =
    typeof body.website === 'string' && body.website.trim() !== '';

  // 3. IP당 레이트리밋 (신뢰 가능한 IP로 키잉)
  const rl = checkRateLimit(`inquiry:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: '문의가 너무 잦습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  // 4. 형식 검증
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const contents = typeof body.contents === 'string' ? body.contents.trim() : '';
  const isAgreement = body.isAgreement === true;

  if (!name || !phone || !email || !contents) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
  }
  if (!isAgreement) {
    return NextResponse.json({ error: '개인정보 수집·이용에 동의해 주세요.' }, { status: 400 });
  }
  // 전화번호는 형식이 다양(점·괄호·내선)하므로 숫자만 뽑아 자릿수로 검증한다.
  const phoneDigits = phone.replace(/\D/g, '');
  if (!EMAIL_RE.test(email) || phoneDigits.length < 8 || phoneDigits.length > 15) {
    return NextResponse.json({ error: '이메일 또는 연락처 형식을 확인해 주세요.' }, { status: 400 });
  }
  if (
    name.length > MAX.name ||
    company.length > MAX.company ||
    email.length > MAX.email ||
    contents.length > MAX.contents
  ) {
    return NextResponse.json({ error: '입력값이 너무 깁니다.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"포트폴리오 문의" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    replyTo: email,
    subject: `${isSuspicious ? '[의심] ' : ''}[문의] ${name}${company ? ` / ${company}` : ''}`,
    text: [
      ...(isSuspicious ? ['⚠️ 허니팟 필드가 채워진 문의입니다. 스팸 여부를 확인하세요.', ''] : []),
      `이름: ${name}`,
      `연락처: ${phone}`,
      `상호명: ${company || '-'}`,
      `이메일: ${email}`,
      '',
      `문의내용:\n${contents}`,
    ].join('\n'),
  });

  return NextResponse.json({ ok: true });
}
