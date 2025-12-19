"use client";
// 이용약관 페이지 - 공통 Header/Footer 적용

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex flex-col">
            {/* 공통 헤더 */}
            <Header />

            <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-[#333] dark:text-white mb-8">이용약관</h1>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-4">제1조 (목적)</h2>
                            <p className="text-[#666] dark:text-gray-400 leading-relaxed">
                                본 약관은 도노트(이하 &quot;회사&quot;)가 제공하는 마이크로 스폰서십 서비스(이하 &quot;서비스&quot;)의
                                이용에 관한 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-4">제2조 (정의)</h2>
                            <ul className="text-[#666] dark:text-gray-400 space-y-2 list-disc list-inside">
                                <li>&quot;서비스&quot;란 회사가 제공하는 후원 플랫폼 서비스를 의미합니다.</li>
                                <li>&quot;크리에이터&quot;란 서비스를 통해 후원을 받는 이용자를 의미합니다.</li>
                                <li>&quot;후원자&quot;란 서비스를 통해 크리에이터에게 후원을 하는 이용자를 의미합니다.</li>
                                <li>&quot;후원금&quot;이란 후원자가 크리에이터에게 지급하는 금액을 의미합니다.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-4">제3조 (서비스의 제공)</h2>
                            <p className="text-[#666] leading-relaxed mb-4">
                                회사는 다음과 같은 서비스를 제공합니다:
                            </p>
                            <ul className="text-[#666] dark:text-gray-400 space-y-2 list-disc list-inside">
                                <li>크리에이터 페이지 생성 및 관리</li>
                                <li>후원 결제 및 정산 서비스</li>
                                <li>후원 메시지 전달 서비스</li>
                                <li>임베드 위젯 제공</li>
                                <li>OBS 오버레이 서비스</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-4">제4조 (수수료)</h2>
                            <p className="text-[#666] dark:text-gray-400 leading-relaxed">
                                회사는 플랫폼 이용 수수료를 부과하지 않습니다. 단, 결제 대행사(PG)의 수수료(약 3%)는
                                후원금에서 차감됩니다. 수수료 정책은 사전 공지 후 변경될 수 있습니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-4">제5조 (정산)</h2>
                            <ul className="text-[#666] dark:text-gray-400 space-y-2 list-disc list-inside">
                                <li>크리에이터는 누적 후원금이 10,000원 이상인 경우 정산을 신청할 수 있습니다.</li>
                                <li>정산은 신청일로부터 영업일 기준 3일 이내에 처리됩니다.</li>
                                <li>정산금은 크리에이터가 등록한 계좌로 입금됩니다.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-4">제6조 (금지행위)</h2>
                            <ul className="text-[#666] dark:text-gray-400 space-y-2 list-disc list-inside">
                                <li>허위 정보 등록 또는 타인의 정보 도용</li>
                                <li>서비스를 이용한 불법 행위</li>
                                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                                <li>다른 이용자에게 피해를 주는 행위</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] dark:text-white mb-4">제7조 (면책)</h2>
                            <p className="text-[#666] dark:text-gray-400 leading-relaxed">
                                회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 중단에
                                대해 책임을 지지 않습니다. 또한 이용자의 귀책사유로 인한 서비스 이용 장애에 대해서도
                                책임을 지지 않습니다.
                            </p>
                        </section>

                        <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-[#999] dark:text-gray-500 text-sm">
                                시행일: 2024년 12월 1일<br />
                                최종 수정일: 2024년 12월 18일
                            </p>
                        </section>
                    </div>
                </motion.div>

                {/* 뒤로가기 */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white transition-colors">
                        ← 홈으로 돌아가기
                    </Link>
                </div>
            </main>

            {/* 공통 푸터 */}
            <Footer />
        </div>
    );
}
