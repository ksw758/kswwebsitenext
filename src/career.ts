export interface CareerItem {
    id: string;
    company: string;
    role: string;
    period: string;
    isCurrent: boolean;
    description?: string;
    stacks: string[];
}

export const MyCareers: CareerItem[] = [
    {
        id: 'doctorlab',
        company: '(주)주식회사 닥터랩',
        role: '풀스택 웹(앱) 개발자',
        period: '2025.11 - ',
        isCurrent: true,
        description:
            '글로벌 병원 매칭·예약 플랫폼 K·DOC(Kdocfinder) 홈페이지 제작 및 운영을 담당 및 기존에 제작한 플랫폼 (Mr.CEO, Doctor Lab) 유지보수를 담당하고 있고, 다겸과 마찬가지로 비상주로 근무하고 있습니다. ' +
            'NestJS(Prisma, PostgreSQL) 기반 백엔드와 React 기반 프론트엔드 개발, 배포 및 유지보수를 담당하고 있습니다.',
        stacks: ['Node.js', 'NestJS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'AWS'],
    },
    {
        id: 'dagyeom',
        company: '(주)다겸',
        role: '풀스택 웹(앱) 개발자',
        period: '2020.08 - 2025.05',
        isCurrent: false,
        description:
            '다겸 재직 중 15개 이상의 프로젝트를 수행하였으며, NodeJS(NestJS), Javascript(React) 기반 웹페이지 개발, 배포 및 유지보수를 담당했습니다. ' +
            'React Native 기반 앱 개발을 통해 2건 이상의 앱 심사를 통과한 경험이 있습니다. 두 앱 모두 현재 서비스 중입니다. (Moyvle, Thefitlove)',
        stacks: ['Node.js', 'NestJS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'AWS'],
    },
    {
        id: 'fm-communications',
        company: 'FM 커뮤니케이션즈',
        role: '풀스택 웹 개발자',
        period: '2018.05 - 2020.04',
        isCurrent: false,
        description:
            '이벤트 프로모션 회사로서 이벤트 홈페이지 제작 및 배포, 사내 웹사이트 제작 및 유지보수를 담당했습니다.',
        stacks: ['jQuery', 'React', 'Node.js', 'Express.js', 'MongoDB'],
    },
    {
        id: 'cmes',
        company: 'CMES',
        role: '어플리케이션팀',
        period: '2017.02 - 2018.01',
        isCurrent: false,
        description:
            '비전머신을 활용한 공장 자동화 제품을 제공하는 회사입니다. 3D 스캐너와 PC 연동하여 Javascript 기반 소프트웨어로 응용 프로그램을 제어하는 업무를 담당했습니다.',
        stacks: ['JavaScript'],
    },
];
