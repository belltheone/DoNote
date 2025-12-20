"use client";
// Google Analytics 4 컴포넌트
// GA_MEASUREMENT_ID 환경변수로 설정

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
    // GA ID가 없으면 렌더링하지 않음
    if (!GA_MEASUREMENT_ID) {
        return null;
    }

    return (
        <>
            {/* Google Analytics 스크립트 로드 */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                    });
                `}
            </Script>
        </>
    );
}

// 페이지 뷰 이벤트 전송
export function trackPageView(url: string) {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("config", GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
}

// 커스텀 이벤트 전송
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// 후원 이벤트 추적
export function trackDonation(amount: number, creatorHandle: string) {
    trackEvent("donation", "engagement", creatorHandle, amount);
}

// 회원가입 이벤트 추적
export function trackSignUp(method: string) {
    trackEvent("sign_up", "engagement", method);
}
