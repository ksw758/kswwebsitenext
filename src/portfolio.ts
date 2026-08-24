export type PortfolioStatus = '운영 중' | '구축 완료' | '진행 중' | '중단';

export interface PortfolioItem {
  id: string;
  title: string;
  period: string;
  status: PortfolioStatus;
  category: string;
  client?: string;
  description?: string;
  url?: string;
  stacks: string[];
  mainImage: string;
  detailImages: string[];
}

export const MyPortfolios: PortfolioItem[] = [
  {
    id: 'kdocfinder',
    title: 'K·DOC',
    period: '2025.11 ~',
    status: '진행 중',
    category: 'B2C · 글로벌 병원 매칭·예약 플랫폼',
    client: '주식회사 닥터랩',
    description:
      '해외 환자를 위한 글로벌 병원 매칭·예약 플랫폼입니다. 병원 데이터베이스 구축부터 예약 매칭, SNS 연동까지 지원합니다.',
    url: 'https://kdocfinder.com/',
    stacks: ['NestJS', 'Prisma', 'PostgreSQL', 'React'],
    mainImage: '/portfolios/kdocfinder/kdoc_main.png',
    detailImages: [
      '/portfolios/kdocfinder/kdoc_detail_backend.png',
      '/portfolios/kdocfinder/kdoc_detail_matching.png',
      '/portfolios/kdocfinder/kdoc_detail_sns.png',
    ],
  },
  {
    id: 'drlab',
    title: 'DrLab',
    period: '2024.10 - 2025.8',
    status: '구축 완료',
    category: 'B2B SaaS · 병원 경영 데이터 분석',
    client: '주식회사 닥터랩',
    description:
      '병의원 재무·경영 데이터를 대시보드로 시각화해 경영 의사결정을 돕는 SaaS입니다. 설문 기반 데이터 수집부터 대시보드 분석, 지점 확장 관리까지 지원합니다.',
    url: 'https://doctorlab.kr/',
    stacks: ['NestJS', 'React', 'TypeScript', 'PostgreSQL'],
    mainImage: '/portfolios/doctorlab/drlab_main.png',
    detailImages: [
      '/portfolios/doctorlab/drlab_detail_dashboard.png',
      '/portfolios/doctorlab/drlab_detail_expand.png',
      '/portfolios/doctorlab/drlab_detail_survey.png',
    ],
  },
  {
    id: 'thefitlove',
    title: 'TheFitLove',
    period: '2023.06 - 2024.04',
    status: '운영 중',
    category: 'B2C · 소셜/데이팅 앱',
    client: '(주)에스피에이디',
    description:
      '온라인 소개팅 플랫폼 더핏럽의 MVP 1.0 버전을 개발해서 2024년 4월까지 개발 운영 및 유지보수를 맡았습니다.',
    url: 'https://thefitlove.co.kr/',
    stacks: ['Node.js', 'React Native', 'TypeScript', 'MySQL'],
    mainImage: '/portfolios/thefitlove/fitlove_main.png',
    detailImages: [
      '/portfolios/thefitlove/fitlove_detail_app.png',
      '/portfolios/thefitlove/fitlove_detail_matching.png',
      '/portfolios/thefitlove/fitlove_detail_payment.png',
    ],
  },
  {
    id: 'mypill',
    title: 'MyPill',
    period: '2022.04 - 2023.05',
    status: '운영 중',
    category: 'B2C · 헬스테크 / 건강기능식품 커머스',
    client: '주식회사 마이필',
    description:
      '나에게 맞는 영양제 그리고 내게 필요한 영양소를 간단한 자가진단과 건강검진 자료를 통해서 파악할 수 있는 홈페이지입니다.',
    url: 'https://mypill.io/',
    stacks: ['Node.js', 'React', 'TypeScript', 'MySQL'],
    mainImage: '/portfolios/mypill/mypill_main.png',
    detailImages: [
      '/portfolios/mypill/mypill_detail_analysis.png',
      '/portfolios/mypill/mypill_detail_recommend.png',
      '/portfolios/mypill/mypill_detail_delivery.png',
    ],
  },
  {
    id: 'mrceo',
    title: 'MrCEO',
    period: '2021.02 - 2022.03',
    status: '운영 중',
    category: 'B2B SaaS · 세무회계 자동화',
    client: '미스터씨이오',
    description:
      '병의원 재무상태표 및 손익분석표 데이터와 홈택스 여신협회 신용카드 계좌이체 내역만으로 손익분석을 비교 대조 가능하게 해주는 서비스입니다.',
    url: 'https://www.mrceo.kr/',
    stacks: ['Node.js', 'React', 'TypeScript', 'MySQL'],
    mainImage: '/portfolios/mrceo/mrceo_main.png',
    detailImages: [
      '/portfolios/mrceo/mrceo_detail_crawling.png',
      '/portfolios/mrceo/mrceo_detail_finance.png',
      '/portfolios/mrceo/mrceo_detail_hr.png',
    ],
  },
];
