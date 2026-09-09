import type { ReactNode } from 'react';
import localFont from 'next/font/local';

/**
 * toss.im 본문·제목 서체는 비공개 독점 폰트라 재배포·셀프호스팅 불가.
 * 같은 인상을 주는 오픈 대체 서체 Pretendard(SIL OFL 1.1, 상업적 사용 무료)를
 * /survey 라우트 하위에만 적용한다. (라이선스: app/survey/fonts/LICENSE.txt)
 */
const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  weight: '45 920',
  display: 'swap',
  variable: '--font-survey',
});

export default function SurveyLayout({ children }: { children: ReactNode }) {
  return <div className={pretendard.className}>{children}</div>;
}