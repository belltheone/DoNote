import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "블로그 | 도노트",
    description: "도노트의 최신 소식과 크리에이터 팁을 확인하세요. 서비스 업데이트, 활용 가이드, 성공 사례를 공유합니다.",
    openGraph: {
        title: "블로그 | 도노트",
        description: "도노트의 최신 소식과 크리에이터 팁을 확인하세요.",
        type: "website",
    },
    keywords: ["도노트", "블로그", "크리에이터", "팁", "업데이트", "후원"],
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
