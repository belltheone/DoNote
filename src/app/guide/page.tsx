"use client";
// 가이드 페이지 - 크리에이터 가이드, 위젯 설치, 정산 안내
// 스텝바이스텝 가이드 UI

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
    RocketLaunchIcon,
    CodeBracketIcon,
    BanknotesIcon,
    SparklesIcon,
    ClipboardDocumentIcon,
    HeartIcon,
} from "@heroicons/react/24/outline";

// 가이드 스텝 컴포넌트
function GuideStep({
    step,
    title,
    description,
    children
}: {
    step: number;
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: step * 0.1 }}
            className="flex gap-4 mb-8"
        >
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFD95A] flex items-center justify-center text-white font-bold">
                    {step}
                </div>
                <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mx-auto mt-2" />
            </div>
            <div className="flex-1 pb-8">
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-2">{title}</h3>
                <p className="text-[#666] dark:text-gray-400 mb-4">{description}</p>
                {children}
            </div>
        </motion.div>
    );
}

// 코드 블록 컴포넌트
function CodeBlock({ code }: { code: string }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        alert("복사되었습니다!");
    };

    return (
        <div className="relative bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="복사하기"
            >
                <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
            </button>
            <pre className="text-sm text-gray-300 font-mono">{code}</pre>
        </div>
    );
}

