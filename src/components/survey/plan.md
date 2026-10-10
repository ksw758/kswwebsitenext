# AI 견적·WBS 설문 서비스 (`/estimate`) — 구현 계획서

> 이 문서는 **문서(계획)만** 담는다. 코드 작업 없음.

## 1. 배경 / 목적

김상원(상원SW에이전츠)의 외주 유입을 늘리기 위한 실험. 스타트업 대표·홈페이지 제작 희망자가
**간단한 설문**만 채우면 백엔드 AI가 아래를 뽑아 화면에 보여주고, 마지막에 연락처를 남기면
문의(리드)로 이어진다.

- WBS (phase → task, 일수, 의존관계)
- 라운딩 견적 (항목별 금액, 소계, 변경 버퍼, 총액, 최소 N주)
- DB 스키마 (테이블·컬럼)
- 작업 범위
- 인프라 / AI 서비스 월 요금
- 버전 관리 전략
- 다중 개발자 참여 가능여부

손그림 노트(랜딩 카피, ~18문항, 취합 항목, Submit Contact)가 요구사항 기준이다.

## 2. UX/UI 방향

벤치마크는 **토스**(``):

- 한 화면에 한 질문
- 좌상단 큰 헤드라인 + 넉넉한 여백
- 하단 고정 1차 CTA (풀와이드, 라운드, 블루)
- 아이콘 + 라벨 + 보조문구 리스트 행 ("선택" pill)
- 진행률 바 / 로딩·진행 화면 ("잠시만 기다려주세요 / NN% 완료")

포트폴리오 홈(양피지·금색·serif)과 톤이 완전히 다르므로 **깔끔한 화이트·모바일 우선**의
**별도 라우트**로 분리한다. v1 **한국어 전용**(i18next 미연동).

`<input>` `<button>` 등에 **canvas 기반 가벼운 마이크로 인터랙션**(포커스 글로우, 버튼 프레스 리플,
포인터 추적 그라데이션). `prefers-reduced-motion` 존중.

## 3. 작업 범위 (사용자 확정 사항)

| 항목 | 결정 |
|---|---|
| 전체 범위 | **엔드투엔드 동작본**: 랜딩 → 설문 플로우 → (모의) 생성 API → 결과 화면 → 연락처 제출 → 완료. `npm run dev`로 전 구간 실동작 |
| 설문 문항 정의 (`Survey/const.ts`, `Survey/form.tsx`) | **사용자 소유**. 나는 **타입 계약만** 제공, 파일엔 타입 스켈레톤 + TODO만. 동작용 실제 문항/렌더러는 `*.example` / `*.default` 동반 파일에 두고, 사용자가 채우면 그쪽이 자동 우선 |
| AI 생성 백엔드 | **사용자가 직접 구축**. 나는 요청/응답 **계약(zod 스키마)** + 계약을 만족하는 **모의 route**만. 사용자는 route 본문만 `generateObject` 등으로 교체 |
| 생성 결과 처리 | **결과 화면 표시만**. 이메일/DB/PDF 없음. 단, 플로우 끝 연락처 제출은 기존 `POST /api/v1/inquiry`(nodemailer) 재사용 — 설문 요약을 `contents`에 접어 리드로 전달 |

## 4. 재사용할 기존 자산

- `../../lib/guard.ts` → `isSameOrigin(req)`
- `../../lib/rateLimit.ts` → `checkRateLimit(key, limit, windowMs)`, `clientIp(req)`
- `../../../app/api/v1/inquiry/route.ts` → 리드 메일 패턴 + 연락처/이메일 검증 (`EMAIL_RE`, phoneDigits 8~15)
- `../../../app/api/chat/route.ts` → 입력 크기 제한 + same-origin + rate limit route 골격
- `../../hooks/useIsMobile.ts`
- deps (설치 불필요): `ai@6`, `@ai-sdk/openai`, `zod@4`, `axios`, `immer`, `zustand`
- Route Handler 규약: `Response.json`, POST는 캐시 안 됨
  (`../../../node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` 확인 완료)

## 5. 라우트 / 진입점

- **`app/estimate/page.tsx`** — 서버 셸 + `export const metadata`(한국어). 포트폴리오 Header/Footer 없이
  `<Survey />`(클라이언트)만 렌더. 루트 `../../../app/layout.tsx`(i18n Provider, fbq/LinkedIn, `ChatBotButton`,
  Analytics)는 그대로 감싼다.
- **`../../../app/page.tsx`** — `VibeCoding`과 `Pricing` 사이에 `<EstimateCTA />` 섹션 삽입 (양피지 톤, 노트 카피,
  `/estimate`로 가는 링크 버튼). 위치는 이후 조정 가능.
