"use client";
// 공지사항 페이지 - 서비스 공지 목록

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveNotices, Notice } from "@/data/notices";
import { BellIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

// 타입별 스타일
const typeStyles: Record<string, { bg: string; text: string; icon: string }> = {
    success: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", icon: "🎉" },
    info: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", icon: "ℹ️" },
    warning: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400", icon: "⚠️" },
};

export default function NoticePage() {
    const notices = getActiveNotices();
    const [expandedId, setExpandedId] = useState<string | null>(null);

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
                            <BellIcon className="w-16 h-16 text-[#FF6B6B] mx-auto mb-4" />
                            <h1 className="text-3xl md:text-4xl font-bold text-[#333] dark:text-white mb-4">
                                공지사항
                            </h1>
                            <p className="text-[#666] dark:text-gray-400 text-lg">
                                도노트의 새로운 소식을 확인하세요
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 공지 목록 */}
                <section className="py-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        {notices.length > 0 ? (
                            <div className="space-y-4">
                                {notices.map((notice, index) => (
                                    <motion.div
                                        key={notice.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                                    >
                                        {/* 공지 헤더 */}
                                        <button
                                            onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
                                            className="w-full p-6 flex items-start gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${typeStyles[notice.type].bg} ${typeStyles[notice.type].text}`}>
                                                {typeStyles[notice.type].icon} {notice.type === 'success' ? '알림' : notice.type === 'info' ? '정보' : '주의'}
                                            </span>
                                            <div className="flex-1">
                                                <h2 className="text-lg font-bold text-[#333] dark:text-white mb-2">
                                                    {notice.title}
                                                </h2>
                                                <span className="flex items-center gap-1 text-xs text-[#999] dark:text-gray-500">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    {notice.createdAt}
                                                </span>
                                            </div>
                                            <span className="text-[#999] dark:text-gray-500 text-xl">
                                                {expandedId === notice.id ? '−' : '+'}
                                            </span>
                                        </button>

                                        {/* 공지 내용 (확장시) */}
                                        {expandedId === notice.id && notice.content && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="pt-4 text-[#666] dark:text-gray-400 whitespace-pre-line">
                                                    {notice.content}
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <span className="text-6xl mb-4 block">📭</span>
                                <p className="text-[#999] dark:text-gray-500 text-lg">
                                    현재 공지사항이 없습니다
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
