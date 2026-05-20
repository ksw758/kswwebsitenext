import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, phone, company, email, contents } = await req.json();

  if (!name || !phone || !email || !contents) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
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
    subject: `[문의] ${name}${company ? ` / ${company}` : ''}`,
    text: [
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