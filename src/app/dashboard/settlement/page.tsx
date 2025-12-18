"use client";
// 정산 신청 페이지 - 수확하기 (The Harvest)

import { motion } from "framer-motion";
import { useState } from "react";
import { getStats, mockDonations } from "@/lib/supabase";

// 정산 상태 타입
type SettlementStatus = 'available' | 'requested' | 'processing' | 'completed';

// 정산 내역 (Mock)
const settlementHistory = [
    { id: '1', amount: 50000, status: 'completed' as const, requestedAt: '2024-11-15', completedAt: '2024-11-18' },
    { id: '2', amount: 30000, status: 'completed' as const, requestedAt: '2024-10-20', completedAt: '2024-10-23' },
];

export default function SettlementPage() {
    const stats = getStats();
    const [step, setStep] = useState<'overview' | 'request' | 'confirm' | 'complete'>('overview');
    const [bankInfo, setBankInfo] = useState({
        bank: '',
        accountNumber: '',
        accountHolder: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 정산 가능 금액 (총 후원금 - 이미 정산한 금액)
    const settledAmount = settlementHistory.reduce((sum, s) => sum + s.amount, 0);
    const availableAmount = stats.totalAmount - settledAmount;

    // 플랫폼 수수료 5% + PG 수수료 3% = 총 8%
    const platformFee = Math.round(availableAmount * 0.05); // 플랫폼 5%
    const pgFee = Math.round(availableAmount * 0.03);       // PG 3%
    const totalFee = platformFee + pgFee;
    const netAmount = availableAmount - totalFee;

    // 정산 신청 처리
    const handleSubmit = () => {
        setIsSubmitting(true);
        // 실제로는 API 호출
        setTimeout(() => {
            setStep('complete');
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* 페이지 헤더 */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-[#333] flex items-center gap-2">
                    <span>🍯</span> 수확하기
                </h2>
                <p className="text-[#666] mt-1">받은 후원금을 정산받으세요</p>
            </motion.div>

            {/* 스텝별 컨텐츠 */}
            {step === 'overview' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* 정산 가능 금액 카드 */}
                    <div className="bg-gradient-to-r from-[#FFD95A] to-[#FFE082] rounded-2xl p-8 shadow-lg relative overflow-hidden">
                        {/* 데코 */}
                        <div className="absolute top-4 right-4 text-6xl opacity-20">🍯</div>

                        <p className="text-[#333]/70 text-sm mb-2">정산 가능 금액</p>
                        <p className="text-5xl font-bold text-[#333] mb-4">
                            ₩{availableAmount.toLocaleString()}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-[#333]/70">
                                총 후원: ₩{stats.totalAmount.toLocaleString()}
                            </span>
                            <span className="text-[#333]/50">|</span>
                            <span className="text-[#333]/70">
                                기 정산: ₩{settledAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* 정산 신청 버튼 */}
                    <button
                        onClick={() => setStep('request')}
                        disabled={availableAmount < 10000}
                        className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {availableAmount >= 10000 ? '정산 신청하기' : '최소 정산 금액: ₩10,000'}
                    </button>

                    {/* 정산 내역 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                            <span>📋</span> 정산 내역
                        </h3>

                        {settlementHistory.length > 0 ? (
                            <div className="space-y-3">
                                {settlementHistory.map((settlement) => (
                                    <div
                                        key={settlement.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                                    >
                                        <div>
                                            <p className="font-bold text-[#333]">
                                                ₩{settlement.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-[#999]">
                                                {settlement.requestedAt} 신청 → {settlement.completedAt} 완료
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                                            ✓ 완료
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[#999]">
                                아직 정산 내역이 없어요
                            </div>
                        )}
                    </div>

                    {/* 안내 */}
                    <div className="bg-[#FFFACD] rounded-xl p-4 border-2 border-dashed border-[#FFD95A]">
                        <p className="text-sm text-[#666]">
                            💡 <strong>정산 안내</strong>: 정산 신청 후 영업일 기준 3일 이내에 입금됩니다. 최소 정산 금액은 ₩10,000입니다.
                        </p>
                        <p className="text-xs text-[#999] mt-2">
                            ※ 플랫폼 수수료 5% + PG 수수료 3% = 총 8%가 차감됩니다.
                        </p>
                    </div>
                </motion.div>
            )}

            {step === 'request' && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* 계좌 정보 입력 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                            <span>🏦</span> 계좌 정보 입력
                        </h3>

                        <div className="space-y-4">
                            {/* 은행 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-[#666] mb-2">
                                    은행 선택
                                </label>
                                <select
                                    value={bankInfo.bank}
                                    onChange={(e) => setBankInfo({ ...bankInfo, bank: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                >
                                    <option value="">은행을 선택하세요</option>
                                    <option value="kakao">카카오뱅크</option>
                                    <option value="toss">토스뱅크</option>
                                    <option value="kb">KB국민은행</option>
                                    <option value="shinhan">신한은행</option>
                                    <option value="woori">우리은행</option>
                                    <option value="hana">하나은행</option>
                                    <option value="nh">농협은행</option>
                                </select>
                            </div>

                            {/* 계좌번호 */}
                            <div>
                                <label className="block text-sm font-medium text-[#666] mb-2">
                                    계좌번호
                                </label>
                                <input
                                    type="text"
                                    value={bankInfo.accountNumber}
                                    onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                                    placeholder="'-' 없이 숫자만 입력"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                />
                            </div>

                            {/* 예금주 */}
                            <div>
                                <label className="block text-sm font-medium text-[#666] mb-2">
                                    예금주
                                </label>
                                <input
                                    type="text"
                                    value={bankInfo.accountHolder}
                                    onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                                    placeholder="본인 명의 계좌만 가능"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 정산 금액 요약 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="text-center text-sm text-[#999] mb-3">--- 정산 금액 ---</div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[#666]">
                                <span>정산 요청 금액</span>
                                <span>₩{availableAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[#999] text-sm">
                                <span>플랫폼 수수료 (5%)</span>
                                <span className="text-red-500">-₩{platformFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[#999] text-sm">
                                <span>PG 수수료 (3%)</span>
                                <span className="text-red-500">-₩{pgFee.toLocaleString()}</span>
                            </div>
                            <div className="pt-3 border-t border-dashed border-gray-300 flex justify-between font-bold text-[#333]">
                                <span>실 입금액</span>
                                <span className="text-[#FF6B6B]">₩{netAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* 버튼들 */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep('overview')}
                            className="flex-1 py-4 bg-gray-100 rounded-xl text-[#666] font-semibold hover:bg-gray-200 transition-colors"
                        >
                            ← 이전
                        </button>
                        <button
                            onClick={() => setStep('confirm')}
                            disabled={!bankInfo.bank || !bankInfo.accountNumber || !bankInfo.accountHolder}
                            className="flex-1 py-4 bg-[#FFD95A] rounded-xl text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFCE3A] transition-all shadow-md"
                        >
                            다음으로 →
                        </button>
                    </div>
                </motion.div>
            )}

            {step === 'confirm' && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* 최종 확인 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                            <span>✅</span> 정산 신청 확인
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-[#FFFACD] rounded-xl">
                                <p className="text-sm text-[#666] mb-1">입금 계좌</p>
                                <p className="font-bold text-[#333]">
                                    {bankInfo.bank === 'kakao' && '카카오뱅크'}
                                    {bankInfo.bank === 'toss' && '토스뱅크'}
                                    {bankInfo.bank === 'kb' && 'KB국민은행'}
                                    {bankInfo.bank === 'shinhan' && '신한은행'}
                                    {bankInfo.bank === 'woori' && '우리은행'}
                                    {bankInfo.bank === 'hana' && '하나은행'}
                                    {bankInfo.bank === 'nh' && '농협은행'}
                                    {' '}{bankInfo.accountNumber}
                                </p>
                                <p className="text-sm text-[#666]">예금주: {bankInfo.accountHolder}</p>
                            </div>

                            <div className="p-4 bg-[#FFE4E1] rounded-xl">
                                <p className="text-sm text-[#666] mb-1">입금 예정 금액</p>
                                <p className="text-3xl font-bold text-[#FF6B6B]">
                                    ₩{netAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-[#999] mt-1">영업일 기준 3일 이내 입금</p>
                            </div>
                        </div>
                    </div>

                    {/* 안내 */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-[#666]">
                            ⚠️ 정산 신청 후에는 취소할 수 없습니다. 계좌 정보를 다시 한번 확인해주세요.
                        </p>
                    </div>

                    {/* 버튼들 */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep('request')}
                            className="flex-1 py-4 bg-gray-100 rounded-xl text-[#666] font-semibold hover:bg-gray-200 transition-colors"
                        >
                            ← 수정
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="inline-block"
                                >⏳</motion.span>
                            ) : '정산 신청 완료'}
                        </button>
                    </div>
                </motion.div>
            )}

            {step === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    {/* 성공 애니메이션 */}
                    <motion.div
                        className="text-8xl mb-6"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 0.6 }}
                    >
                        🍯
                    </motion.div>

                    <h2 className="text-2xl font-bold mb-2 text-[#333]">정산 신청이 완료되었습니다!</h2>
                    <p className="text-[#666] mb-8">
                        영업일 기준 3일 이내에 입금될 예정이에요
                    </p>

                    {/* 요약 카드 */}
                    <div className="bg-[#FFFACD] rounded-xl p-6 text-left mb-8 shadow-md mx-auto max-w-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">💰</span>
                            <span className="font-bold text-[#333]">입금 예정</span>
                        </div>
                        <p className="text-3xl font-bold text-[#FF6B6B] mb-2">
                            ₩{netAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-[#666]">
                            {bankInfo.bank === 'kakao' && '카카오뱅크'}
                            {bankInfo.bank === 'toss' && '토스뱅크'}
                            {bankInfo.bank !== 'kakao' && bankInfo.bank !== 'toss' && bankInfo.bank}
                            {' '}{bankInfo.accountNumber.replace(/(\d{4})(\d+)(\d{4})/, '$1-****-$3')}
                        </p>
                    </div>

                    {/* 버튼 */}
                    <button
                        onClick={() => setStep('overview')}
                        className="px-8 py-4 bg-[#FFD95A] rounded-xl text-[#333] font-semibold hover:bg-[#FFCE3A] transition-all shadow-md"
                    >
                        확인
                    </button>
                </motion.div>
            )}
        </div>
    );
}
