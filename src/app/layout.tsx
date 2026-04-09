import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SiteForge - \u53f0\u7063\u54c1\u724c\u5efa\u7ad9\u5de5\u5177",
  description:
    "\u91dd\u5c0d\u53f0\u7063\u4e2d\u5c0f\u54c1\u724c\u8a2d\u8a08\u7684\u8a02\u95b1\u5236\u975c\u614b\u5b98\u7db2\u5efa\u7ad9\u5de5\u5177\u3002\u7e41\u9ad4\u4e2d\u6587\u6392\u7248\u512a\u5316\uff0c\u6b50\u7f8e\u7c21\u7d04\u8cea\u611f\u7248\u578b\u3002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${dmSans.variable} ${dmMono.variable} ${notoSansTC.variable} ${notoSerifTC.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
