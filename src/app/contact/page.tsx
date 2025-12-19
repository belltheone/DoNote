"use client";
// 문의하기 페이지 - 공통 Header/Footer 적용

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 실제로는 API 호출
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success("문의가 접수되었습니다!");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex flex-col">
            {/* 공통 헤더 */}
            <Header />

            <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-[#333] dark:text-white mb-4">문의하기</h1>
                    <p className="text-[#666] dark:text-gray-400 mb-8">
                        궁금한 점이나 건의사항이 있으시면 언제든 문의해주세요.
                    </p>

                    {isSubmitted ? (
                        <motion.div
                            className="bg-[#E8F5E9] dark:bg-green-900/30 rounded-xl p-8 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <span className="text-5xl mb-4 block">✉️</span>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-2">문의가 접수되었습니다!</h2>
                            <p className="text-[#666] dark:text-gray-400 mb-6">
                                빠른 시간 내에 답변 드리겠습니다.<br />
                                보통 1-2 영업일 내에 응답합니다.
                            </p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-[#FFD95A] rounded-xl text-[#333] font-semibold hover:bg-[#FFCE3A] transition-all"
                            >
                                홈으로 돌아가기
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* 이름 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#333] dark:text-white mb-2">
                                        이름 / 닉네임
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                        placeholder="홍길동"
                                        required
                                    />
                                </div>

                                {/* 이메일 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#333] dark:text-white mb-2">
                                        이메일
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                {/* 문의 유형 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#333] dark:text-white mb-2">
                                        문의 유형
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                        required
                                    >
                                        <option value="">선택해주세요</option>
                                        <option value="general">일반 문의</option>
                                        <option value="payment">결제/정산 문의</option>
                                        <option value="account">계정 문의</option>
                                        <option value="bug">버그 신고</option>
                                        <option value="feature">기능 제안</option>
                                        <option value="partnership">제휴/협업 문의</option>
                                        <option value="other">기타</option>
                                    </select>
                                </div>

                                {/* 내용 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#333] dark:text-white mb-2">
                                        문의 내용
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors resize-none"
                                        rows={6}
                                        placeholder="문의 내용을 자세히 적어주세요."
                                        required
                                    />
                                </div>

                                {/* 제출 버튼 */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50"
                                >
                                    {isSubmitting ? '전송 중...' : '문의 보내기'}
                                </button>
                            </form>

                            {/* 기타 연락 방법 */}
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                <h3 className="font-medium text-[#333] dark:text-white mb-4">다른 방법으로 연락하기</h3>
                                <div className="space-y-3 text-sm text-[#666] dark:text-gray-400">
                                    <p>📧 이메일: contact@donote.site</p>
                                    <p>💬 카카오톡: @donote (평일 10:00 - 18:00)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* 공통 푸터 */}
            <Footer />
        </div>
    );
}
