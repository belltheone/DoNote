"use client";
// 블로그 페이지 - 글 목록
// 서비스 소개, 크리에이터 팁, 업데이트 공지

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { NewspaperIcon, CalendarIcon } from "@heroicons/react/24/outline";

// 블로그 포스트 데이터
const blogPosts = [
    {
        slug: "introducing-donote",
        title: "도노트, 마음을 전하는 새로운 방법",
        excerpt: "한국형 마이크로 후원 플랫폼 도노트를 소개합니다. 크리에이터와 팬을 연결하는 따뜻한 후원 문화를 만들어갑니다.",
        category: "서비스 소개",
        date: "2025-12-20",
        readTime: "3분",
        image: "🍩",
    },
    {
        slug: "tips-for-creators",
        title: "후원을 받기 시작하는 5가지 방법",
        excerpt: "크리에이터로서 첫 후원을 받기 위한 실전 팁! 위젯 설치부터 SNS 홍보까지 단계별로 알려드려요.",
        category: "크리에이터 팁",
        date: "2025-12-22",
        readTime: "5분",
        image: "💡",
    },
    {
        slug: "launch-announcement",
        title: "도노트 정식 출시 및 주요 기능 안내",
        excerpt: "베타 테스트를 마치고 드디어 도노트가 정식 출시되었습니다! 새롭게 추가된 기능들을 확인해보세요.",
        category: "업데이트",
        date: "2025-12-25",
        readTime: "4분",
        image: "🚀",
    },
];

// 카테고리별 색상
const categoryColors: Record<string, string> = {
    "서비스 소개": "bg-[#FF6B6B]/10 text-[#FF6B6B]",
    "크리에이터 팁": "bg-[#48BB78]/10 text-[#48BB78]",
    "업데이트": "bg-[#4299E1]/10 text-[#4299E1]",
};

export default function BlogPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F9F9F9] dark:bg-gray-900">
            <Header />

            <main className="flex-1">
                {/* 히어로 */}
                <section className="bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFFAF0] dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <NewspaperIcon className="w-16 h-16 text-[#FF6B6B] mx-auto mb-4" />
                            <h1 className="text-3xl md:text-4xl font-bold text-[#333] dark:text-white mb-4">
                                도노트 블로그
                            </h1>
                            <p className="text-[#666] dark:text-gray-400 text-lg">
                                최신 소식과 유용한 팁을 확인하세요
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 블로그 목록 */}
                <section className="py-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-6">
                            {blogPosts.map((post, index) => (
                                <motion.article
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row">
                                        {/* 이미지/아이콘 */}
                                        <div className="md:w-48 h-40 md:h-auto bg-gradient-to-br from-[#FFE4E1] to-[#FFFACD] dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                            <span className="text-6xl">{post.image}</span>
                                        </div>

                                        {/* 콘텐츠 */}
                                        <div className="flex-1 p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
                                                    {post.category}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-[#999]">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    {post.date}
                                                </span>
                                                <span className="text-xs text-[#999]">· {post.readTime} 읽기</span>
                                            </div>

                                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-2 hover:text-[#FF6B6B] transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-[#666] dark:text-gray-400 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
