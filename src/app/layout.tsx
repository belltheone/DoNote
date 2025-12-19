import type { Metadata } from "next";
import { Geist, Geist_Mono, Gamja_Flower, Hi_Melody } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";

// Geist 폰트 설정 (영문/숫자용 보조)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 손글씨 폰트 (제목용)
const gamjaFlower = Gamja_Flower({
  weight: "400",
  variable: "--font-gamja",
  subsets: ["latin"],
});

const hiMelody = Hi_Melody({
  weight: "400",
  variable: "--font-himelody",
  subsets: ["latin"],
});

// SEO 메타데이터 설정 (강화)
export const metadata: Metadata = {
  title: "도노트 (Donote) - 마음을 적는 가장 가벼운 후원",
  description: "한국형 마이크로 후원 플랫폼. 회원가입 없이 10초 만에 크리에이터를 응원하세요. 토스, 카카오, 네이버페이 지원.",
  keywords: ["후원", "크리에이터", "도노트", "donote", "마이크로 후원", "팁", "개발자 후원", "블로거 후원", "작가 후원"],
  authors: [{ name: "Donote Team" }],
  creator: "Donote",
  publisher: "Donote",

  // Open Graph (Facebook, LinkedIn etc.)
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://donote.site",
    siteName: "도노트",
    title: "도노트 (Donote) - 마음을 적는 가장 가벼운 후원",
    description: "한국형 마이크로 후원 플랫폼. 회원가입 없이 10초 만에 크리에이터를 응원하세요.",
    images: [
      {
        url: "https://donote.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "도노트 - 마음을 적는 가장 가벼운 후원",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@donote_kr",
    creator: "@donote_kr",
    title: "도노트 (Donote)",
    description: "마음을 적는 가장 가벼운 후원",
    images: ["https://donote.site/og-image.png"],
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: "google-site-verification-code",
    // Naver, Bing 등 추가 가능
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
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gamjaFlower.variable} ${hiMelody.variable} antialiased bg-[#F9F9F9] dark:bg-gray-900 text-[#333333] dark:text-gray-100 transition-colors paper-bg`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
