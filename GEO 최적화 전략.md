# GEO(생성형 엔진 최적화) 전략 — 상원(SW)에이전츠

> 목표: "1인 개발사 MVP 외주 추천해줘" 같은 질문을 ChatGPT/Claude/Perplexity에 했을 때
> 상원(SW)에이전츠가 근거 있는 소스로 인용·추천되게 만들기.
> 작성 기준: 2026년 8월

---

## 1. SEO vs GEO 한 줄 정리

- **SEO**: 구글 검색 결과 상위 노출이 목표. 링크 클릭을 유도.
- **GEO**: LLM이 답변을 생성할 때 근거 자료로 인용·요약하게 만드는 것이 목표. 클릭이 아니라 "언급"이 성과 지표.
- 전략 비중은 기술 20% : 포지셔닝·콘텐츠 권위 80%로 보는 게 정설. 기술 세팅은 최소 조건일 뿐, 실제 인용은 "이 도메인/저자가 이 주제에 신뢰할 만한가"로 갈린다.

## 2. 2026년 8월 기준 핵심 팁 (리서치 요약)

**크롤러 허용 전략이 세분화되는 중**
- 2026년 기준 신경 써야 할 7개 봇: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`(OpenAI) / `ClaudeBot`, `Claude-SearchBot`, `Claude-User`(Anthropic) / `PerplexityBot`(Perplexity) / `Google-Extended`(Google AI) / `Applebot-Extended`(Apple Intelligence).
- "학습용 크롤러"(GPTBot, ClaudeBot, Google-Extended)와 "실시간 답변용 크롤러"(OAI-SearchBot, Claude-SearchBot, PerplexityBot)를 구분해서, 인용 노출을 원하면 답변용 봇은 반드시 `Allow`, 학습 데이터 편입을 막고 싶으면 학습용 봇만 선별 `Disallow` 하는 방식이 2026년 표준으로 자리잡음.
- 무조건 `Allow: /` 로 열어두는 것도 인용 관점에서는 나쁘지 않지만, 세분화하면 "학습은 거부하되 인용은 받는" 선택이 가능.

**llms.txt가 사실상 표준 관행이 됨**
- `도메인/llms.txt`에 가장 중요한 페이지만 큐레이션한 "AI용 목차"를 제공. 전체 사이트맵이 아니라 핵심 페이지만 엄선하는 게 포인트(노이즈 페이지를 넣으면 오히려 신뢰도 희석).
- 한 의도 = 한 정규 URL 원칙. `/page`, `/page/`, `?utm=` 같은 변형 URL을 섞지 않기.

**스키마 마크업 우선순위**
- 인용 기여도가 가장 높은 3종: `Organization`, `FAQPage`, `Article`.
- 사이트 전체에 `Organization` + `WebSite`(SearchAction 포함) 1회, 각 콘텐츠 페이지에 `Article`/`Person`, 사례가 있으면 `BreadcrumbList` — 이 순서로 기초를 깐 뒤 콘텐츠 스키마를 얹는 게 권장 순서.
- FAQ 구조화 데이터는 ChatGPT/Perplexity/Google AI Overviews 인용률이 유의미하게 높다는 게 반복적으로 확인됨.

**콘텐츠 형식 — "추출하기 쉬운 페이지"가 이긴다**
- 정량 데이터, 방법론, FAQ, 구조화된 레퍼런스 페이지 형태를 AI가 선호. 각 페이지 상단에 짧은 "다이렉트 답변 블록"을 두고, 명확한 소제목으로 섹션을 쪼갤 것.
- 마크다운처럼 깔끔한 포맷이 모델의 정확도를 높이고 토큰 사용도 줄인다는 벤치마크 결과.

**측정은 여전히 수작업 위주**
- 타겟 질의 세트를 만들어 매주 ChatGPT/Claude/Perplexity/Gemini에 직접 물어보고 어떤 소스가 인용되는지 기록하는 게 가장 확실한 방법(전용 트래킹 툴이 있지만 자체 점검만으로도 방향은 잡힘).

Sources:
- [GEO, AEO, and SEO in 2026: The enterprise guide to AI visibility](https://writer.com/blog/geo-aeo-optimization/)
- [Mastering generative engine optimization in 2026: Full guide](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [llms.txt for GEO: What It Is and Why It Matters (2026)](https://theambitionsagency.com/llms-txt-for-geo/)
- [llms.txt Standard: Complete Implementation Guide for 2026](https://whatsmygeoscore.com/llms-txt-standard-implementation-guide-ai-crawlers-2026/)
- [AI Crawlers Explained: GPTBot, ClaudeBot, PerplexityBot and How to Let Them In (2026)](https://www.anagram.ai/blog/ai-crawlers-explained-gptbot-claudebot-perplexitybot-and-how-to-let-them-in-2026)
- [Robots.txt & AI Crawlers in 2026: The Full Guide](https://dataimpulse.com/blog/robots-txt-ai-crawlers/)
- [The Ultimate Schema Markup Guide For GEO, AEO And AI Overviews](https://201creative.com/structured-data-ai-search/)
- [7 Technical GEO Fixes Web Agencies Should Offer in 2026](https://www.demandlocal.com/blog/technical-geo-fixes-web-agencies/)
- [Are FAQ Schemas Important for AI Search, GEO & AEO?](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)

---

## 3. 현재 프로젝트(kswwebsitenext) 진단

코드를 직접 확인한 결과:

| 항목 | 현황 | 평가 |
|---|---|---|
| `robots.ts` | `userAgent: '*', allow: '/'` — 전체 허용 | 나쁘지 않지만 학습/답변 봇 구분 없음 |
| `sitemap.ts` | 홈/이력서/블로그 목록/coding/블로그 글 포함 | 포트폴리오 개별 URL 없음 (치명적) |
| `llms.txt` | 없음 | 미구현 |
| JSON-LD | 블로그 상세(`BlogPosting`)에만 존재 | 홈페이지에 `Organization`/`Person`/`FAQPage` 없음 |
| 홈페이지 구조 | Header→Main→Processing→**Portfolio**→VibeCoding→Pricing→Career→Footer, 전부 **단일 페이지 섹션** | MrCEO/MyPill 등 사례가 고유 URL이 없어 AI가 "이 사례를 근거로" 인용할 페이지 자체가 없음 |
| 도메인 | `https://kswwebsitenext.vercel.app` (Vercel 서브도메인) | 커스텀 도메인 대비 권위 신호 약함 |
| 메타데이터 | title/description에 "1인 개발 에이전시", "MVP", "바이브코딩" 키워드 이미 포함 | 양호, 브랜드 엔티티명("상원(SW)에이전츠") 일관 사용 중 |
| 콘텐츠 자산 | 블로그(`/blog`) 운영 중 | 질문형(PAA) 포스팅 비중 확인 필요 |

