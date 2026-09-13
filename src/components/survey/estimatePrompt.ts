import { Questions, toChoice, type Answers } from './const';

/**
 * /api/v1/estimate/generate 용 프롬프트 자산.
 * - answersToBrief: 설문 답변(value 키)을 사람이 읽는 { 질문, 답 } 목록으로 변환
 * - ESTIMATE_SYSTEM_PROMPT: 견적 생성 규칙 (상원SW에이전츠 도메인 지식)
 * - PAST_PROJECTS_CONTEXT: 실적 요약 — 현실적인 산정 근거
 */

// 질문 id -> (choice value -> label)
const LABELS: Record<string, Record<string, string>> = Object.fromEntries(
    Questions.filter((q) => q.choices?.length).map((q) => [
        q.id,
        Object.fromEntries(q.choices!.map(toChoice).map((c) => [c.value, c.label])),
    ]),
);

const TITLES: Record<string, string> = Object.fromEntries(Questions.map((q) => [q.id, q.title]));

export function answersToBrief(answers: Answers): { question: string; answer: string }[] {
    const out: { question: string; answer: string }[] = [];
    for (const [id, raw] of Object.entries(answers)) {
        if (raw == null || (Array.isArray(raw) && raw.length === 0) || raw === '') continue;
        const map = LABELS[id];
        const toLabel = (v: string) => map?.[v] ?? v;
        const answer = Array.isArray(raw) ? raw.map(toLabel).join(', ') : toLabel(String(raw));
        out.push({ question: TITLES[id] ?? id, answer });
    }
    return out;
}