- **`app/api/v1/estimate/generate/route.ts`** — 모의 생성 API (아래 8절).

## 6. 컴포넌트 구조 (``)

```
index.tsx              (스텁 채움) 오케스트레이터: useSurveyMachine + phase별 step 렌더 + CanvasFXProvider
types.ts               ★타입 계약(내 소유): QuestionKind, Choice, SurveyQuestion, AnswerValue,
                          SurveyAnswers, SurveyConfig, QuestionBodyProps, GenerateRequest, GenerateResponse
schema.ts              GenerateResponse의 zod 스키마 (모의 route + 사용자 실제 구현이 공유)
const.ts               (스텁: 타입 스켈레톤 + TODO만)
                          export const SURVEY: SurveyConfig = { landing, questions: [] }
const.example.ts       손그림 노트 기반 시작 문항 + 랜딩 카피 (동작용). questions 비면 index가 폴백
form.tsx               (스텁: 타입 스켈레톤 + TODO만)
                          export { QuestionBody } from './steps/QuestionBody.default'
useSurveyMachine.ts    useReducer: phase('landing'|'question'|'generating'|'result'|'contact'|'done'),
                          index, answers, 조건부 문항(visibleWhen) 반영 진행률,
                          START/ANSWER/NEXT/BACK/SUBMIT_SURVEY/GO_CONTACT/SUBMIT_CONTACT
steps/
  Landing.tsx          히어로: eyebrow + 큰 타이틀 + 서브 + "시작하기"
  QuestionScreen.tsx   한 문항 래퍼: 상단 BackBar+ProgressBar, 큰 헤드라인,
                          본문 슬롯 → form.tsx의 QuestionBody 위임, 하단 고정 PrimaryButton
  QuestionBody.default.tsx  kind별 기본 렌더러 (single/multi/yesno=ChoiceRow,
                          text/longtext/number=TextField, range=슬라이더). form.tsx 채워지기 전까지 사용
  Generating.tsx       "잠시만 기다려주세요 / NN% 완료" 진행 화면 + CanvasFX 파티클, fetch 진행
  Result.tsx           GenerateResponse 렌더: 요약 / 작업범위 리스트 / WBS(phase→task 표) /
                          라운딩 견적(항목·소계·버퍼·총액·최소 N주·가정) / 인프라·AI 요금 /
                          DB 스키마(테이블·컬럼) / 버전 관리 / 다중 개발자 가능여부. 하단 "연락처 남기기"
  ContactStep.tsx      이메일 / 전화번호 / 짧은 코멘트 → axios POST /api/v1/inquiry
                          (name = "설문 신청자"(또는 이메일 로컬파트), company 생략, isAgreement 체크박스,
                          contents = 코멘트 + "\n\n---\n설문 요약:\n" + answers 요약 + 견적 총액)
  Done.tsx             접수 확인 화면
ui/
  BackBar.tsx          좌상단 chevron (<)
  ProgressBar.tsx      상단 진행 바
  PrimaryButton.tsx    하단 고정 풀와이드 라운드 CTA. pointerdown 시 useCanvasFX().ripple(x,y)
  ChoiceRow.tsx        아이콘+라벨+보조문구 행 + "선택" pill. focus/hover 시 glow
  TextField.tsx        라벨 + 입력. focus 시 useCanvasFX().glow(rect), blur 시 해제
canvas/
  CanvasFX.tsx         CanvasFXProvider(context) + 화면 뒤 고정 <canvas> 1장.
                          ripple/glow/pointer 큐를 모아 그림. reduced-motion이면 모션 off
  useCanvasFX.ts       단일 RAF 루프, DPR 스케일, ResizeObserver, reduced-motion 가드, effect 큐 API
  effects.ts           ripple(확장·페이드 링), glow(요소 bounds 소프트 헤일로),
                          pointerGradient(포인터 추적 은은한 방사형, lerp)
```

**폴백 규칙** — `index.tsx`는 `SURVEY.questions.length ? SURVEY.questions : EXAMPLE.questions`,
`QuestionScreen`은 `form.tsx`의 `QuestionBody`(초기엔 `DefaultQuestionBody` 재노출)를 호출.
사용자가 `const.ts`/`form.tsx`를 채우면 코드 수정 없이 그쪽이 동작한다.

## 7. 타입 계약 (`types.ts`) — 사용자가 이 계약 기준으로 작업

