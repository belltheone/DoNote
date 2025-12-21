"use client";
// JSON-LD 구조화된 데이터 컴포넌트
// SEO 및 검색 엔진 이해도 향상

import Script from 'next/script';

// 웹사이트 기본 정보
export function WebsiteJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "도노트 (Donote)",
        "alternateName": "DoNote",
        "url": "https://donote.site",
        "description": "한국형 마이크로 후원 플랫폼. 회원가입 없이 10초 만에 크리에이터를 응원하세요.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://donote.site/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <Script
            id="website-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// 조직 정보
export function OrganizationJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "도노트",
        "url": "https://donote.site",
        "logo": "https://donote.site/logo-140.png",
        "sameAs": [
            "https://twitter.com/donote_kr"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@donote.site"
        }
    };

    return (
        <Script
            id="organization-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// 크리에이터 프로필 (Person/Creator)
interface CreatorJsonLdProps {
    name: string;
    handle: string;
    description?: string;
    image?: string;
}

export function CreatorJsonLd({ name, handle, description, image }: CreatorJsonLdProps) {
    const data = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "alternateName": `@${handle}`,
        "url": `https://donote.site/${handle}`,
        "description": description || `${name}님의 도노트 후원 페이지`,
        "image": image || "https://donote.site/logo-140.png",
        "sameAs": [
            `https://donote.site/${handle}`
        ]
    };

    return (
        <Script
            id="creator-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// 블로그 글
interface BlogPostJsonLdProps {
    title: string;
    description: string;
    slug: string;
    datePublished: string;
    author?: string;
    image?: string;
}

export function BlogPostJsonLd({
    title,
    description,
    slug,
    datePublished,
    author = "도노트 팀",
    image
}: BlogPostJsonLdProps) {
    const data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "url": `https://donote.site/blog/${slug}`,
        "datePublished": datePublished,
        "author": {
            "@type": "Organization",
            "name": author
        },
        "publisher": {
            "@type": "Organization",
            "name": "도노트",
            "logo": {
                "@type": "ImageObject",
                "url": "https://donote.site/logo-140.png"
            }
        },
        "image": image || "https://donote.site/og-image.png"
    };

    return (
        <Script
            id="blogpost-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// FAQ 페이지
interface FAQItem {
    question: string;
    answer: string;
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
    const data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <Script
            id="faq-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// 소프트웨어 애플리케이션
export function SoftwareAppJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "도노트",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KRW"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
        }
    };

    return (
        <Script
            id="software-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
