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
- 통화는 원(KRW). price.low/high, total, breakdown/monthly/oneTime 금액은 **10만원 단위로 라운딩**한 정수.
- 최소 개발 기간은 **3주**. wbs.totalDays 는 wbs 각 행 days 합계와 일치.
- breakdown 합계 = total. total 은 price.low~price.high 범위 안(중간~상단)이어야 함.
- breakdown 에는 "변경 대응 버퍼(약 15%)" 항목을 포함.

## 기본 무상 포함 (includedByDefault 에 넣고, breakdown 에서 이중 계산 금지)
- 이메일 + 소셜 로그인
- 이용약관 · 개인정보 처리방침 페이지
- SSL 인증서 세팅
- 메타 픽셀 · GA 설치

## 프로젝트 유형별
- 소개·브랜드 페이지(landing): 회원/결제/앱 스코프 축소. 인프라는 AWS EC2 t2.micro + 소규모 DB.
  stack 은 Next.js. wbs 는 3~4단계로 간결하게.
- 웹 서비스·플랫폼(web): 인프라 AWS EC2 t3.small + RDS(PostgreSQL) + S3. stack 은 Next.js + NestJS + Prisma.
- 모바일 앱(app): stack 프론트는 React Native. oneTime 에 **Google Play 개발자 등록(1회, 약 33,000원)** 과
  **Apple Developer(연 1회, 약 137,000원)** 를 반드시 포함. wbs 에 "스토어 심사·배포" 단계 추가.
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
- monthlyNote 는 "월 약 {monthly 합계}원 · 초기 개발비와 별도" 형식.`;

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
