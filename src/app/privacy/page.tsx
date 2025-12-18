"use client";
// 개인정보처리방침 페이지 - 공통 Header/Footer 적용

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
            {/* 공통 헤더 */}
            <Header />

            <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-[#333] mb-8">개인정보처리방침</h1>

                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">1. 개인정보의 수집 및 이용 목적</h2>
                            <p className="text-[#666] leading-relaxed mb-4">
                                도노트(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다:
                            </p>
                            <ul className="text-[#666] space-y-2 list-disc list-inside">
                                <li>회원 가입 및 관리</li>
                                <li>서비스 제공 및 운영</li>
                                <li>결제 및 정산 처리</li>
                                <li>고객 문의 응대</li>
                                <li>서비스 개선 및 통계 분석</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">2. 수집하는 개인정보 항목</h2>
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-[#333] mb-2">크리에이터 가입 시</h3>
                                    <p className="text-[#666] text-sm">
                                        필수: 이메일, 이름(닉네임), 프로필 사진, 소셜 계정 정보<br />
                                        선택: 자기소개, 소셜 링크
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-[#333] mb-2">정산 신청 시</h3>
                                    <p className="text-[#666] text-sm">
                                        필수: 은행명, 계좌번호, 예금주명
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-[#333] mb-2">후원 시</h3>
                                    <p className="text-[#666] text-sm">
                                        필수: 닉네임, 결제 정보<br />
                                        선택: 이메일, 메시지
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">3. 개인정보의 보유 및 이용기간</h2>
                            <ul className="text-[#666] space-y-2 list-disc list-inside">
                                <li>회원 탈퇴 시까지 (단, 관련 법령에 따라 보존이 필요한 경우 해당 기간)</li>
                                <li>전자상거래 등에서의 소비자보호에 관한 법률에 따른 거래 기록: 5년</li>
                                <li>통신비밀보호법에 따른 접속 로그: 3개월</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">4. 개인정보보호 책임자</h2>
                            <div className="bg-[#FFFACD] rounded-lg p-4">
                                <p className="text-[#666]">
                                    담당부서: 개인정보보호팀<br />
                                    이메일: privacy@donote.site<br />
                                    전화: 문의하기 페이지 이용
                                </p>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-gray-200">
                            <p className="text-[#999] text-sm">
                                시행일: 2024년 12월 1일<br />
                                최종 수정일: 2024년 12월 18일
                            </p>
                        </section>
                    </div>
                </motion.div>

                {/* 뒤로가기 */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-[#666] hover:text-[#333] transition-colors">
                        ← 홈으로 돌아가기
                    </Link>
                </div>
            </main>

            {/* 공통 푸터 */}
            <Footer />
        </div>
    );
}
