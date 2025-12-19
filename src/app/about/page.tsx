"use client";
// 서비스 소개 페이지 - 공통 Header/Footer 적용

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    PencilSquareIcon,
    EnvelopeIcon,
    TicketIcon,
    SparklesIcon,
    CurrencyDollarIcon,
    UsersIcon,
    GiftIcon,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex flex-col">
            {/* 공통 헤더 */}
            <Header />

            <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
                {/* 히어로 */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-[#333] dark:text-white mb-4">
                        서비스 소개
                    </h1>
                    <p className="text-xl text-[#666] dark:text-gray-400">
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
                    <div className="bg-[#FFFACD] dark:bg-yellow-900/30 rounded-xl p-8 shadow-md">
                        <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-4">🍩 도노트란?</h2>
                        <p className="text-[#666] dark:text-gray-400 leading-relaxed">
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
                    <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-6 flex items-center gap-2">
                        <SparklesIcon className="w-7 h-7 text-[#FFD95A]" />
                        주요 특징
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: PencilSquareIcon,
                                title: "쪽지처럼 간편하게",
                                description: "회원가입 없이 닉네임만 적으면 끝. 토스페이로 3초 결제.",
                                color: "text-[#FF6B6B]"
                            },
                            {
                                icon: EnvelopeIcon,
                                title: "편지처럼 따뜻하게",
                                description: "단순 송금이 아닌 정성 담긴 메시지. 크리에이터의 하루가 특별해져요.",
                                color: "text-[#FFD95A]"
                            },
                            {
                                icon: TicketIcon,
                                title: "위젯으로 바이럴하게",
                                description: "블로그, 깃허브, SNS 어디든. 예쁜 티켓 배지로 후원 유도.",
                                color: "text-[#48BB78]"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-[#FFD95A]/50 transition-all duration-300 group"
                                whileHover={{ y: -4, scale: 1.02 }}
                            >
                                <item.icon className={`w-10 h-10 mb-4 ${item.color} group-hover:scale-110 transition-transform`} />
                                <h3 className="font-bold text-[#333] dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-[#666] dark:text-gray-400">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 수수료 안내 */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-6">💰 수수료 정책</h2>
                    <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-xl p-8 text-white shadow-lg">
                        <div className="flex items-center justify-center gap-8 mb-6">
                            <div className="text-center">
                                <p className="text-sm opacity-80 mb-1">도노트 수수료</p>
                                <p className="text-5xl font-bold">5%</p>
                            </div>
                            <div className="w-px h-16 bg-white/30" />
                            <div className="text-center">
                                <p className="text-sm opacity-80 mb-1">크리에이터 수령</p>
                                <p className="text-5xl font-bold">95%</p>
                            </div>
                        </div>
                        <p className="text-center text-white/90 text-sm">
                            투명한 수수료 정책으로 운영됩니다.<br />
                            * 별도 PG 수수료(약 3%)가 추가 발생할 수 있습니다.
                        </p>
                    </div>
                </motion.section>

                {/* 대상 */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-6">👥 누구를 위한 서비스인가요?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#FFE4E1] dark:bg-red-900/30 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-bold text-[#333] dark:text-white mb-3">크리에이터</h3>
                            <ul className="text-[#666] dark:text-gray-400 space-y-2 text-sm">
                                <li>• 블로그/개발 블로그 운영자</li>
                                <li>• 유튀버, 스트리머</li>
                                <li>• 오픈소스 기여자</li>
                                <li>• 작가, 아티스트</li>
                            </ul>
                        </div>
                        <div className="bg-[#E6F3FF] dark:bg-blue-900/30 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="font-bold text-[#333] dark:text-white mb-3">후원자</h3>
                            <ul className="text-[#666] dark:text-gray-400 space-y-2 text-sm">
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-4">지금 시작하세요!</h2>
                        <p className="text-[#666] dark:text-gray-400 mb-6">3초면 내 우체통을 만들 수 있어요.</p>
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-all shadow-md hover:scale-105"
                        >
                            <span>무료로 시작하기</span>
                            <span>→</span>
                        </Link>
                    </div>
                </motion.section>
            </main>

            {/* 공통 푸터 */}
            <Footer />
        </div>
    );
}
