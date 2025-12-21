// 블로그 상세 페이지 - 동적 라우트
// 각 글의 콘텐츠를 표시

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

// 블로그 포스트 데이터
const blogPosts: Record<string, {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    content: string;
}> = {
    "introducing-donote": {
        title: "도노트, 마음을 전하는 새로운 방법",
        excerpt: "한국형 마이크로 후원 플랫폼 도노트를 소개합니다.",
        category: "서비스 소개",
        date: "2024-12-19",
        readTime: "3분",
        content: `
## 도노트란?

도노트(Donote)는 크리에이터와 팬을 연결하는 **한국형 마이크로 후원 플랫폼**입니다.

기존 후원 플랫폼들의 복잡한 가입 절차와 높은 진입장벽 대신, 누구나 쉽게 마음을 전할 수 있는 서비스를 만들고 싶었습니다.

### 왜 도노트인가요?

1. **간편한 후원**: 회원가입 없이 닉네임만 입력하면 바로 후원 가능
2. **따뜻한 메시지**: 후원과 함께 응원 메시지를 전달
3. **낮은 수수료**: 업계 최저 수준의 5% 수수료
4. **다양한 위젯**: GitHub, 블로그, SNS 어디든 설치 가능

### 이런 분들께 추천해요

- 💻 개발자: GitHub README에 후원 위젯을 달고 싶은 분
- ✍️ 블로거: 좋은 글에 대한 감사를 받고 싶은 분
- 🎨 아티스트: 팬들과 더 가까워지고 싶은 분
- 📹 유튜버: 구독자들의 응원을 직접 받고 싶은 분

### 도넛 하나로 시작하세요

도노트의 기본 단위는 **도넛 🍩**입니다. 도넛 1개는 1,000원이에요.

"도넛 하나 사드릴게요~" 라는 가벼운 마음으로 시작할 수 있어요. 작은 후원이 모여 크리에이터에게 큰 힘이 됩니다.

---

지금 바로 [도노트 시작하기](/auth)에서 크리에이터로 등록하세요!
        `,
    },
    "tips-for-creators": {
        title: "후원을 받기 시작하는 5가지 방법",
        excerpt: "크리에이터로서 첫 후원을 받기 위한 실전 팁!",
        category: "크리에이터 팁",
        date: "2024-12-18",
        readTime: "5분",
        content: `
## 첫 후원을 받기 위한 실전 가이드

크리에이터로 등록은 했는데, 어떻게 홍보해야 할지 막막하신가요? 
실제로 후원을 받기 시작한 크리에이터들의 노하우를 정리했습니다.

### 1. 프로필을 매력적으로 꾸미세요 ✨

첫인상이 중요합니다!

- **프로필 사진**: 얼굴이 아니어도 OK! 캐릭터, 로고, 작품도 좋아요
- **자기소개**: 어떤 활동을 하는지, 후원금을 어디에 쓸지 명확하게
- **목표 설정**: "새 장비 구매", "프로젝트 완성" 등 구체적인 목표가 있으면 더 좋아요

### 2. GitHub README에 위젯을 달아보세요 💻

개발자라면 필수!

\`\`\`markdown
[![도노트로 후원하기](https://img.shields.io/badge/도노트-후원하기-FF6B6B?style=for-the-badge)](https://donote.site/your-handle)
\`\`\`

오픈소스 프로젝트에 후원 링크가 있으면 사용자들이 감사함을 전하기 쉬워져요.

### 3. SNS 프로필에 링크를 추가하세요 📱

인스타그램, 트위터, 유튜브의 프로필 링크란에 도노트 URL을 넣어두세요.
팬들이 "이 콘텐츠가 좋다!" 느꼈을 때 바로 후원할 수 있어요.

### 4. 콘텐츠에 자연스럽게 녹여보세요 🎬

- 영상 마지막에 "커피 한 잔 사주실 분~" 멘트
- 블로그 글 하단에 "이 글이 도움이 되셨다면..." 안내
- 스트리밍 중 OBS 알림 위젯 활용

강요하는 느낌 없이, 자연스럽게!

### 5. 후원자에게 감사를 표하세요 💌

후원을 받으면 꼭 감사 인사를 전하세요.
- 후원 알림에 직접 답글
- SNS에 감사 포스팅
- 특별한 혜택 제공 (early access 등)

감사함을 표현하면 재후원으로 이어지는 경우가 많아요!

---

오늘부터 하나씩 실천해보세요. 첫 후원의 기쁨이 곧 찾아올 거예요! 🎉
        `,
    },
    "launch-announcement": {
        title: "도노트 정식 출시 및 주요 기능 안내",
        excerpt: "베타 테스트를 마치고 드디어 정식 출시!",
        category: "업데이트",
        date: "2024-12-17",
        readTime: "4분",
        content: `
## 🎉 도노트 정식 출시!

안녕하세요, 도노트 팀입니다.

3개월간의 베타 테스트를 거쳐 드디어 **도노트가 정식 출시**되었습니다!
베타 기간 동안 보내주신 피드백 덕분에 더 나은 서비스가 될 수 있었어요.

### 새롭게 추가된 기능들

#### 1. OBS 실시간 알림 🔔
스트리머분들을 위한 기능! 후원이 들어오면 방송에 실시간으로 표시됩니다.
- 애니메이션 알림
- 커스텀 스타일 지원
- 사운드 알림 (준비 중)

#### 2. 다양한 위젯 스타일 🎨
티켓 스타일, 뱃지 스타일 등 여러 가지 위젯을 선택할 수 있어요.
블로그, SNS, GitHub 등 다양한 곳에 맞게 사용하세요.

#### 3. 정산 시스템 개선 💰
- 매월 1일 자동 정산
- 정산 내역 상세 조회
- 은행 계좌 안전 관리

#### 4. 다크 모드 지원 🌙
눈이 편한 다크 모드! 시스템 설정에 따라 자동으로 변경됩니다.

### 앞으로의 계획

도노트는 계속 발전합니다:

- 📊 고급 분석 대시보드
- 🎁 구독 후원 시스템
- 🌐 다국어 지원
- 📱 모바일 앱 (검토 중)

### 감사합니다 ❤️

베타 테스터 여러분, 그리고 도노트에 관심 가져주신 모든 분들께 감사드립니다.

문의사항이나 피드백은 언제든 [문의하기](/contact) 페이지를 통해 보내주세요!

---

**도노트 팀 드림** 🍩
        `,
    },
};