export default function GuidePage() {
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
                            <SparklesIcon className="w-16 h-16 text-[#FFD95A] mx-auto mb-4" />
                            <h1 className="text-3xl md:text-4xl font-bold text-[#333] dark:text-white mb-4">
                                시작 가이드
                            </h1>
                            <p className="text-[#666] dark:text-gray-400 text-lg">
                                도노트를 시작하는 방법을 단계별로 안내해 드려요
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 가이드 섹션들 */}
                <section className="py-12 px-6">
                    <div className="max-w-4xl mx-auto">

                        {/* 크리에이터 시작하기 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <RocketLaunchIcon className="w-8 h-8 text-[#FF6B6B]" />
                                <h2 className="text-2xl font-bold text-[#333] dark:text-white">
                                    크리에이터로 시작하기
                                </h2>
                            </div>

                            <GuideStep
                                step={1}
                                title="회원가입하기"
                                description="Google, Naver, GitHub 계정으로 간편하게 가입하세요."
                            >
                                <Link
                                    href="/auth"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#e55555] transition-colors"
                                >
                                    지금 가입하기 →
                                </Link>
                            </GuideStep>

                            <GuideStep
                                step={2}
                                title="프로필 설정하기"
                                description="핸들(고유 URL), 이름, 소개글, 프로필 이미지를 설정하세요. 핸들은 donote.site/your-handle 형태로 사용됩니다."
                            />

                            <GuideStep
                                step={3}
                                title="후원 링크 공유하기"
                                description="나만의 후원 페이지가 생성됩니다! SNS, 블로그, 유튜브 설명란에 링크를 공유하세요."
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-[#666] dark:text-gray-400 mb-2">내 후원 링크 예시</p>
                                    <p className="font-mono text-[#FF6B6B]">https://donote.site/your-handle</p>
                                </div>
                            </GuideStep>
                        </motion.div>

                        {/* 위젯 설치하기 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <CodeBracketIcon className="w-8 h-8 text-[#48BB78]" />
                                <h2 className="text-2xl font-bold text-[#333] dark:text-white">
                                    위젯 설치하기
                                </h2>
                            </div>

                            <GuideStep
                                step={1}
                                title="대시보드에서 위젯 코드 복사"
                                description="대시보드 > 위젯 메뉴에서 HTML 임베드 코드를 복사하세요."
                            />

                            <GuideStep
                                step={2}
                                title="블로그/사이트에 붙여넣기"
                                description="티스토리, 노션, 개인 블로그 등 HTML 임베드를 지원하는 곳이면 어디든 가능합니다."
                            >
                                <CodeBlock
                                    code={`<!-- 도노트 위젯 -->
<iframe 
  src="https://donote.site/widget/your-handle" 
  width="300" 
  height="80" 
  frameborder="0"
></iframe>`}
                                />
                            </GuideStep>

                            <GuideStep
                                step={3}
                                title="GitHub README에 추가하기"
                                description="마크다운 형식으로도 추가할 수 있어요."
                            >
                                <CodeBlock
                                    code={`[![도노트로 후원하기](https://img.shields.io/badge/도노트-후원하기-FF6B6B?style=for-the-badge)](https://donote.site/your-handle)`}
                                />
                            </GuideStep>
                        </motion.div>

                        {/* 정산 받기 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <BanknotesIcon className="w-8 h-8 text-[#FFD95A]" />
                                <h2 className="text-2xl font-bold text-[#333] dark:text-white">
                                    정산 받기
                                </h2>
                            </div>

                            <GuideStep
                                step={1}
                                title="정산 정보 등록"
                                description="대시보드 > 정산하기 메뉴에서 실명, 주소, 계좌 정보를 등록하세요."
                            >
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-[#666] dark:text-gray-300 text-sm">
                                    <p className="mb-2">📍 <b>주소 검색</b>: 다음 우편번호 서비스로 간편하게 입력</p>
                                    <p className="mb-2">🏦 <b>계좌 인증</b>: 포트원 API로 예금주 실명 검증 (필수)</p>
                                    <p>🔒 개인정보는 안전하게 암호화되어 저장됩니다</p>
                                </div>
                            </GuideStep>

                            <GuideStep
                                step={2}
                                title="정산 신청"
                                description="누적 후원금이 10,000원 이상이면 정산을 신청할 수 있습니다. 계좌 인증이 완료된 계좌로만 정산 가능합니다."
                            />

                            <GuideStep
                                step={3}
                                title="입금 확인"
                                description="정산 신청 후 관리자 승인을 거쳐 영업일 기준 3-5일 내에 입금됩니다."
                            >
                                <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-xl p-4 text-white">
                                    <p className="text-sm opacity-80 mb-1">수수료 안내</p>
                                    <p className="text-2xl font-bold">플랫폼 수수료 5%</p>
                                    <p className="text-sm opacity-80 mt-1">결제 수수료(PG) 별도 / 크리에이터는 약 92% 수령</p>
                                </div>
                            </GuideStep>
                        </motion.div>

                        {/* 팁(감사금) 프로세스 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <HeartIcon className="w-8 h-8 text-[#FF6B6B]" />
                                <h2 className="text-2xl font-bold text-[#333] dark:text-white">
                                    팁(감사금) 프로세스
                                </h2>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4">팁이란?</h3>
                                <p className="text-[#666] dark:text-gray-400 mb-4">
                                    후원자가 크리에이터에게 후원할 때, 도노트 서비스에 대한 감사의 마음으로
                                    추가로 보내는 소정의 금액입니다. 팁은 100% 선택 사항이며, 서비스 운영에 사용됩니다.
                                </p>
                            </div>

                            <GuideStep
                                step={1}
                                title="후원 페이지에서 결제"
                                description="후원자가 크리에이터 페이지에서 후원 금액을 선택하고 결제를 진행합니다."
                            />

                            <GuideStep
                                step={2}
                                title="팁 선택 (선택사항)"
                                description="결제 시 도노트에 대한 감사의 팁을 추가할 수 있습니다. 기본값은 0원이며, 500원의 작은 감사를 보낼 수 있습니다."
                            >
                                <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#FFD95A]/10 rounded-xl p-4 border border-[#FFD95A]/30">
                                    <p className="text-sm text-[#666] dark:text-gray-400">
                                        💡 팁은 100% 도노트 서비스 운영에 사용되며, 크리에이터 정산금에는 영향을 주지 않습니다.
                                    </p>
                                </div>
                            </GuideStep>

                            <GuideStep
                                step={3}
                                title="결제 완료 및 분배"
                                description="결제가 완료되면 후원금은 크리에이터에게, 팁은 도노트에 각각 정산됩니다."
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
                                        <p className="text-2xl mb-2">👤</p>
                                        <p className="text-sm font-medium text-[#333] dark:text-white">크리에이터</p>
                                        <p className="text-xs text-[#666] dark:text-gray-400">후원금 - 수수료(5%)</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
                                        <p className="text-2xl mb-2">🍩</p>
                                        <p className="text-sm font-medium text-[#333] dark:text-white">도노트</p>
                                        <p className="text-xs text-[#666] dark:text-gray-400">수수료(5%) + 팁</p>
                                    </div>
                                </div>
                            </GuideStep>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
                        >
                            <h3 className="text-xl font-bold text-[#333] dark:text-white mb-4">
                                시작할 준비가 되셨나요? 🚀
                            </h3>
                            <p className="text-[#666] dark:text-gray-400 mb-6">
                                지금 바로 크리에이터로 등록하고 후원을 받아보세요!
                            </p>
                            <Link
                                href="/auth"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                            >
                                무료로 시작하기
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