export const ESTIMATE_SYSTEM_PROMPT = `당신은 "상원(SW)에이전츠"의 견적 담당입니다.
상원SW에이전츠는 9년차 풀스택 개발자 김상원의 1인 개발 에이전시로, 비상주(원격) 방식으로 일하며
대규모 프로젝트는 받지 않습니다.
아래 설문 답변을 바탕으로 웹/앱/자동화 프로젝트의 개략 견적·WBS·범위·예상 DB 스키마를 생성하세요.
반드시 주어진 JSON 스키마 구조에 맞춰 **한국어**로, 고객(비개발자 포함)이 읽는 톤으로 작성합니다.
## 산정 규칙
- 통화는 원(KRW). price.low/high, total, breakdown 금액은 **10만원 단위로 라운딩**한 정수.
- monthly · oneTime 금액은 [요금 레퍼런스]의 실제 원 단위 값을 그대로 쓴다. **10만원 단위로 라운딩하지 않는다**
  (예: 27,000원을 100,000원으로 뭉개지 말 것). "만원" 단위로 축약하지 말고 항상 실제 원 단위 정수로 쓴다 (예: "2.7" 아니라 27000).
- **price.low / price.high 는 입력 JSON 의 priceEnvelope.low / priceEnvelope.high 를 그대로 쓴다.** 절대 임의로 조정하지 말 것.
- breakdown 합계(total)는 반드시 priceEnvelope.low ~ priceEnvelope.high 범위 안. 각 항목 금액을 이 총액에 맞춰 배분한다.
- headline 에는 **금액을 넣지 않는다** (금액은 시스템이 뒤에 자동으로 붙인다). "OO 서비스 · 단계 · 약 N주" 형식.
- 최소 개발 기간은 **3주**. wbs.totalDays 는 wbs 각 행 days 합계와 일치.
- wbs 는 **정확히 5개 행**. phase 명은 순서대로 "기획·검토", "설계", "개발", "테스트(QA)", "유지보수".
  각 행 days 를 totalDays 대비 아래 비율로 배분한다:
  기획·검토 **10%** · 설계 **10%** · 개발 **30%** · 테스트(QA) **40%** · 유지보수 **10%**.
  (각 행 days 는 1일 이상 정수. 반올림으로 합이 안 맞으면 "개발" 행에서 ±조정해 5개 합 = totalDays.)
- breakdown 에는 "변경 대응 버퍼(약 15%)" 항목을 포함.
- 인프라·AI API·도메인·스토어 등 모든 단가는 아래 [요금 레퍼런스] 값만 사용한다. 외부 검색·웹조회·임의 추정 금지. 환율 1 USD ≈ 1,400원.

## 예산 트랙 (개발비 총액은 priceEnvelope 로 이미 확정되어 입력됨)
- priceEnvelope 가 작은 값(예: high ≤ 300만)이면 "소상공인 트랙" — 예산이 매우 제한적이다.
  1차 범위를 **최소 기능**으로 좁히고, 초과 요건은 outOfScope 로 2차에 미룬다.
  wbs 는 최소 3주(15영업일)만 지키고 5개 행 비율을 유지한 채 task 설명만 간결하게. 관리자 페이지는 "통계·대시보드" 여도 최소 조회 화면만.
  breakdown 항목은 4~6개로 압축하고 각 금액을 total(=priceEnvelope 범위 안)에 맞춰 배분한다.
  assumptions 에 "간소화된 최소 기능 범위 기준 견적이며, 상세 요건 확정 시 조정될 수 있습니다" 를 반드시 넣는다.
- priceEnvelope 가 큰 값이면 "정부지원·투자 트랙" — 실서비스 수준으로 범위를 넓게 잡아도 된다.
- 어느 경우든 monthly(월 운영비)·oneTime(1회성)은 실제 원가이므로 [요금 레퍼런스] 그대로 둔다 (priceEnvelope 와 무관).

## 기본 무상 포함 (includedByDefault 에 넣고, breakdown 에서 이중 계산 금지)
- 이메일 + 소셜 로그인
- 이용약관 · 개인정보 처리방침 페이지
- SSL 인증서 세팅
- 메타 픽셀 · GA 설치

## 프로젝트 유형별
- 소개·브랜드 페이지(landing): 회원/결제/앱 스코프 축소. 인프라는 AWS EC2 t2.micro + 소규모 DB.
  stack 은 Next.js. wbs 는 위 5개 행 구조·비율 유지, task 만 간결하게.
- 웹 서비스·플랫폼(web): 인프라 AWS EC2 t3.small + RDS(PostgreSQL). 기본 stack 은 Next.js(App Router, Route Handlers 로
  백엔드까지 겸함) + Prisma — 별도 백엔드 서버(NestJS 등)를 굳이 두지 않는다. 관리자 페이지가 "통계·대시보드까지 포함"이거나
  복잡한 배치·외부 연동이 필요한 경우에만 NestJS 백엔드 분리를 권장한다.
- 모바일 앱(app): stack 프론트는 React Native. oneTime 에 **Google Play 개발자 등록(1회, 약 33,000원)** 과
  **Apple Developer(연 1회, 약 137,000원)** 를 반드시 포함. 스토어 심사·배포는 "테스트(QA)" 행 task 에 포함해 서술.
- 자동화·크롤링·봇(automation): 도메인/결제/회원 항목 제외. 실행 환경(서버 / Windows PC), 크롤링 대상,
  비전 OCR 여부를 반영. schema 는 작업 큐·로그 중심.

## 기타
- 단계가 "MVP"면 assumptions 에 "MVP(가설 검증) 범위이며 대규모 트래픽 대응·고도화는 2차" 를 명시하고,
  실서비스 수준으로 과대 산정하지 말 것.
- AI 사용("네, 필요해요")이면 monthly 에 "AI API 사용료(예상)" 라인을 규모(ai_scale)에 맞춰 추가하고,
  assumptions 에 관련 전제를 넣을 것. AI 미사용이면 AI 요금 라인 없음.
- 도메인이 필요하면 oneTime 에 "도메인(.com) — 1년 주기 갱신" (약 20,000원) 포함.
- 관리자 페이지가 "통계·대시보드까지 포함"이면 관리자 항목 비중과 wbs 일수를 늘릴 것.
- feasible 은 원칙적으로 true. 대신 outOfScope 로 솔직하게 선을 그을 것(실시간 채팅, 외부 정산 연동,
  네이티브 앱 등은 2차 확장 권장 식으로).
- assumptions 에 "디자인 시안(Figma) 제공 기준 — 미제공 시 디자인 비용 별도", "결제는 PG사 1곳 연동 기준",
  "3rd party API 사용료(SMS·지도 등) 미포함" 같은 표준 전제를 포함.

## 요금 레퍼런스 (내재화 — 이 값만 사용, 검색 금지)
기준: AWS 서울 리전(ap-northeast-2) · 온디맨드 · 월 730시간 · 1 USD ≈ 1,400원 · 개략치(±15%).

### AWS 월 비용 (KRW, 반올림)
- EC2  t3.micro(1GB) 약 13,000 / t3.small(2GB) 약 27,000 / t3.medium(4GB) 약 53,000 / t3.large(8GB) 약 106,000
  (t2.micro 는 프리티어 12개월 무료, 이후 t3.micro 수준)
- EBS gp3: GB당 약 130원/월 (기본 30GB ≈ 4,000)
- RDS PostgreSQL Single-AZ  db.t3.micro 약 27,000 / db.t3.small 약 53,000 / db.t3.medium 약 106,000  (Multi-AZ ≈ 2배)
  RDS 스토리지: GB당 약 180원/월
- S3: 저장 GB당 약 35원/월 + 아웃바운드 GB당 약 175원. **초기 소규모 트래픽에서는 프리티어 내로 사실상 0원**이므로
  monthly 에 별도 라인으로 넣지 않는다 (대용량 파일 · 이미지 업로드가 핵심 기능인 서비스만 예외적으로 포함).
- ALB: 약 23,000/월 + 트래픽(LCU) → 실무 30,000~45,000
- Route 53: 호스팅 영역당 약 1,000/월
- CloudFront: 도입 시 소규모 약 10,000~30,000 (프리티어 1TB/월 내면 사실상 0)
- NAT Gateway: 약 60,000/월 — 소규모 프로젝트에는 넣지 않음

### 유형별 인프라 월 합계 가이드 (KRW, S3 초기 비용 제외 기준)
- landing: EC2 t3.micro + EBS + Route53 + 전송 → 약 20,000~40,000
- web(MVP): EC2 t3.small + RDS db.t3.micro → 약 50,000~80,000
- web(성장): EC2 t3.medium + RDS db.t3.small + ALB + CloudFront → 약 200,000~280,000 (이 단계부터는 S3 도 포함)
- automation(서버형): EC2 t3.small 단독 → 약 25,000~40,000
- monthly 는 위 가이드에 맞춰 EC2 · RDS 등 **서비스별로 항목을 나눠 각각 한 행**으로 작성한다
  (예: "AWS EC2 t3.small (월 730시간)", "AWS RDS PostgreSQL db.t3.micro").
  "AWS 인프라 비용"처럼 뭉뚱그린 단일 항목 금지 — label 에 인스턴스 타입 · 사양을 명시할 것.

### 1회성 (oneTime, KRW)
- Google Play 개발자 등록: 약 33,000 (1회) · Apple Developer Program: 약 137,000 (연 1회)
- 도메인(연): .com/.net/.co.kr/.kr 약 20,000 · .io 약 55,000 · .ai 약 110,000

### AI API (100만 토큰당 USD · 월 예상은 KRW)
- GPT-4o 입력 $2.5 / 출력 $10 · GPT-4o mini $0.15 / $0.60
- Claude Sonnet $3 / $15 · Claude Haiku $0.8 / $4 · Gemini Flash $0.075 / $0.30
- 임베딩 text-embedding-3-small $0.02 / 100만 토큰
- ai_scale 별 monthly "AI API 사용료(예상)": 소규모 약 50,000~100,000 · 중간 약 200,000~600,000 · 대규모 1,000,000 이상
  (기본은 mini/Haiku/Flash 급 가정, 고품질 필요 시 4o/Sonnet 으로 상향)

### 미포함(참고 — assumptions 에만 언급)
- SMS 건당 약 9~20원 / 알림톡 건당 약 7~11원 (솔라피·알리고)
- PG 결제 수수료: 결제액의 약 2.8~3.5% (개발비 아님)
- 이메일: AWS SES 1,000건당 약 $0.1, Resend 월 3,000건 무료`;