```ts
export type QuestionKind = 'single' | 'multi' | 'yesno' | 'text' | 'longtext' | 'number' | 'range';

export interface Choice { value: string; label: string; sublabel?: string; icon?: string }

export interface SurveyQuestion {
  id: string;
  kind: QuestionKind;
  title: string;              // 화면 상단 큰 헤드라인
  description?: string;
  choices?: Choice[];         // single / multi / yesno
  placeholder?: string;
  required?: boolean;
  min?: number; max?: number; unit?: string;
  visibleWhen?: (a: SurveyAnswers) => boolean;   // 조건부 노출 (예: "웹/앱? (MVP 선택 시)")
}

export type AnswerValue = string | string[] | number | boolean | null;
export type SurveyAnswers = Record<string, AnswerValue>;

export interface SurveyConfig {
  landing: { eyebrow?: string; title: string; subtitle: string; cta: string; footnote?: string };
  questions: SurveyQuestion[];
}

// form.tsx 계약
export interface QuestionBodyProps {
  question: SurveyQuestion;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
  onCommitNext?: () => void;   // single은 선택 즉시 다음 화면
}

// API 계약
export interface GenerateRequest { answers: SurveyAnswers }

export interface GenerateResponse {
  summary: string;
  scope: { title: string; detail?: string }[];
  wbs: { phase: string; tasks: { name: string; estimateDays: number; depends?: string[] }[] }[];
  estimate: {
    currency: 'KRW';
    lines: { label: string; amount: number }[];   // 개발 / QA / 버퍼 / 인프라 등
    subtotal: number; buffer: number; total: number;   // total = 라운딩
    minWeeks: number;                                  // 최소 3주 규칙
    assumptions: string[];
  };
  infra: { provider: string; monthlyCostKRW: number; notes?: string }[];
  aiServices: { name: string; purpose: string; monthlyCostKRW: number }[];
  dbSchema: { table: string; columns: { name: string; type: string; note?: string }[] }[];
  versioning: string;
  multiDev: { feasible: boolean; rationale: string };
}
```

`schema.ts`는 위 `GenerateResponse`를 zod로 1:1 미러링. 모의 route와 사용자 실제 구현이 동일 스키마로 검증.

## 8. 모의 API (`app/api/v1/estimate/generate/route.ts`)

- `POST`, `isSameOrigin` 가드 + `checkRateLimit(\`estimate:${clientIp(req)}\`, 5, 10*60*1000)`
- body 크기 상한, `GenerateRequest` 파싱
- 본문: answers를 대충 반영한 **결정적 샘플** `GenerateResponse` 생성
  (문항 수·선택값으로 일수/금액 스케일, `minWeeks = max(3, ...)`, `total`은 10만원 단위 라운딩),
  `schema.ts`로 검증 후 반환, ~800ms 지연
- 파일 상단 주석: `// MOCK — 김상원이 AI(generateObject 등) 구현으로 교체. 스키마(schema.ts)는 유지.`

## 9. Canvas 애니메이션 설계

- `CanvasFXProvider`가 화면 뒤(`position: fixed; inset: 0; z-index: 0; pointer-events: none`)
  `<canvas>` 1장 마운트
- `useCanvasFX()` → `{ ripple(x,y), glow(domRect|null, key), setPointer(x,y) }`.
  컴포넌트별 canvas 없이 공유 큐에 push
- `useCanvasFX.ts`: 단일 RAF 루프, `devicePixelRatio` 스케일, `ResizeObserver` 리사이즈,
  `matchMedia('(prefers-reduced-motion: reduce)')` → 모션 비활성
- `effects.ts`: ripple(반경 확장 + alpha 감쇠), glow(rect 주변 blur 그라데이션 링, 포커스 유지 동안),
  pointerGradient(마지막 포인터 좌표로 은은한 방사형, lerp 추적)
- `PrimaryButton` → pointerdown에서 로컬 좌표로 `ripple`
- `TextField` / `ChoiceRow` → focus에서 `getBoundingClientRect()`로 `glow`, blur에서 `glow(null)`

## 10. 생성 / 수정 파일 목록

**생성**
- `app/estimate/page.tsx`
- `app/api/v1/estimate/generate/route.ts`
- ``: `types.ts`, `schema.ts`, `const.example.ts`, `useSurveyMachine.ts`,
  `steps/{Landing,QuestionScreen,QuestionBody.default,Generating,Result,ContactStep,Done}.tsx`,
  `ui/{BackBar,ProgressBar,PrimaryButton,ChoiceRow,TextField}.tsx`,
  `canvas/{CanvasFX.tsx,useCanvasFX.ts,effects.ts}`
- `src/components/EstimateCTA.tsx`

