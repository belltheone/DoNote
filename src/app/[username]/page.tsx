"use client";
// 크리에이터 페이지 - 사용자별 후원 페이지
// 프로필, 목표 게이지, Digital Wall(후원 메모지 전시) 포함

import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";

// 더미 데이터 - 실제로는 DB에서 가져옴
const demoCreator = {
    username: "demo",
    displayName: "개발하는 민수",
    avatar: "👨‍💻",
    bio: "프론트엔드 개발자 | 오픈소스 기여자 | 기술 블로거",
    socialLinks: [
        { name: "GitHub", url: "https://github.com" },
        { name: "Blog", url: "https://blog.example.com" },
        { name: "Twitter", url: "https://twitter.com" }
    ],
    goal: {
        title: "맥북 할부금 갚기",
        current: 150000,
        target: 500000
    },
    // Digital Wall - 받은 후원 메모지들
    notes: [
        { id: 1, nickname: "익명의 팬", message: "항상 좋은 글 감사합니다! ☕", amount: 5000, createdAt: "2024-12-14" },
        { id: 2, nickname: "코딩초보", message: "덕분에 리액트 배웠어요 💜", amount: 3000, createdAt: "2024-12-13" },
        { id: 3, nickname: "개발자김씨", message: "오픈소스 응원합니다!", amount: 10000, createdAt: "2024-12-12" },
        { id: 4, nickname: "감사해요", message: "최고!", amount: 5000, createdAt: "2024-12-11" },
        { id: 5, nickname: "열정맨", message: "화이팅하세요 🔥", amount: 3000, createdAt: "2024-12-10" },
        { id: 6, nickname: "후원자A", message: "좋은 컨텐츠 감사합니다", amount: 5000, createdAt: "2024-12-09" },
    ]
};

// 메모지 색상 랜덤 선택용
const noteColors = [
    "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    "from-orange-500/20 to-amber-500/20 border-orange-500/30",
    "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    "from-green-500/20 to-emerald-500/20 border-green-500/30",
];

export default function CreatorPage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = use(params);

    // 실제로는 username으로 DB 조회
    const creator = demoCreator;
    const goalPercent = Math.round((creator.goal.current / creator.goal.target) * 100);

    return (
        <div className="min-h-screen bg-[#0a0a0f] py-8 px-4">
            {/* 배경 효과 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-2xl mx-auto">
                {/* 뒤로가기 */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    도노트 홈
                </Link>

                {/* 프로필 카드 */}
                <motion.div
                    className="glass-card p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 아바타 & 정보 */}
                    <div className="flex items-start gap-6 mb-6">
                        {/* 아바타 */}
                        <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center text-4xl shadow-lg">
                            {creator.avatar}
                        </div>

                        {/* 정보 */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">{creator.displayName}</h1>
                            <p className="text-gray-400 mb-3">{creator.bio}</p>

                            {/* 소셜 링크 */}
                            <div className="flex gap-2">
                                {creator.socialLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 text-sm glass-card hover:bg-white/10 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 목표 게이지 (Dynamic Goal) */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">🎯 {creator.goal.title}</span>
                            <span className="text-sm text-gray-400">
                                {creator.goal.current.toLocaleString()}원 / {creator.goal.target.toLocaleString()}원
                            </span>
                        </div>
                        {/* 프로그레스 바 */}
                        <div className="relative h-4 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 gradient-bg rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${goalPercent}%` }}
                                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                {goalPercent}%
                            </span>
                        </div>
                    </div>

                    {/* 후원하기 버튼 */}
                    <Link
                        href={`/donate/${username}`}
                        className="mt-6 w-full py-4 gradient-bg rounded-full text-white font-semibold text-lg text-center flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
                    >
                        <span>☕</span>
                        <span>커피 한 잔 사주기</span>
                    </Link>
                </motion.div>

                {/* Digital Wall - 후원 쪽지 전시 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span>💌</span>
                        <span>응원 메시지 Wall</span>
                        <span className="text-sm font-normal text-gray-500">({creator.notes.length})</span>
                    </h2>

                    {/* 메모지 그리드 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {creator.notes.map((note, index) => (
                            <motion.div
                                key={note.id}
                                className={`p-4 rounded-2xl bg-gradient-to-br ${noteColors[index % noteColors.length]} border backdrop-blur-sm`}
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.3 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                            >
                                {/* 금액 태그 */}
                                <div className="text-xs text-gray-400 mb-2">
                                    ₩{note.amount.toLocaleString()}
                                </div>

                                {/* 메시지 */}
                                <p className="text-sm font-medium mb-3 line-clamp-3">
                                    {note.message}
                                </p>

                                {/* 닉네임 */}
                                <div className="text-xs text-gray-500">
                                    - {note.nickname}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 나도 배지 달기 */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-gray-500 text-sm mb-4">나도 이런 페이지를 갖고 싶다면?</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 glass-card hover:bg-white/10 transition-colors"
                    >
                        <span>✨</span>
                        <span>도노트 시작하기</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
