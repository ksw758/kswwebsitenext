/**
 * 견적 시뮬레이터 게이트 폼 제출 → 리드 정보 + 설문 답변을 내 메일로 전송.
 * app/api/v1/inquiry/route.ts 와 동일한 패턴(허니팟·레이트리밋·nodemailer)을 따른다.
 */
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { isSameOrigin } from '@/src/lib/guard';
import { checkRateLimit, clientIp } from '@/src/lib/rateLimit';

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX = { name: 50, email: 254, comment: 2000 };

export async function POST(req: NextRequest) {
    if (!isSameOrigin(req)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 허니팟 — 봇이 채우는 숨김 필드. 채워졌으면 메일은 보내되 제목에 [의심] 표시만 붙인다.
    const isSuspicious = typeof body.website === 'string' && body.website.trim() !== '';

    const rl = checkRateLimit(`estimate-lead:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS);
    if (!rl.ok) {
        return NextResponse.json(
            { error: '제출이 너무 잦습니다. 잠시 후 다시 시도해 주세요.' },
            { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
        );
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
    const isAgreement = body.agree === true;
    const answers =
        body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
            ? (body.answers as Record<string, unknown>)
            : null;
    const headline = typeof body.headline === 'string' ? body.headline.trim() : '';

    if (!name || !phone || !email) {
        return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    if (!isAgreement) {
        return NextResponse.json({ error: '개인정보 수집·이용에 동의해 주세요.' }, { status: 400 });
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!EMAIL_RE.test(email) || phoneDigits.length < 8 || phoneDigits.length > 15) {
        return NextResponse.json({ error: '이메일 또는 연락처 형식을 확인해 주세요.' }, { status: 400 });
    }
    if (name.length > MAX.name || email.length > MAX.email || comment.length > MAX.comment) {
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

    // 나(운영자)에게만 보내는 알림 메일 — replyTo 를 리드 이메일로 걸지 않는다.
    // (여기 답장하면 그대로 리드에게 메일이 가버려서 리드 입장에서 당황할 수 있음)
    await transporter.sendMail({
        from: `"견적 시뮬레이터" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        subject: `${isSuspicious ? '[의심] ' : ''}[견적 문의] ${name}`,
        text: [
            ...(isSuspicious ? ['⚠️ 허니팟 필드가 채워진 문의입니다. 스팸 여부를 확인하세요.', ''] : []),
            `이름: ${name}`,
            `연락처: ${phone}`,
            `이메일: ${email}`,
            ...(headline ? ['', `견적 요약: ${headline}`] : []),
            '',
            `코멘트:\n${comment || '-'}`,
            '',
            `설문 답변:\n${answers ? JSON.stringify(answers, null, 2) : '(없음)'}`,
        ].join('\n'),
    });

    return NextResponse.json({ ok: true });
}