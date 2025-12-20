import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "시작 가이드 | 도노트",
    description: "도노트를 시작하는 방법을 단계별로 안내합니다. 크리에이터 등록, 위젯 설치, 정산 받기까지 쉽게 따라하세요.",
    openGraph: {
        title: "시작 가이드 | 도노트",
        description: "도노트를 시작하는 방법을 단계별로 안내합니다.",
        type: "website",
    },
    keywords: ["도노트", "가이드", "시작", "위젯", "정산", "크리에이터"],
};

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
