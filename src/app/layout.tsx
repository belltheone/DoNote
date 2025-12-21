import type { Metadata } from "next";
import { Geist, Geist_Mono, Gamja_Flower, Hi_Melody } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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

  // Favicons & Icons
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/logo-140.png' },
    ],
  },

  // PWA Manifest
  manifest: '/manifest.json',
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
        {/* 로컬 Pretendard Variable 사용 (globals.css에서 @font-face로 로드) */}

        {/* JSON-LD 구조화 데이터 (SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "도노트 (Donote)",
              "description": "마음을 적는 가장 가벼운 후원 플랫폼",
              "url": "https://www.donote.site",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "provider": {
                "@type": "Organization",
                "name": "도노트",
                "url": "https://www.donote.site",
                "logo": "https://www.donote.site/logo-140.png"
              }
            })
          }}
        />

        {/* PWA 매니페스트 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6B6B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="도노트" />
        <link rel="apple-touch-icon" href="/logo-140.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gamjaFlower.variable} ${hiMelody.variable} antialiased bg-[#F9F9F9] dark:bg-gray-900 text-[#333333] dark:text-gray-100 transition-colors paper-bg`}
      >
        {/* Google Analytics */}
        <GoogleAnalytics />
        {/* 스킵 네비게이션 (접근성) */}
        <a href="#main-content" className="skip-to-content">
          본문으로 바로가기
        </a>
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
