import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "자주 묻는 질문 (FAQ) | 도노트",
    description: "도노트 이용에 대해 궁금한 점을 찾아보세요. 일반, 결제, 크리에이터, 정산 관련 자주 묻는 질문과 답변입니다.",
    openGraph: {
        title: "자주 묻는 질문 (FAQ) | 도노트",
        description: "도노트 이용에 대해 궁금한 점을 찾아보세요.",
        type: "website",
    },
    keywords: ["도노트", "FAQ", "자주 묻는 질문", "후원", "크리에이터", "정산"],
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