**가장 큰 구조적 문제**: 포트폴리오·서비스·가격이 전부 홈페이지 한 페이지 안의 섹션이라, AI가 "상원(SW)에이전츠가 세무회계 자동화 SaaS를 만든 사례"를 인용하려 해도 가리킬 수 있는 개별 URL이 없다. GEO는 "이 URL을 근거로 답한다"는 구조이기 때문에, 섹션이 아니라 **페이지 단위 콘텐츠**가 있어야 인용 대상이 된다.

---

## 4. 실행 과제 (우선순위 순)

### 🔴 1순위 — 인용 가능한 개별 페이지 만들기
포트폴리오 프로젝트마다 `/portfolio/[slug]` 페이지 신설. 각 페이지에:
- 문제 상황 → 해결 방식 → 사용 기술 → 성과(가능하면 숫자)를 명확한 소제목으로 구조화
- 상단에 2~3문장 "다이렉트 답변 블록" (예: "MrCEO는 홈택스·여신금융협회 데이터를 크롤링해 병의원 손익분석을 자동화한 세무회계 SaaS입니다.")
- `Article` + `BreadcrumbList` JSON-LD
- `sitemap.ts`에 자동 등록

### 🔴 1순위 — 홈페이지에 Organization/WebSite 스키마 추가
`app/layout.tsx`의 `<head>`에 사이트 전체 공통 JSON-LD 삽입:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "상원(SW)에이전츠",
  "url": "https://kswwebsitenext.vercel.app",
  "founder": { "@type": "Person", "name": "김상원" },
  "description": "9년차 풀스택 개발자의 1인 개발 에이전시. 웹사이트·앱 MVP·바이브코딩 최적화 외주.",
  "areaServed": "KR",
  "knowsAbout": ["웹 개발", "앱 개발", "MVP 개발", "바이브코딩", "세무회계 자동화 SaaS"]
}
```

### 🟠 2순위 — llms.txt 신설
`public/llms.txt` (또는 `app/llms.txt/route.ts`)에 핵심 페이지만 큐레이션:
```
# 상원(SW)에이전츠

