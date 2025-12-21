"use client";
// 메시지 신고 기능 컴포넌트

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string, details: string) => void;
    messageId: string;
}

// 신고 사유 목록
const reportReasons = [
    { id: 'spam', label: '스팸 또는 광고' },
    { id: 'abuse', label: '욕설 또는 비방' },
    { id: 'harassment', label: '괴롭힘 또는 협박' },
    { id: 'inappropriate', label: '부적절한 내용' },
    { id: 'other', label: '기타' },
];

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);
        try {
            await onSubmit(selectedReason, details);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 배경 */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* 모달 */}
                    <motion.div
                        className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* 헤더 */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[#333] dark:text-white flex items-center gap-2">
                                🚨 메시지 신고
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-[#999] hover:text-[#333] dark:hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 신고 사유 선택 */}
                        <div className="space-y-3 mb-6">
                            <p className="text-sm text-[#666] dark:text-gray-400">신고 사유를 선택해주세요</p>
                            {reportReasons.map(reason => (
                                <label
                                    key={reason.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedReason === reason.id
                                        ? 'bg-[#FF6B6B]/10 border-2 border-[#FF6B6B]'
                                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason.id}
                                        checked={selectedReason === reason.id}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedReason === reason.id
                                        ? 'border-[#FF6B6B] bg-[#FF6B6B]'
                                        : 'border-gray-300 dark:border-gray-500'
                                        }`}>
                                        {selectedReason === reason.id && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span className="text-[#333] dark:text-white">{reason.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* 상세 내용 */}
                        <div className="mb-6">
                            <label className="block text-sm text-[#666] dark:text-gray-400 mb-2">
                                추가 설명 (선택)
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="신고 사유에 대해 자세히 설명해주세요..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FF6B6B] focus:outline-none transition-colors resize-none"
                                rows={3}
                            />
                        </div>

                        {/* 안내 */}
                        <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                💡 허위 신고는 서비스 이용에 제한을 받을 수 있습니다.
                            </p>
                        </div>

                        {/* 버튼 */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-[#666] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedReason || isSubmitting}
                                className="flex-1 py-3 rounded-xl bg-[#FF6B6B] text-white font-semibold hover:bg-[#FF5252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '신고 중...' : '신고하기'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// 신고 버튼 (메시지 카드용)
interface ReportButtonProps {
    onReport: () => void;
    className?: string;
}

export function ReportButton({ onReport, className = "" }: ReportButtonProps) {
    return (
        <button
            onClick={onReport}
            className={`text-[#999] hover:text-[#FF6B6B] transition-colors ${className}`}
            title="신고하기"
        >
            🚨
        </button>
    );
}
