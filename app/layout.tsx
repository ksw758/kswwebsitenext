import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/src/providers";

export const metadata: Metadata = {
  title: "Kim Sang Won",
  description: "Kim Sang Won's personal website — full stack developer",
  verification: {
    google: "L-gaRKwDCq9XUbhsfo3EThou8iGKncg_upDOT88hEb8",
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
