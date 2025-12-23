"use client";
// 공통 푸터 컴포넌트

import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-[#333] text-white py-12">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* 로고 */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo-140.png"
                                alt="도노트 로고"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold">도노트</span>
                        </div>
                        <p className="text-white/60 text-sm">
                            마음을 적는 가장 가벼운 후원 플랫폼
                        </p>
                    </div>

                    {/* 서비스 */}
                    <div>
                        <h4 className="font-semibold mb-4">서비스</h4>
                        <ul className="space-y-2 text-white/60 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    서비스 소개
                                </Link>
                            </li>
                            <li>
                                <Link href="/widget" className="hover:text-white transition-colors">
                                    위젯 데모
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 지원 */}
                    <div>
                        <h4 className="font-semibold mb-4">지원</h4>
                        <ul className="space-y-2 text-white/60 text-sm">
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    문의하기
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 법적 */}
                    <div>
                        <h4 className="font-semibold mb-4">법적 고지</h4>
                        <ul className="space-y-2 text-white/60 text-sm">
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors">
                                    이용약관
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    개인정보처리방침
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 사업자 정보 */}
                <div className="pt-8 border-t border-white/10 mb-6">
                    <div className="text-white/50 text-xs space-y-1">
                        <p>
                            <span className="text-white/70 font-medium">상호명:</span> 모두의 악보 |
                            <span className="text-white/70 font-medium ml-2">대표자:</span> 홍종원 |
                            <span className="text-white/70 font-medium ml-2">사업자등록번호:</span> 360-01-03089
                        </p>
                        <p>
                            <span className="text-white/70 font-medium">주소:</span> 대구광역시 남구 중앙대로45길 41 지하
                        </p>
                        <p>
                            <span className="text-white/70 font-medium">이메일:</span> moduakbo@moduakbo.com |
                            <span className="text-white/70 font-medium ml-2">전화:</span> 070-7954-2194
                        </p>
                    </div>
                </div>

                {/* 하단 */}
                <div className="text-center text-white/50 text-sm">
                    © 2024 Donote. Made with 💌 in Korea
                </div>
            </div>
        </footer>
    );
}
