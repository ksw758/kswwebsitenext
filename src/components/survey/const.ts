export type Choice = {
    value: string;   // 비교·저장·분기에 쓰는 안정적 키 (라벨과 분리)
    label: string;   // 화면 표시
    desc?: string;
};

// 문자열만 넘기면 value = label 로 취급, 세밀히 제어할 땐 Choice 객체
export type ChoiceInput = string | Choice;

export const toChoice = (c: ChoiceInput): Choice =>
    typeof c === 'string' ? { value: c, label: c } : c;

// 질문 id -> 답 (multi 는 string[])
export type Answers = Record<string, string | string[]>;

export type QuestionType = {
    id: string;
    title: string;
    type: 'single' | 'multi' | 'text' | 'number' | 'tags';
    choices?: ChoiceInput[];
    placeholder?: string;
    // number: 값 범위 / multi: 선택 개수 / tags: 태그 개수
    min?: number;
    max?: number;
    answer?: string[];
    showIf?: (answers: Answers) => boolean;
};

export const Questions: QuestionType[] = [
    {
        id: 'requester_type',
        title: '어떤 입장에서 문의하시나요?',
        type: 'single',
        // 분기의 최상위 축이라 value 를 고정 키로 둔다 (라벨 문구 바뀌어도 조건 안 깨짐)
        choices: [
            { value: 'founder', label: '스타트업 대표 · 창업자' },
            { value: 'idea', label: '개인 (아이디어 단계)' },
            { value: 'smb', label: '소상공인 · 자영업자' },
            { value: 'dev', label: '개발자 · 프리랜서' },
        ],
    },
    // project_type — 페르소나별로 2벌. 같은 id 를 공유하므로 이후 질문은 a.project_type 하나만 보면 된다.
    // 창업자는 자동화 프로그램을 제품으로 내놓지 않으므로 선택지에서 제외.
    {
        id: 'project_type',
        title: '무엇을 만들려고 하세요?',
        type: 'single',
        showIf: (a) => a.requester_type === 'founder',
        choices: [
            { value: 'landing', label: '소개 · 브랜드 페이지' },
            { value: 'web', label: '웹 서비스 · 플랫폼' },
            { value: 'app', label: '모바일 앱' },
        ],
    },
    {
        id: 'project_type',
        title: '무엇을 만들려고 하세요?',
        type: 'single',
        showIf: (a) => a.requester_type != null && a.requester_type !== 'founder',
        choices: [
            { value: 'landing', label: '소개 · 브랜드 페이지' },
            { value: 'web', label: '웹 서비스 · 플랫폼' },
            { value: 'app', label: '모바일 앱' },
            { value: 'automation', label: '자동화 · 크롤링 · 봇' },
        ],
    },

    // 소개페이지는 실서비스로 취급(단계 질문 생략), 자동화는 별도 트랙이라 생략.
    {
        id: 'stage',
        title: '이번 개발의 목표는 무엇인가요?',
        type: 'single',
        showIf: (a) => a.project_type === 'web' || a.project_type === 'app',
        choices: [
            { value: 'mvp', label: 'MVP · 가설 검증용 최소 기능' },
            { value: 'production', label: '실서비스 · 실사용자 대상' },
            { value: 'renew', label: '기존 서비스 개선 · 기능 추가' },
        ],
    },
    {
        id: 'domain',
        title: '어떤 분야의 서비스인가요?',
        type: 'single',
        showIf: (a) => a.project_type === 'web' || a.project_type === 'app',
        choices: [
            { value: 'commerce', label: '커머스 · 쇼핑몰' },
            { value: 'booking', label: '예약 시스템' },
            { value: 'tax_acc', label: '세무 · 회계' },
            { value: 'medical', label: '의료 · 헬스케어' },
            { value: 'marketing_kpi', label: '마케팅 · KPI 대시보드' },
            { value: 'survey_report', label: '설문 · 리서치 · 리포트' },
            { value: 'matching_social', label: '매칭 · 소셜' },
            { value: 'content_community', label: '콘텐츠 · 커뮤니티' },
            { value: 'contract_docs', label: '계약 · 문서 관리' },
            { value: 'influencer', label: '인플루언서 · 추천' },
            { value: 'etc', label: '기타' },
        ],
    },
    {
        // 관리자 페이지 — 과거 프로젝트 대부분에 있었음. 깊이 차이가 견적을 크게 가름.
        id: 'admin_page',
        title: '관리자 페이지가 필요하신가요?',
        type: 'single',
        showIf: (a) => a.project_type === 'web' || a.project_type === 'app',
        choices: [
            { value: 'none', label: '필요 없음' },
            { value: 'basic', label: '기본 관리 (회원 · 콘텐츠 조회/편집)' },
            { value: 'dashboard', label: '통계 · 대시보드까지 포함' },
        ],
    },
    {
        // AI 사용 여부 — 웹/앱/자동화만. AWS·AI 요금 산정의 핵심 입력.
        id: 'uses_ai',
        title: 'AI 기능을 사용하시나요?',
        type: 'single',
        showIf: (a) =>
            a.project_type === 'web' ||
            a.project_type === 'app' ||
            a.project_type === 'automation',
        choices: [
            { value: 'yes', label: '네, 필요해요' },
            { value: 'no', label: '아니요' },
            { value: 'unsure', label: '잘 모르겠어요 · 상담받고 싶어요' },
        ],
    },
    {
        // uses_ai = yes 일 때만. 요금·모델 선택에 영향.
        id: 'ai_scale',
        title: '어느 정도 규모로 쓰실 예정인가요?',
        type: 'single',
        showIf: (a) => a.uses_ai === 'yes',
        choices: [
            { value: 'light', label: '가볍게 · 내부용 · 베타 (하루 수백 건)' },
            { value: 'medium', label: '중간 · 서비스 핵심 기능 (하루 수천 건)' },
            { value: 'heavy', label: '대규모 · 트래픽 많음 (하루 수만 건 이상)' },
            { value: 'unknown', label: '아직 감이 안 와요' },
        ],
    },
    {
        // 모든 트랙 공통 (showIf 없음)
        id: 'period',
        title: '개발 기간은 얼마나 예상하시나요?',
        type: 'single',
        choices: [
            { value: 'lte_1m', label: '1개월 이내' },
            { value: '1_3m', label: '1~3개월' },
            { value: '3_6m', label: '3~6개월' },
            { value: 'gte_6m', label: '6개월 이상' },
            { value: 'undecided', label: '아직 미정 · 일정 함께 조율' },
        ],
    },
    {
        // 유지보수 기대치 — 비상주 1인 개발사라 계약 경계에 중요. 예/아니오 대신 4택.
        id: 'maintenance',
        title: '출시 이후 유지보수도 필요하신가요?',
        type: 'single',
        choices: [
            { value: 'none', label: '없음 · 인수인계 후 종료' },
            { value: 'stabilize', label: '초기 안정화만 (1개월 하자보수)' },
            { value: 'retainer', label: '월 단위 유지보수 · 운영 대행' },
            { value: 'undecided', label: '아직 모르겠음' },
        ],
    },
    {
        // 항상 마지막. 자유 입력 태그(칩) — answers.hashtags 는 string[]
        id: 'hashtags',
        title: '원하시는 서비스를 설명하는 키워드를 최소 3개만 입력해주세요.',
        type: 'tags',
        min: 3,
        placeholder: '예약, 결제, 관리자 대시보드, 등등',
    },
];

