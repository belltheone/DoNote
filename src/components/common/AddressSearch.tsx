"use client";
// 다음 우편번호 검색 컴포넌트
// next/script를 사용하여 외부 스크립트 로딩 + 모달 임베드

import { useState, useRef, useCallback, useEffect } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

// 다음 우편번호 글로벌 타입 정의
declare global {
    interface Window {
        daum: {
            Postcode: new (options: {
                oncomplete: (data: DaumPostcodeResult) => void;
                onclose?: () => void;
                width?: string | number;
                height?: string | number;
            }) => {
                embed: (element: HTMLElement, options?: { autoClose?: boolean }) => void;
                open: () => void;
            };
        };
    }
}

// 다음 우편번호 결과 타입
interface DaumPostcodeResult {
    zonecode: string;
    address: string;
    roadAddress: string;
    jibunAddress: string;
    addressType: string;
}

interface AddressSearchProps {
    onComplete: (data: {
        zonecode: string;    // 우편번호
        address: string;     // 기본주소
        addressType: string; // 주소 타입 (R: 도로명, J: 지번)
    }) => void;
    className?: string;
    placeholder?: string;
    value?: string;
}

export function AddressSearch({
    onComplete,
    className = "",
    placeholder = "주소 검색",
    value = "",
}: AddressSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const embedRef = useRef<HTMLDivElement>(null);

    // 주소 검색 임베드
    const embedPostcode = useCallback(() => {
        if (!isScriptLoaded || typeof window === "undefined" || !window.daum || !embedRef.current) {
            return;
        }

        // 기존 내용 초기화
        embedRef.current.innerHTML = "";

        new window.daum.Postcode({
            oncomplete: (data: DaumPostcodeResult) => {
                onComplete({
                    zonecode: data.zonecode,
                    address: data.roadAddress || data.jibunAddress,
                    addressType: data.addressType,
                });
                setIsOpen(false);
            },
            width: "100%",
            height: "100%",
        }).embed(embedRef.current, { autoClose: false });
    }, [isScriptLoaded, onComplete]);

    // 모달 열릴 때 임베드 실행
    useEffect(() => {
        if (isOpen && isScriptLoaded) {
            // 약간의 딜레이 후 임베드 (DOM 렌더링 대기)
            const timer = setTimeout(() => {
                embedPostcode();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isScriptLoaded, embedPostcode]);

    return (
        <div className={className}>
            {/* 다음 우편번호 스크립트 로드 */}
            <Script
                src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
                strategy="lazyOnload"
                onLoad={() => setIsScriptLoaded(true)}
            />

            {/* 주소 표시 및 검색 버튼 */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    readOnly
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-[#333] dark:text-white cursor-pointer"
                    onClick={() => setIsOpen(true)}
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-3 bg-[#FF6B6B] text-white rounded-lg font-medium hover:bg-[#FF5252] transition-colors whitespace-nowrap"
                >
                    🔍 주소 검색
                </button>
            </div>

            {/* 모달 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="bg-white rounded-xl overflow-hidden w-full max-w-lg mx-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 헤더 */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-bold text-[#333]">📍 주소 검색</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* 다음 우편번호 임베드 영역 */}
                            <div
                                ref={embedRef}
                                className="w-full"
                                style={{ height: "450px" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AddressSearch;
