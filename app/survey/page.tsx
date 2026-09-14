import type { Metadata } from 'next';
import Survey from "@components/survey";

const TITLE = '프로젝트 견적 확인 간단한 설문 — 상원(SW)에이전츠';
const DESCRIPTION = '간단한 설문에 답하면 웹·앱 개발 WBS·예상 견적·DB 스키마를 1분 만에 확인할 수 있습니다.';
const URL = 'https://kswwebsitenext.vercel.app/survey';

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: URL,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
    },
};

const Page = () => {
    return <Survey/>
};

export default Page;
