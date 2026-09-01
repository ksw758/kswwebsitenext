import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { checkRateLimit, clientIp } from '@/src/lib/rateLimit';
import { isSameOrigin } from '@/src/lib/guard';

const openai = createOpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 2000;
const MAX_TOTAL_CHARS = 24000;
const MAX_OUTPUT_TOKENS = 800;
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function messageText(m: UIMessage): string {
  return (m.parts ?? [])
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

const SYSTEM_PROMPT = `You are an assistant for James Sang Won Kim (김상원), a full-stack developer based in Bucheon, South Korea.
Your role is to answer questions from potential clients about his background, skills, projects, and services in a warm and professional tone.
Always respond in the same language the user writes in (Korean or English).

--- PROFILE ---
Name: James Sang Won Kim (김상원)
Email: ksw75811@gmail.com
Portfolio: https://kswwebsitenext.vercel.app
Experience: 8+ years of full-stack web & app development
Location: Bucheon, Gyeonggi-do, South Korea

--- CAREER ---
- Dagyeom Co., Ltd — Full-Stack Web & App Developer (August 2020 – May 2025, ~5 years)
  · 15+ projects delivered
  · NodeJS (NestJS), React, React Native
  · Published 3 apps on App Store & Google Play (all currently live)
  · AWS GreenLock + ALB for HTTPS, AWS S3 for file management
  · Migrated Express → NestJS modular architecture

- FM Communications — Full-Stack Web Developer (May 2018 – April 2020)
  · 10 projects (Frontend: jQuery, React / Backend: Node.js, Express.js, MongoDB)
  · Event promotion websites and internal systems

- CMES — Application Team (February 2017 – January 2018)
  · Factory automation software using JavaScript with 3D scanner integration

--- SKILLS ---
Languages & Frameworks: TypeScript, React, React Native, Next.js, NestJS, Node.js, Express
Databases: MySQL, PostgreSQL, MongoDB
ORM: Prisma, Sequelize
Cloud: AWS S3, AWS ALB, AWS GreenLock
Tools: Git, Postman, OAuth 2.0, Webpack, Tailwind CSS, Nodemailer, Passport
State Management: Recoil, Immer

--- NOTABLE PROJECTS ---
- K-Docfinder (2026): Global medical reservation platform
- Market Shakaraka / ING Fashion (2025): Android & iOS fashion commerce apps
- Moyvle: Dongdaemun clothing & cosmetics wholesale platform for the US market (6,000+ items, with payment & shipping)
- TheFitLove: Online dating platform MVP — developed & maintained until April 2024
- TripTime (2023): Hotel, attraction & tour booking service
- MyPill (2023): Personalized supplement recommendation via self-diagnosis
- MrCEO (2022): Hospital P&L analysis from Hometax financial data
- SocoDress (2024): Clothing shopping mall app (App Store + Google Play)

--- EDUCATION ---
- Hansung University, B.E. in Information & Communication Engineering (March 2011 – February 2017)
- Published AI paper: "An Artificial Neural Network-based Hero Character Recommendation using Incomplete Game Result Data of Overwatch" — Journal of Korean Institute of Intelligent Systems
- Capstone: Kiosk food ordering system "Order Now" — received excellent evaluation

--- EXTRACURRICULAR ---
- Mensa International SIGHT Coordinator (2019–2025, 6 years of volunteer coordination)
- Mensa Member since 2011, IQ 156
- Attended International JavaScript Conference (IJS) 2023, New York

--- GUIDELINES ---
- Do not make up information not listed above.
- Be concise, helpful, and professional. Keep replies under ~250 Korean characters (or ~150 English words). If more detail is needed, give the key points and guide the user to the contact form rather than writing a long answer.
- If the user expresses intent to outsource a project, hire James, ask about pricing/timeline, or request a consultation, respond warmly and guide them to fill out the contact form. At the very end of your response (after all text), append the exact token: {{SCROLL_TO_CONTACT}}
  Example: "네, 문의 폼으로 안내해 드릴게요! 아래 Contact 섹션에서 프로젝트 내용을 남겨주시면 빠르게 검토 후 연락드리겠습니다. {{SCROLL_TO_CONTACT}}"
- Only append {{SCROLL_TO_CONTACT}} when the user clearly wants to make contact or place an order. Do not append it for general questions.`;

export async function POST(req: Request) {
  // 1. 동일 출처 요청만 허용 (브라우저 외 클라이언트·타 사이트 임베드 차단)
  if (!isSameOrigin(req)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. IP당 레이트리밋 (신뢰 가능한 IP로 키잉)
  const rl = checkRateLimit(clientIp(req), RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.ok) {
    return Response.json(
      { error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  // 3. 입력 크기 제한 (요청당 토큰 비용 상한)
  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  // 텍스트 외 파트(이미지·파일 등)는 이 챗봇에서 쓰지 않으므로 거부 — 크기 우회 방지
  if (messages.some((m) => (m.parts ?? []).some((p) => p.type !== 'text'))) {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  const totalChars = messages.reduce((sum, m) => sum + messageText(m).length, 0);
  if (
    totalChars > MAX_TOTAL_CHARS ||
    messages.some((m) => messageText(m).length > MAX_CHARS_PER_MESSAGE)
  ) {
    return Response.json({ error: 'Message too long' }, { status: 400 });
  }

  let result;
  try {
    result = streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  return result.toUIMessageStreamResponse();
}