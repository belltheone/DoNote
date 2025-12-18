"use client";
// 개인정보처리방침 페이지

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            {/* 네비게이션 */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🍩</span>
                        <span className="text-xl font-bold text-[#333]">도노트</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
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
                                <div>
                                    <h3 className="font-medium text-[#333] mb-2">크리에이터 가입 시</h3>
                                    <p className="text-[#666] text-sm">
                                        필수: 이메일, 이름(닉네임), 프로필 사진, 소셜 계정 정보<br />
                                        선택: 자기소개, 소셜 링크
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#333] mb-2">정산 신청 시</h3>
                                    <p className="text-[#666] text-sm">
                                        필수: 은행명, 계좌번호, 예금주명
                                    </p>
                                </div>
                                <div>
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
                            <h2 className="text-xl font-bold text-[#333] mb-4">4. 개인정보의 제3자 제공</h2>
                            <p className="text-[#666] leading-relaxed">
                                회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                                다만, 다음의 경우에는 예외로 합니다:
                            </p>
                            <ul className="text-[#666] space-y-2 list-disc list-inside mt-4">
                                <li>이용자가 사전에 동의한 경우</li>
                                <li>법령에 의해 요구되는 경우</li>
                                <li>서비스 제공을 위해 필요한 경우 (결제 대행사 등)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">5. 개인정보의 파기</h2>
                            <p className="text-[#666] leading-relaxed">
                                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                                지체없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 복구할 수 없는 방법으로
                                영구 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">6. 이용자의 권리</h2>
                            <ul className="text-[#666] space-y-2 list-disc list-inside">
                                <li>개인정보 열람 요구</li>
                                <li>오류 등이 있을 경우 정정 요구</li>
                                <li>삭제 요구</li>
                                <li>처리정지 요구</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">7. 쿠키의 사용</h2>
                            <p className="text-[#666] leading-relaxed">
                                회사는 이용자에게 개별적인 서비스를 제공하기 위해 쿠키(Cookie)를 사용합니다.
                                쿠키는 웹사이트가 이용자의 컴퓨터 브라우저로 전송하는 소량의 정보입니다.
                                이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 브라우저 설정을 통해 쿠키 허용 여부를
                                결정할 수 있습니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#333] mb-4">8. 개인정보보호 책임자</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
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
        </div>
    );
}