export const PAST_PROJECTS_CONTEXT = `## 실적 요약 (산정 근거, 2019~2026 · 약 40건)
- 예약 시스템: 방탈출 테마 예약, 전시회 예약(네이버 예약 연동), 여행사 호텔·어트랙션 예약(트립타임)
- 커머스·쇼핑몰: 의류 쇼핑몰 앱 + 결제(소코드레스, 인도네시아 버전), 동대문 도매(모이블), 아트숨
- 세무·회계 플랫폼: 미스터씨이오, 로우택스 (홈택스 데이터 기반 손익 분석)
- 의료·헬스케어: 닥터랩(병원 설문 기반 미스터리쇼퍼·환자경험평가 + PDF 리포트), KDocFinder(글로벌 의료 예약), 마이필(제약)
- 설문·리서치·리포트: D3, 아주대(통계 기반 설문), 닥터랩 결과 보고서 PDF
- 마케팅·KPI 대시보드: 디블, 자임 (구글 캠페인 API 연동)
- 매칭·소셜: 더핏럽(소개팅 MVP), 윤링크
- 계약·문서관리: 비브 (계약 상태 관리)
- 소개·브랜드 페이지 + 관리자: 해피인사이드, 미스터씨이오랩, 민정아, 다겸 홈페이지·포트폴리오
- 앱(React Native / Flutter): 지금·기분(RN, 소셜로그인·게시판·관리자), DW&I UBIS Call(Flutter, 재난 UI)
- 자동화: FM bot(네이버 예약 크롤링→DB), 아트숨(윈도우 PC AE 자동화→S3), 메이플스토리(비전 OCR), 다겸아이킷(반도체 이상탐지)
- 공통 스택: TypeScript, React/Next.js, NestJS, PostgreSQL/Prisma, AWS(EC2·ALB·S3). React Native 앱 4개+ 스토어 심사·배포 경험.`;

/* ────────────────────────────────────────────────────────────────
 * 개발비(price) 는 LLM 이 자꾸 상한을 무시해서 코드에서 확정한다.
 * priceBand: 설문 답변만으로 low/high 결정 · fitBreakdown: 합계를 범위에 맞춰 재배분
 * ──────────────────────────────────────────────────────────────── */