**수정 (스텁 → 실제)**
- `index.tsx` — 오케스트레이터
- `const.ts` — 타입 스켈레톤 + `// TODO(김상원): 문항 정의`
- `form.tsx` — `export { QuestionBody } from './steps/QuestionBody.default'` + TODO
- `../../../app/page.tsx` — `<EstimateCTA />` 삽입

**손대지 않음**: `Survey/assets/*`(벤치마크 참고용), 기존 포트폴리오 컴포넌트/라우트,
prisma 스키마(새 모델 없음 → 마이그레이션 불필요)

## 11. 검증 방법

1. `npm run dev` → `/estimate` 접속
2. 랜딩 "시작하기" → `const.example.ts` 문항을 single/multi/yesno/text로 응답.
   조건부 문항이 선택에 따라 나타났다 사라지는지, 진행률이 맞는지, BackBar 뒤로가기 확인
3. 마지막 문항 후 Generating 화면(NN% + 캔버스 파티클) → `/api/v1/estimate/generate` 모의 응답 →
   Result 화면에 WBS 표 / 라운딩 견적 / DB 스키마 / 인프라·AI 요금 / 버전 관리 / 다중 개발자 가능여부 렌더
4. "연락처 남기기" → 이메일·전화번호·코멘트 입력 → 제출 → 기존 inquiry 메일이 김상원 메일함에 도착
   (설문 요약 포함) → Done 화면
5. 크롬 devtools 모바일 뷰포트에서 토스식 단일 컬럼 확인
6. OS "동작 줄이기(reduce motion)" 켠 상태에서 캔버스 모션 꺼짐 확인
7. `npm run build` (prisma generate + next build) 통과
8. (선택) claude-in-chrome으로 `/estimate` 플로우 GIF/스크린샷

## 12. 인수인계 (사용자 몫)

- **`Survey/const.ts`** — `const.example.ts`를 참고해 실제 ~18문항 + 랜딩 카피 확정.
  채우면 example는 무시됨
- **`Survey/form.tsx`** — kind별 커스텀 렌더러가 필요하면 `QuestionBody`를 직접 구현
  (`QuestionBody.default`가 기본값). `QuestionBodyProps` 계약 유지
- **`app/api/v1/estimate/generate/route.ts`** — 모의 본문을 실제 AI
  (`generateObject({ schema: GenerateResponseSchema, ... })`)로 교체.
  `schema.ts` / `types.ts` 계약은 그대로. 레이트리밋 + 비용 하드캡 권장

## 13. 손그림 노트 → 설문 문항 초안 (const.example.ts 시드)

> 실제 확정은 사용자. 아래는 동작 시드 + 참고.

| # | id | kind | 질문 | 비고 |
|---|---|---|---|---|
| 1 | is_founder | yesno | 스타트업 대표님이신가요? | |
| 2 | service_type | single | 어떤 서비스를 원하시나요? | 레퍼런스/보기 이미지 첨부 여지 |
| 3 | product_stage | single | MVP인가요, 실서비스인가요? | |
| 4 | timeline | single | 기간은 언제까지 생각하시나요? | |
| 5 | platform | multi | 웹인가요 앱인가요? | `visibleWhen`: stage=MVP일 때만 |
| 6 | server_infra | single | 서버 인프라 구조 | AWS / Azure / Vercel / 카페24 |
| 7 | domain_registrar | single | 도메인은 어디서? | AWS / 가비아 / 기타 |
| 8 | uses_ai | single | AI를 사용하나요? | GPT / Gemini / Claude / 미사용 |
| 9 | realtime_features | multi | 필요한 실시간 기능 | WebRTC 호출 / OCR / 없음 |
| 10 | needs_payment | yesno | 결제가 필요한가요? | |
| 11 | needs_dashboard | yesno | 관리자 대시보드가 필요한가요? | |
| 12 | needs_auth | yesno | 회원 기능이 필요한가요? | |
| 13 | needs_social_login | yesno | 소셜 로그인이 필요한가요? | `visibleWhen`: needs_auth=yes |
| 14 | needs_webhook | yesno | 외부 웹훅 연동이 있나요? | |
| 15 | expected_users | number | 예상 동시 사용자 수 | unit: 명 |
| 16 | multi_dev_ok | yesno | 여러 개발자 참여가 가능한 프로젝트인가요? | |
| 17 | notes | longtext | 추가로 알려주실 내용 | |

노트의 원칙: *"프로젝트는 변경 확률이 있는 부분 — 견적엔 버퍼를, 최소 3주는 잡아준다."*
→ `GenerateResponse.estimate.buffer`, `estimate.minWeeks >= 3`으로 반영.