//2019
//1. 해피인사이드 (웹서비스) 해피인사이드 소개페이지
//2. 브랜드스타그램 (웹서비스, 이벤트 프로모션용), 인스타그램 크롤링 및 화면 배치
//3. FM bot (자동화 프로그램) 네이버 예약 포함 전시회 예약 플랫폼 일원화해서 DB에 저장
//4. 리버스 이스케이프 (웹서비스) 방탈출 프로그램 소개 및 테마 예약 시스템까지 구현
//2020
//1. 리멤버, 다락방 이스케이프 (웹서비스) 방탈출 프로그램 소개 및 테마 예약 시스템까지 구현
//2. 생각솜씨 (웹서비스) 기억력 기반 문제 맞추고 점수 부여 서비스
//2021
//1. 하이픈 (웹서비스) 인플루언서 플랫폼 AI기반 추천 유튜브 및 인스타그램 점수 부여해주는 서비스 MVP까지만 개발
//2. 미스터씨이오 (웹서비스) 세무회계 플랫폼
//3. 지금, 기분 (앱서비스) 최초 앱 개발, 내 기분 점수 표현, 게시판 기능, 회원가입 소셜로그인 구현 , 관리자페이지 구현
//4. 비즈블 (웹서비스) MVP까지만 구현
//5. 비브 (웹서비스) 계약문서 및 계약 상태관리 플랫폼
//6. D3 (웹서비스) 설문조사
//2022
//1. 마이필 (웹서비스) 제약회사 플랫폼
//2. 디블 (웹서비스) KPI, CPC등 마케팅 관리 플랫폼 구글 캠페인 API연동 시도까지 구현
//3. 윤링크 (웹서비스) 맹모와의수다라는 웹플랫폼 MVP
//4. DW&I UBIS Call (앱개발) 최초 플러터 앱개발 재난 신호 UI구현
//5. 미스터씨이오랩 (웹서비스) (소개페이지)
//6. 민정아 (웹서비스) (소개페이지) 민주정치아카데미 소개페이지 및 게시판기능 구현
//7. 다겸 홈페이지 (웹개발) 소개페이지, 관리자페이지 도입
//8. 소코드레스 (앱개발) 의류 쇼핑몰 및 결제 도입
//9. 아주대학교 (통계학 기반 설문조사 플랫폼)
//2023
//1. 더핏럽 (앱개발) 및 웹개발 (소개페이지)
//2. 트립타임 (웹개발) 여행사 플랫폼 호텔 및 어트랙션 예약까지 구현 항공예약은 구현 못함
//2024
//1. 로우택스 (웹서비스) 세무회계 플랫폼
//2. 자임 (웹서비스) ERP 플랫폼 KPI, CPC등 마케팅 관리 플랫폼
//3. 아트숨 (웹서비스) 쇼핑몰, 에프터 이펙트 효과 자동화로 영상과 입력 폼을 받으면 윈도우 PC에서 자동화해서 s3에 저장 사용자는 이를 다운로드받을 수 있음
//4. 다겸아이킷 (웹서비스) 공장에 반도체 이상탐지 웹서비스로 납품할 프로젝트 redis를 쓰려고 했고, 하지만 소코드레스 개발 건으로 중간에 다른 개발자에게 인수인계함
//2025
//1. 다겸 포트폴리오 (웹서비스) 다겸에서 웹서비스를 외주받을 소개페이지
//2. 닥터랩 (웹서비스) 병원 설문조사 기반 플랫폼 미스터리쇼퍼, 환자경험평가, 직원만족도 평가 설문조사 및 결과 보고서 PDF저장 구현
//3. 소코드레스 인도네시아 플랫폼 소코드레스와 같은 앱개발
//2026
//1. KDocFinder 웹, 앱서비스
//2. 상원에이전트 개인홈페이지 웹서비스
//3. 메이플스토리 자동화플랫폼 비전 OCR을 활용한 자동화 플랫폼
//4. 지금 하고있는 이거 (웹서비스)

