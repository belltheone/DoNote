"use client";
// 서비스 소개 페이지

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            {/* 네비게이션 */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🍩</span>
                        <span className="text-xl font-bold text-[#333]">도노트</span>
                    </Link>
                    <Link href="/auth" className="px-4 py-2 bg-[#FFD95A] rounded-lg text-[#333] font-medium hover:bg-[#FFCE3A] transition-all">
                        시작하기
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* 히어로 */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-[#333] mb-4">
                        서비스 소개
                    </h1>
                    <p className="text-xl text-[#666]">
                        마음을 적는 가장 가벼운 후원 플랫폼
                    </p>
                </motion.div>

                {/* 비전 */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-[#FFFACD] rounded-xl p-8 shadow-md">
                        <h2 className="text-2xl font-bold text-[#333] mb-4">🍩 도노트란?</h2>
                        <p className="text-[#666] leading-relaxed">
                            도노트는 크리에이터와 팬을 연결하는 한국형 마이크로 스폰서십 플랫폼입니다.
                            복잡한 계좌번호 대신, 간단한 링크 하나로 따뜻한 응원을 전달하세요.
                            회원가입 없이 10초 만에 후원할 수 있어요.
                        </p>
                    </div>
                </motion.section>

                {/* 특징 */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-[#333] mb-6">✨ 주요 특징</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                emoji: "📝",
                                title: "쪽지처럼 간편하게",
                                description: "회원가입 없이 닉네임만 적으면 끝. 토스페이로 3초 결제."
                            },
                            {
                                emoji: "💌",
                                title: "편지처럼 따뜻하게",
                                description: "단순 송금이 아닌 정성 담긴 메시지. 크리에이터의 하루가 특별해져요."
                            },
                            {
                                emoji: "🎫",
                                title: "위젯으로 바이럴하게",
                                description: "블로그, 깃허브, SNS 어디든. 예쁜 티켓 배지로 후원 유도."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <span className="text-3xl mb-4 block">{item.emoji}</span>
                                <h3 className="font-bold text-[#333] mb-2">{item.title}</h3>
                                <p className="text-sm text-[#666]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* 대상 */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-[#333] mb-6">👥 누구를 위한 서비스인가요?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#FFE4E1] rounded-xl p-6 shadow-md">
                            <h3 className="font-bold text-[#333] mb-3">크리에이터</h3>
                            <ul className="text-[#666] space-y-2 text-sm">
                                <li>• 블로그/개발 블로그 운영자</li>
                                <li>• 유튜버, 스트리머</li>
                                <li>• 오픈소스 기여자</li>
                                <li>• 작가, 아티스트</li>
                            </ul>
                        </div>
                        <div className="bg-[#E6F3FF] rounded-xl p-6 shadow-md">
                            <h3 className="font-bold text-[#333] mb-3">후원자</h3>
                            <ul className="text-[#666] space-y-2 text-sm">
                                <li>• 좋은 컨텐츠에 감사를 표현하고 싶은 분</li>
                                <li>• 복잡한 과정 없이 간편하게 응원하고 싶은 분</li>
                                <li>• 익명으로 마음을 전하고 싶은 분</li>
                            </ul>
                        </div>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.section
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#333] mb-4">지금 시작하세요!</h2>
                        <p className="text-[#666] mb-6">3초면 내 우체통을 만들 수 있어요.</p>
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-all shadow-md"
                        >
                            <span>무료로 시작하기</span>
                            <span>→</span>
                        </Link>
                    </div>
                </motion.section>
            </main>

            {/* 푸터 */}
            <footer className="bg-[#333] text-white py-8 mt-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-white/50">© 2024 Donote. Made with 💌 in Korea</p>
                </div>
            </footer>
        </div>
    );
}