> 9년차 풀스택 개발자의 1인 개발 에이전시. 웹/앱 MVP, 바이브코딩 최적화 외주 전문.

## 핵심 페이지
- [홈 / 서비스 소개](https://kswwebsitenext.vercel.app)
- [이력서 / 경력](https://kswwebsitenext.vercel.app/my-resume)
- [포트폴리오 — MrCEO (세무회계 자동화 SaaS)](https://kswwebsitenext.vercel.app/portfolio/mrceo)
- [블로그](https://kswwebsitenext.vercel.app/blog)
```
(포트폴리오 개별 페이지가 만들어진 뒤 채워 넣기)

### 🟠 2순위 — robots.ts 세분화
현재 `allow: '/'` 하나뿐인데, AI 답변 봇은 명시적으로 허용하고 학습 봇 정책은 별도로 정하는 편이 신뢰도 신호에 유리:
```ts
rules: [
  { userAgent: '*', allow: '/' },
  { userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot'], allow: '/' },
  // 학습 데이터 편입을 막고 싶다면 아래처럼 별도 차단 (선택)
  // { userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended'], disallow: '/' },
],
```

### 🟡 3순위 — FAQ 섹션 + FAQPage 스키마
홈페이지 하단 또는 별도 `/faq` 페이지에 실제 문의에서 자주 나온 질문 반영:
- "1인 개발사인데 유지보수는 어떻게 하나요?"
- "MVP 개발 기간·비용은 보통 얼마나 걸리나요?"
- "바이브코딩 기반 개발과 일반 외주 개발 차이는 뭔가요?"
→ 각 질문/답변을 `FAQPage` JSON-LD로 마크업.

### 🟡 3순위 — 블로그를 PAA(연관 질문) 기반으로
"웹 개발 외주 비용", "MVP 외주 절차", "1인 개발사 장단점" 등 잠재 고객이 AI에게 실제로 물어볼 만한 질문형 제목으로 포스팅 방향 조정. 이미 운영 중인 `/blog`를 그대로 활용 가능.

### ⚪ 검토 사항 — 커스텀 도메인
`kswwebsitenext.vercel.app` 서브도메인은 도메인 권위 신호가 약함. 자체 도메인(예: `sangwonagency.kr`) 연결을 장기 과제로 검토.

---

## 5. 측정 루틴

매주 ChatGPT / Claude / Perplexity에 아래 유형 질의를 직접 던져서 인용 여부 기록:
- "1인 개발사 MVP 외주 추천해줘"
- "웹/앱 개발 외주 잘하는 곳"
- "바이브코딩 기반 개발 외주"
- "세무회계 자동화 SaaS 개발 사례"

인용되면 어떤 페이지가 근거로 잡히는지 확인 → 그 페이지 콘텐츠를 강화하는 식으로 반복.
