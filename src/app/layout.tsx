import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

// Geist 폰트 설정 (모던하고 깔끔한 산세리프)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO 메타데이터 설정
export const metadata: Metadata = {
  title: "도노트 (Donote) - 마음을 적는 가장 가벼운 후원",
  description: "한국형 마이크로 후원 플랫폼. 회원가입 없이 10초 만에 크리에이터를 응원하세요. 토스, 카카오, 네이버페이 지원.",
  keywords: ["후원", "크리에이터", "도노트", "donote", "마이크로 후원", "팁", "개발자 후원"],
  authors: [{ name: "Donote Team" }],
  openGraph: {
    title: "도노트 (Donote) - 마음을 적는 가장 가벼운 후원",
    description: "한국형 마이크로 후원 플랫폼. 회원가입 없이 10초 만에 크리에이터를 응원하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "도노트",
    url: "https://donote.site",
  },
  twitter: {
    card: "summary_large_image",
    title: "도노트 (Donote)",
    description: "마음을 적는 가장 가벼운 후원",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://donote.site",
  },
};

// 루트 레이아웃 컴포넌트
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F9F9F9] dark:bg-gray-900 text-[#333333] dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