// 카테고리별 색상
const categoryColors: Record<string, string> = {
    "서비스 소개": "bg-[#FF6B6B]/10 text-[#FF6B6B]",
    "크리에이터 팁": "bg-[#48BB78]/10 text-[#48BB78]",
    "업데이트": "bg-[#4299E1]/10 text-[#4299E1]",
};

// 인라인 마크다운 처리 (bold, italic, links, inline code)
function processInlineMarkdown(text: string): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
        // **bold** 처리
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // *italic* 처리
        const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
        // [link](url) 처리
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
        // `code` 처리
        const codeMatch = remaining.match(/`([^`]+)`/);

        // 가장 먼저 나오는 매치 찾기
        const matches = [
            { match: boldMatch, type: 'bold' },
            { match: italicMatch, type: 'italic' },
            { match: linkMatch, type: 'link' },
            { match: codeMatch, type: 'code' },
        ].filter(m => m.match !== null)
            .sort((a, b) => (a.match?.index || 0) - (b.match?.index || 0));

        if (matches.length === 0) {
            result.push(remaining);
            break;
        }

        const firstMatch = matches[0];
        const match = firstMatch.match!;
        const matchIndex = match.index || 0;

        // 매치 이전 텍스트 추가
        if (matchIndex > 0) {
            result.push(remaining.slice(0, matchIndex));
        }

        // 매치된 내용 처리
        if (firstMatch.type === 'bold') {
            result.push(<strong key={keyIndex++} className="font-bold text-[#333] dark:text-white">{match[1]}</strong>);
        } else if (firstMatch.type === 'italic') {
            result.push(<em key={keyIndex++} className="italic">{match[1]}</em>);
        } else if (firstMatch.type === 'link') {
            result.push(
                <a key={keyIndex++} href={match[2]} className="text-[#FF6B6B] hover:underline">
                    {match[1]}
                </a>
            );
        } else if (firstMatch.type === 'code') {
            result.push(
                <code key={keyIndex++} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-[#e83e8c]">
                    {match[1]}
                </code>
            );
        }

        remaining = remaining.slice(matchIndex + match[0].length);
    }

    return result;
}

// 마크다운을 React 요소로 변환
function renderMarkdown(content: string) {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let _codeBlockLang = '';

    lines.forEach((line, i) => {
        // 코드 블록 시작/끝
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                _codeBlockLang = line.slice(3).trim();
                codeBlockContent = [];
            } else {
                elements.push(
                    <pre key={i} className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm">
                        <code>{codeBlockContent.join('\n')}</code>
                    </pre>
                );
                inCodeBlock = false;
            }
            return;
        }

        if (inCodeBlock) {
            codeBlockContent.push(line);
            return;
        }

        // #### 헤더
        if (line.startsWith('#### ')) {
            elements.push(<h4 key={i} className="text-lg font-bold text-[#333] dark:text-white mt-6 mb-3">{processInlineMarkdown(line.slice(5))}</h4>);
            return;
        }
        // ### 헤더
        if (line.startsWith('### ')) {
            elements.push(<h3 key={i} className="text-xl font-bold text-[#333] dark:text-white mt-8 mb-4">{processInlineMarkdown(line.slice(4))}</h3>);
            return;
        }
        // ## 헤더
        if (line.startsWith('## ')) {
            elements.push(<h2 key={i} className="text-2xl font-bold text-[#333] dark:text-white mt-10 mb-6">{processInlineMarkdown(line.slice(3))}</h2>);
            return;
        }
        // 리스트 (-)
        if (line.startsWith('- ')) {
            elements.push(<li key={i} className="text-[#666] dark:text-gray-400 ml-4 mb-2 list-disc">{processInlineMarkdown(line.slice(2))}</li>);
            return;
        }
        // 리스트 (숫자)
        if (line.match(/^\d+\. /)) {
            elements.push(<li key={i} className="text-[#666] dark:text-gray-400 ml-4 mb-2 list-decimal">{processInlineMarkdown(line.slice(3))}</li>);
            return;
        }
        // 구분선
        if (line === '---') {
            elements.push(<hr key={i} className="my-8 border-gray-200 dark:border-gray-700" />);
            return;
        }
        // 빈 줄
        if (line.trim() === '') {
            elements.push(<br key={i} />);
            return;
        }
        // 일반 텍스트
        elements.push(<p key={i} className="text-[#666] dark:text-gray-400 leading-relaxed mb-4">{processInlineMarkdown(line)}</p>);
    });

    return elements;
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = blogPosts[slug];

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F9F9F9] dark:bg-gray-900">
            <Header />

            <main className="flex-1">
                {/* 뒤로가기 */}
                <div className="max-w-4xl mx-auto px-6 pt-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[#666] dark:text-gray-400 hover:text-[#FF6B6B] transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        블로그로 돌아가기
                    </Link>
                </div>

                {/* 글 헤더 */}
                <header className="max-w-4xl mx-auto px-6 py-8">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${categoryColors[post.category]}`}>
                        {post.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#333] dark:text-white mb-4">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-[#999]">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {post.readTime} 읽기
                        </span>
                    </div>
                </header>

                {/* 글 본문 */}
                <article className="max-w-4xl mx-auto px-6 pb-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="prose prose-lg max-w-none">
                            {renderMarkdown(post.content)}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-[#666] dark:text-gray-400 mb-4">
                            도노트가 마음에 드셨나요?
                        </p>
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#e55555] transition-colors"
                        >
                            지금 시작하기 🍩
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