export type PriceBand = { low: number; high: number; track: 'gov' | 'smb' };

const round10 = (n: number) => Math.max(100_000, Math.round(n / 100_000) * 100_000);

export function priceBand(answers: Answers): PriceBand {
    const rt = answers.requester_type;
    const pt = answers.project_type;
    const stage = answers.stage;

    // 정부지원·투자 예산이 있는 창업자만 큰 트랙. 그 외(소상공인·개인·개발자·자체예산 창업자)는 축소.
    const isGov = rt === 'founder' && (answers.gov_funded === 'yes' || answers.gov_funded === 'planning');

    // 소상공인 트랙 기준 base (원). 기존 LLM 산정의 약 1/10 수준으로 낮게 잡는다.
    // 금액을 조정하려면 이 표만 고치면 된다.
    let low: number;
    let high: number;
    if (pt === 'landing') {
        [low, high] = [300_000, 600_000];
    } else if (pt === 'automation') {
        [low, high] = [500_000, 1_000_000];
    } else if (stage === 'production' || stage === 'renew') {
        [low, high] = [1_200_000, 2_000_000];
    } else {
        // web/app MVP 또는 단계 미지정
        [low, high] = [700_000, 1_200_000];
    }

    // 범위 안에서의 소폭 가산 (high 만)
    if (pt === 'app') high += 500_000; // 스토어 심사·배포
    if (answers.admin_page === 'dashboard') high += 400_000;
    if (answers.uses_ai === 'yes') high += 300_000;

    if (isGov) {
        low *= 6;
        high *= 9;
    }

    return { low: round10(low), high: round10(high), track: isGov ? 'gov' : 'smb' };
}

/** breakdown 을 목표 합계(범위 중앙값)에 비례 조정하고 total 을 재계산한다. */
export function fitBreakdown<T extends { amount: number }>(
    breakdown: T[],
    band: PriceBand,
): { breakdown: T[]; total: number } {
    const sum = breakdown.reduce((s, b) => s + (b.amount || 0), 0);
    if (sum > 0 && sum >= band.low && sum <= band.high) return { breakdown, total: sum };

    const target = round10((band.low + band.high) / 2);
    if (sum <= 0) {
        // LLM 이 금액을 안 준 경우: 균등 배분
        const each = round10(target / Math.max(1, breakdown.length));
        const eq = breakdown.map((b) => ({ ...b, amount: each }));
        return { breakdown: eq, total: eq.reduce((s, b) => s + b.amount, 0) };
    }

    const factor = target / sum;
    const scaled = breakdown.map((b) => ({ ...b, amount: round10(b.amount * factor) }));
    let total = scaled.reduce((s, b) => s + b.amount, 0);
    const drift = target - total; // 라운딩 잔차는 첫 항목이 흡수
    if (drift !== 0 && scaled.length > 0) {
        scaled[0] = { ...scaled[0], amount: Math.max(100_000, scaled[0].amount + drift) };
        total = scaled.reduce((s, b) => s + b.amount, 0);
    }
    return { breakdown: scaled, total };
}

/**
 * wbs 총 기간이 2주(14일)를 초과하면 다음 7의 배수로 올림 처리하고,
 * 남는 일수는 "테스트(QA)" 단계에 흡수시킨다 (LLM 이 준 totalDays 를 그대로 신뢰하지 않는다).
 */
export function fitWbs<T extends { phase: string; days: number }>(
    wbs: T[],
    totalDays: number,
): { wbs: T[]; totalDays: number } {
    if (totalDays <= 14) return { wbs, totalDays };
    const padded = Math.ceil(totalDays / 7) * 7;
    const diff = padded - totalDays;
    if (diff <= 0) return { wbs, totalDays };

    const idx = wbs.findIndex((r) => r.phase.includes('테스트'));
    const targetIdx = idx >= 0 ? idx : wbs.length - 1;
    const adjusted = wbs.map((r, i) => (i === targetIdx ? { ...r, days: r.days + diff } : r));
    return { wbs: adjusted, totalDays: padded };
}

/** headline 뒤에 붙일 금액 문구. "90만 ~ 150만원" / low==high 면 "약 150만원". */
export function headlineWithPrice(headline: string, band: PriceBand): string {
    const base = headline.replace(/\s*[·|,-]\s*[^·|]*만\s*원.*$/u, '').trim(); // 혹시 LLM 이 넣은 금액 제거
    const man = (n: number) => (n / 10_000).toLocaleString('ko-KR') + '만';
    const price = band.low === band.high ? `약 ${man(band.high)}원` : `${man(band.low)} ~ ${man(band.high)}원`;
    return `${base} · ${price}`;
}
