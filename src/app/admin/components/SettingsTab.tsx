"use client";
// 사이트 설정 탭 - 기본 정보, 수수료, 은행정보

import { motion } from "framer-motion";
import { useState } from "react";

// 설정 타입
interface SiteSettings {
    siteName: string;
    siteDescription: string;
    feeRate: number;
    minSettlementAmount: number;
    autoSettlement: boolean;
    emailNotifications: boolean;
}

interface BankInfo {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

export function SettingsTab() {
    // 사이트 설정 상태
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: "도노트",
        siteDescription: "크리에이터를 위한 마이크로 후원 플랫폼",
        feeRate: 5,
        minSettlementAmount: 10000,
        autoSettlement: true,
        emailNotifications: true,
    });

    // 은행정보 상태
    const [bankInfo, setBankInfo] = useState<BankInfo>({
        bankName: "",
        accountNumber: "",
        accountHolder: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    // 저장 핸들러
    const handleSaveSettings = async () => {
        setIsSaving(true);
        // Mock 저장 - 실제로는 API 호출
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        alert("설정이 저장되었습니다!");
    };

    return (
        <div className="space-y-6">
            {/* 기본 정보 */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                    ⚙️ 기본 정보
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-2">사이트명</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-2">사이트 설명</label>
                        <textarea
                            value={settings.siteDescription}
                            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none resize-none"
                            rows={3}
                        />
                    </div>
                </div>
            </motion.div>

            {/* 수수료 및 정산 설정 */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                    💰 수수료 및 정산
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-2">수수료율 (%)</label>
                        <input
                            type="number"
                            value={settings.feeRate}
                            onChange={(e) => setSettings({ ...settings, feeRate: Number(e.target.value) })}
                            min={0}
                            max={100}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                        />
                        <p className="text-xs text-[#999] mt-1">현재: 후원금의 {settings.feeRate}%</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-2">최소 정산 금액 (원)</label>
                        <input
                            type="number"
                            value={settings.minSettlementAmount}
                            onChange={(e) => setSettings({ ...settings, minSettlementAmount: Number(e.target.value) })}
                            min={1000}
                            step={1000}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                        />
                        <p className="text-xs text-[#999] mt-1">현재: ₩{settings.minSettlementAmount.toLocaleString()} 이상</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.autoSettlement}
                            onChange={(e) => setSettings({ ...settings, autoSettlement: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-[#FF6B6B] focus:ring-[#FFD95A]"
                        />
                        <span className="text-[#333]">매월 자동 정산 활성화</span>
                    </label>
                </div>
            </motion.div>

            {/* 도노트 은행정보 */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                    🏦 도노트 수익 입금 계좌
                </h3>
                <p className="text-sm text-[#666] mb-4">
                    수수료 및 팁이 입금될 계좌 정보를 등록하세요.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-2">은행명</label>
                        <select
                            value={bankInfo.bankName}
                            onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                        >
                            <option value="">선택하세요</option>
                            <option value="신한">신한은행</option>
                            <option value="국민">국민은행</option>
                            <option value="우리">우리은행</option>
                            <option value="하나">하나은행</option>
                            <option value="카카오">카카오뱅크</option>
                            <option value="토스">토스뱅크</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-2">계좌번호</label>
                        <input
                            type="text"
                            value={bankInfo.accountNumber}
                            onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                            placeholder="숫자만 입력"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#333] mb-2">예금주</label>
                        <input
                            type="text"
                            value={bankInfo.accountHolder}
                            onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                            placeholder="예금주명"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                        />
                    </div>
                </div>
            </motion.div>

            {/* 알림 설정 */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                    🔔 알림 설정
                </h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-[#FF6B6B] focus:ring-[#FFD95A]"
                        />
                        <div>
                            <span className="text-[#333] font-medium">이메일 알림</span>
                            <p className="text-xs text-[#666]">새 후원, 정산 완료 시 이메일 발송</p>
                        </div>
                    </label>
                </div>
            </motion.div>

            {/* 저장 버튼 */}
            <div className="flex justify-end">
                <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#e55555] transition-colors disabled:opacity-50"
                >
                    {isSaving ? "저장 중..." : "설정 저장"}
                </button>
            </div>
        </div>
    );
}
