"use client";
// FAQ 페이지 - 자주 묻는 질문
// 아코디언 스타일 UI

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

// FAQ 데이터
const faqCategories = [
    {
        category: "일반",
        icon: "🏠",
        questions: [
            {
                q: "도노트란 무엇인가요?",
                a: "도노트는 크리에이터를 위한 마이크로 후원 플랫폼입니다. 팬들이 간편하게 소액 후원을 할 수 있고, 크리에이터는 따뜻한 응원 메시지와 함께 후원금을 받을 수 있습니다."
            },
            {
                q: "누가 도노트를 사용할 수 있나요?",
                a: "개발자, 블로거, 유튜버, 아티스트, 작가 등 모든 크리에이터가 사용할 수 있습니다. 회원가입 후 바로 나만의 후원 페이지를 만들 수 있어요."
            },
            {
                q: "후원자도 회원가입이 필요한가요?",
                a: "아니요! 후원자는 회원가입 없이 닉네임만 입력하면 바로 후원할 수 있습니다. 토스페이, 카카오페이 등 간편결제로 3초 만에 후원 완료!"
            },
        ]
    },
    {
        category: "결제",
        icon: "💳",
        questions: [
            {
                q: "어떤 결제 수단을 지원하나요?",
                a: "토스페이, 카카오페이, 네이버페이, 신용카드 등 다양한 결제 수단을 지원합니다. 가장 편한 방법으로 후원하세요."
            },
            {
                q: "최소/최대 후원 금액이 있나요?",
                a: "최소 1,000원부터 최대 1,000,000원까지 후원 가능합니다. 도넛 1개(1,000원)부터 시작해보세요! 🍩"
            },
            {
                q: "결제 후 취소/환불이 가능한가요?",
                a: "후원 특성상 결제 완료 후에는 취소가 어려울 수 있습니다. 문제가 있을 경우 고객센터로 문의해 주세요."
            },
        ]
    },
    {
        category: "크리에이터",
        icon: "✨",
        questions: [
            {
                q: "크리에이터 등록은 어떻게 하나요?",
                a: "회원가입 후 '크리에이터로 시작하기'를 선택하면 바로 등록할 수 있습니다. 프로필 설정 후 나만의 후원 링크가 생성됩니다."
            },
            {
                q: "위젯은 어디에 설치할 수 있나요?",
                a: "GitHub README, 티스토리, 노션, 개인 블로그, SNS 프로필 등 어디든 설치 가능합니다. HTML 임베드 코드를 복사해서 붙여넣기만 하면 끝!"
            },
            {
                q: "OBS 알림은 어떻게 설정하나요?",
                a: "대시보드에서 OBS 알림 URL을 복사 후, OBS Studio의 '브라우저 소스'에 추가하면 됩니다. 실시간으로 후원 알림이 표시됩니다."
            },
        ]
    },
    {
        category: "정산",
        icon: "💰",
        questions: [
            {
                q: "수수료는 얼마인가요?",
                a: "도노트 수수료는 5%입니다. 개인 크리에이터의 경우 원천징수세 3.3%(소득세 3% + 주민세 0.3%)가 추가로 공제되어, 실수령액은 약 92%입니다. 사업자 등록 시 원천징수 없이 세금계산서로 처리됩니다."
            },
            {
                q: "정산은 언제 되나요?",
                a: "매월 15일에 전월 후원금이 자동 정산됩니다. 정산 정보가 등록되어 있어야 하며, 영업일 기준 3-5일 내에 등록된 계좌로 입금됩니다."
            },
            {
                q: "최소 정산 금액이 있나요?",
                a: "네, 최소 정산 금액은 10,000원입니다. 정산 가능 금액이 10,000원 미만인 경우, 다음달로 이월되며 누적됩니다."
            },
            {
                q: "정산받으려면 어떤 정보가 필요한가요?",
                a: "실명, 주민등록번호, 계좌번호가 필요합니다. 후원금은 소득세법상 사업소득으로 분류되어 원천징수(3.3%)가 적용됩니다. 사업자 등록이 되어 있다면 사업자등록번호로 대체할 수 있습니다. 대시보드 > 정산 메뉴에서 등록할 수 있으며, 개인정보는 안전하게 암호화됩니다."
            },
            {
                q: "세금 신고는 어떻게 하나요?",
                a: "도노트에서 원천징수한 세금은 국세청에 신고됩니다. 연말에 원천징수영수증을 발급해 드리며, 5월 종합소득세 신고 시 사용하실 수 있습니다. 연간 지급 총액이 500만원 이상인 경우 지급명세서가 자동으로 제출됩니다."
            },
        ]
    },
];

// FAQ 아이템 컴포넌트
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className="border-b border-gray-200 dark:border-gray-700 last:border-none"
            initial={false}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left hover:text-[#FF6B6B] transition-colors"
            >
                <span className="font-medium text-[#333] dark:text-white pr-4">{question}</span>
                <ChevronDownIcon
                    className={`w-5 h-5 text-[#666] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <p className="pb-5 text-[#666] dark:text-gray-400 leading-relaxed">
                    {answer}
                </p>
            </motion.div>
        </motion.div>
    );
}

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState("일반");

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
                            <QuestionMarkCircleIcon className="w-16 h-16 text-[#FF6B6B] mx-auto mb-4" />
                            <h1 className="text-3xl md:text-4xl font-bold text-[#333] dark:text-white mb-4">
                                자주 묻는 질문
                            </h1>
                            <p className="text-[#666] dark:text-gray-400 text-lg">
                                도노트 이용에 대해 궁금한 점을 찾아보세요
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ 콘텐츠 */}
                <section className="py-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* 카테고리 탭 */}
                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                            {faqCategories.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => setActiveCategory(cat.category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.category
                                        ? "bg-[#FF6B6B] text-white shadow-md"
                                        : "bg-white dark:bg-gray-800 text-[#666] dark:text-gray-300 hover:bg-[#FFE4E1] dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {cat.icon} {cat.category}
                                </button>
                            ))}
                        </div>

                        {/* FAQ 리스트 */}
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                        >
                            {faqCategories
                                .find((cat) => cat.category === activeCategory)
                                ?.questions.map((item, i) => (
                                    <FAQItem key={i} question={item.q} answer={item.a} />
                                ))}
                        </motion.div>

                        {/* 추가 도움 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 text-center"
                        >
                            <p className="text-[#666] dark:text-gray-400 mb-4">
                                원하는 답변을 찾지 못하셨나요?
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD95A] text-[#333] font-semibold rounded-xl hover:bg-[#FFC107] transition-colors"
                            >
                                📧 문의하기
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
