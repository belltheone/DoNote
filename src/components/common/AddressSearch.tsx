"use client";
// 다음 우편번호 검색 컴포넌트
// next/script를 사용하여 외부 스크립트 로딩

import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

// 다음 우편번호 글로벌 타입 정의
declare global {
    interface Window {
        daum: {
            Postcode: new (options: {
                oncomplete: (data: DaumPostcodeResult) => void;
                onclose?: () => void;
                width?: string;
                height?: string;
            }) => {
                embed: (element: HTMLElement) => void;
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

    // 주소 검색 실행
    const openPostcode = useCallback(() => {
        if (!isScriptLoaded || typeof window === "undefined" || !window.daum) {
            console.error("다음 우편번호 스크립트가 로드되지 않았습니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data: DaumPostcodeResult) => {
                onComplete({
                    zonecode: data.zonecode,
                    address: data.roadAddress || data.jibunAddress,
                    addressType: data.addressType,
                });
                setIsOpen(false);
            },
            onclose: () => {
                setIsOpen(false);
            },
            width: "100%",
            height: "100%",
        }).open();
    }, [isScriptLoaded, onComplete]);

    // 모달 열릴 때 주소 검색 실행
    useEffect(() => {
        if (isOpen && isScriptLoaded) {
            openPostcode();
        }
    }, [isOpen, isScriptLoaded, openPostcode]);

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
        </div>
    );
}

export default AddressSearch;
