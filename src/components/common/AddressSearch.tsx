"use client";
// 다음 우편번호 검색 컴포넌트
// react-daum-postcode 사용

import { useState } from "react";
import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
import { motion, AnimatePresence } from "framer-motion";

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

    // 주소 선택 완료 핸들러
    const handleComplete = (data: Address) => {
        onComplete({
            zonecode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
            addressType: data.addressType,
        });
        setIsOpen(false);
    };

    return (
        <div className={className}>
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
                            className="bg-white rounded-xl p-4 w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 헤더 */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-[#333]">📍 주소 검색</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* 다음 우편번호 검색 */}
                            <div className="h-[400px]">
                                <DaumPostcodeEmbed
                                    onComplete={handleComplete}
                                    style={{ width: "100%", height: "100%" }}
                                    autoClose={false}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AddressSearch;
