import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/src/providers";

const BASE_URL = 'https://kswwebsitenext.vercel.app';

export const metadata: Metadata = {
  title: "Kim Sang Won",
  description: "풀스택 개발자 김상원 포트폴리오 — 웹/앱 개발 외주 문의 환영합니다.",
  verification: {
    google: "L-gaRKwDCq9XUbhsfo3EThou8iGKncg_upDOT88hEb8",
  },
  openGraph: {
    title: "Kim Sang Won — Full Stack Developer",
    description: "풀스택 개발자 김상원 포트폴리오 — 웹/앱 개발 외주 문의 환영합니다.",
    url: BASE_URL,
    siteName: "Kim Sang Won",
    images: [
      {
        url: `${BASE_URL}/images/my_profile.jpg`,
        width: 1200,
        height: 630,
        alt: "Kim Sang Won — Full Stack Developer",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kim Sang Won — Full Stack Developer",
    description: "풀스택 개발자 김상원 포트폴리오 — 웹/앱 개발 외주 문의 환영합니다.",
    images: [`${BASE_URL}/images/my_profile.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 'auto', overflowX: 'hidden', overflowY: 'scroll' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
