"use client";
// 수익 현황 탭 - 도노트 총 수익, 크리에이터별 수수료, 세금 보고서

import { useState } from "react";
import { motion } from "framer-motion";
import type { CreatorProfile, Donation } from "@/lib/supabase";

// Props 타입
interface RevenueTabProps {
    creators: CreatorProfile[];
    donations: Donation[];
}

// 수수료율
const FEE_RATE = 0.05;

export function RevenueTab({ creators, donations }: RevenueTabProps) {
    // 세금 보고서 상태
    const [reportYear, setReportYear] = useState(new Date().getFullYear());
    const [reportMonth, setReportMonth] = useState<number | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // 세금 보고서 다운로드 함수
    const handleDownloadTaxReport = async (format: 'csv' | 'json') => {
        setIsDownloading(true);
        try {
            const monthParam = reportMonth ? `&month=${reportMonth}` : '';
            const url = `/api/admin/tax-report?year=${reportYear}${monthParam}&format=${format}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('보고서 생성 실패');

            if (format === 'csv') {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `tax_report_${reportYear}${reportMonth ? '_' + reportMonth : ''}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
            } else {
                const data = await response.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `tax_report_${reportYear}${reportMonth ? '_' + reportMonth : ''}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
            }
        } catch (error) {
            console.error('세금 보고서 다운로드 오류:', error);
            alert('세금 보고서 다운로드에 실패했습니다.');
        } finally {
            setIsDownloading(false);
        }
    };

    // 통계 계산 - 실제 데이터 기반
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalFee = Math.floor(totalDonations * FEE_RATE);
    // 팁은 실제 isTipIncluded가 true인 후원에서만 계산
    const tipsData = donations.filter(d => d.isTipIncluded);
    const totalTips = tipsData.length * 500; // 도노트 팁이 포함된 후원당 500원
    const totalRevenue = totalFee + totalTips;

    // 크리에이터별 수수료
    const creatorFees = creators.map(creator => {
        const creatorDonations = donations.filter(d => d.creatorId === creator.id);
        const amount = creatorDonations.reduce((sum, d) => sum + d.amount, 0);
        return {
            ...creator,
            totalAmount: amount,
            fee: Math.floor(amount * FEE_RATE),
            donationCount: creatorDonations.length,
        };
    }).sort((a, b) => b.fee - a.fee);

    // 월별 수익 - 실제 데이터에서 계산
    const monthlyRevenue = Object.entries(
        donations.reduce((acc, d) => {
            const month = d.createdAt.substring(0, 7); // YYYY-MM
            if (!acc[month]) {
                acc[month] = { donations: 0, fees: 0, tips: 0 };
            }
            acc[month].donations += d.amount;
            acc[month].fees += Math.floor(d.amount * FEE_RATE);
            if (d.isTipIncluded) acc[month].tips += 500;
            return acc;
        }, {} as Record<string, { donations: number; fees: number; tips: number }>)
    ).map(([month, data]) => ({ month, ...data })).sort((a, b) => a.month.localeCompare(b.month));

    return (
        <div className="space-y-6">
            {/* 총 수익 요약 */}
            <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4 opacity-90">🍩 도노트 총 수익</h3>
                <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm opacity-80">총 후원금</p>
                        <p className="text-3xl font-bold">₩{totalDonations.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-80">수수료 수익 (5%)</p>
                        <p className="text-3xl font-bold">₩{totalFee.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-80">팁 수익</p>
                        <p className="text-3xl font-bold">₩{totalTips.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4">
                        <p className="text-sm opacity-80">합계</p>
                        <p className="text-3xl font-bold">₩{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* 월별 수익 추이 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">📊 월별 수익 추이</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left text-[#666] font-medium px-4 py-3">월</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">총 후원금</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">수수료</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">팁</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">도노트 수익</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyRevenue.map((data) => (
                                <motion.tr
                                    key={data.month}
                                    className="border-t border-gray-100"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <td className="px-4 py-4 font-medium text-[#333]">{data.month}</td>
                                    <td className="px-4 py-4 text-right text-[#666]">
                                        ₩{data.donations.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right text-[#FF6B6B]">
                                        ₩{data.fees.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right text-[#FFD95A]">
                                        ₩{data.tips.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-[#48BB78]">
                                        ₩{(data.fees + data.tips).toLocaleString()}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td className="px-4 py-3 font-bold text-[#333]">합계</td>
                                <td className="px-4 py-3 text-right font-bold text-[#333]">
                                    ₩{monthlyRevenue.reduce((sum, d) => sum + d.donations, 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#FF6B6B]">
                                    ₩{monthlyRevenue.reduce((sum, d) => sum + d.fees, 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#FFD95A]">
                                    ₩{monthlyRevenue.reduce((sum, d) => sum + d.tips, 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#48BB78]">
                                    ₩{monthlyRevenue.reduce((sum, d) => sum + d.fees + d.tips, 0).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* 크리에이터별 수수료 현황 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">👥 크리에이터별 수수료 현황</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left text-[#666] font-medium px-4 py-3">크리에이터</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">후원 건수</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">총 후원금</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">수수료 (5%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creatorFees.map((creator, index) => (
                                <motion.tr
                                    key={creator.id}
                                    className="border-t border-gray-100 hover:bg-gray-50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{creator.avatar}</span>
                                            <div>
                                                <p className="font-medium text-[#333]">{creator.displayName}</p>
                                                <p className="text-sm text-[#666]">@{creator.handle}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right text-[#666]">
                                        {creator.donationCount}건
                                    </td>
                                    <td className="px-4 py-4 text-right text-[#333]">
                                        ₩{creator.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-[#FF6B6B]">
                                        ₩{creator.fee.toLocaleString()}
                                    </td>
                                </motion.tr>
                            ))}
                            {creatorFees.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-12 text-[#666]">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td className="px-4 py-3 font-bold text-[#333]">합계</td>
                                <td className="px-4 py-3 text-right font-bold text-[#333]">
                                    {donations.length}건
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#333]">
                                    ₩{totalDonations.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#FF6B6B]">
                                    ₩{totalFee.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* 세금 보고서 다운로드 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">📋 세금 보고서 다운로드</h3>
                <p className="text-sm text-[#666] mb-4">
                    크리에이터별 정산 내역 및 원천징수 현황을 다운로드합니다. 홈택스 신고 시 사용할 수 있습니다.
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* 년도 선택 */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-[#666]">년도:</label>
                        <select
                            value={reportYear}
                            onChange={(e) => setReportYear(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-[#333] focus:border-[#FF6B6B] focus:outline-none"
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year}>{year}년</option>
                            ))}
                        </select>
                    </div>

                    {/* 월 선택 */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-[#666]">월:</label>
                        <select
                            value={reportMonth || ''}
                            onChange={(e) => setReportMonth(e.target.value ? parseInt(e.target.value) : null)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-[#333] focus:border-[#FF6B6B] focus:outline-none"
                        >
                            <option value="">전체 (연간)</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <option key={month} value={month}>{month}월</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleDownloadTaxReport('csv')}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#48BB78] text-white rounded-lg hover:bg-[#38A169] transition-colors disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >⏳</motion.span>
                        ) : (
                            <>📥 CSV 다운로드</>
                        )}
                    </button>
                    <button
                        onClick={() => handleDownloadTaxReport('json')}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4299E1] text-white rounded-lg hover:bg-[#3182CE] transition-colors disabled:opacity-50"
                    >
                        📥 JSON 다운로드
                    </button>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-700">
                        ⚠️ 보고서에는 크리에이터 정보(이름, 주민번호 앞자리 등)가 포함됩니다.
                        개인정보 보호에 유의하여 관리해주세요.
                    </p>
                </div>
            </div>
        </div>
    );
}
