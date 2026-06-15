import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/src/providers";
import { Analytics } from "@vercel/analytics/next";
import ChatBotButton from "@/src/components/ChatBotButton";

const BASE_URL = 'https://kswwebsitenext.vercel.app';

export const metadata: Metadata = {
  title: "상원(SW)에이전츠 — 웹/앱 개발 외주",
  description: "9년차 풀스택 개발자의 1인 개발 에이전시. 웹사이트·앱 MVP·바이브코딩 최적화 외주 문의 환영합니다.",
  verification: {
    google: "L-gaRKwDCq9XUbhsfo3EThou8iGKncg_upDOT88hEb8",
  },
  openGraph: {
    title: "상원(SW)에이전츠 — 웹/앱 개발 외주",
    description: "9년차 풀스택 개발자의 1인 개발 에이전시. 웹사이트·앱 MVP·바이브코딩 최적화 외주 문의 환영합니다.",
    url: BASE_URL,
    siteName: "상원(SW)에이전츠",
    images: [
      {
        url: `${BASE_URL}/images/my_profile.jpg`,
        width: 1200,
        height: 630,
        alt: "상원(SW)에이전츠 — 웹/앱 개발 외주",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "상원(SW)에이전츠 — 웹/앱 개발 외주",
    description: "9년차 풀스택 개발자의 1인 개발 에이전시. 웹사이트·앱 MVP·바이브코딩 최적화 외주 문의 환영합니다.",
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
      <head>
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "9279306";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);
              })(window.lintrk);
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display:'none'}} alt="" src="https://px.ads.linkedin.com/collect/?pid=9279306&fmt=gif" />
        </noscript>
      </head>
      <body style={{ margin: 'auto', overflowX: 'hidden', overflowY: 'scroll' }}>
        <Providers>{children}</Providers>
        <ChatBotButton />
        <Analytics />
      </body>
    </html>
  );
}
