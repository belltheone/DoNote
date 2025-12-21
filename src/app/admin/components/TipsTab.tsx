"use client";
// 팁/수수료 관리 탭 - 팁 수익 통계, 수수료 현황

import { motion } from "framer-motion";
import type { CreatorProfile, Donation } from "@/lib/supabase";
import { toast } from "sonner";

// Props 타입
interface TipsTabProps {
    creators: CreatorProfile[];
    donations: Donation[];
}

// 수수료율
const FEE_RATE = 0.05;

// CSV 다운로드 함수
const downloadCSV = (monthlyData: Array<{ month: string; fees: number; tips: number }>) => {
    // CSV 헤더
    const headers = ['월', '수수료(원)', '팁(원)', '합계(원)'];

    // CSV 데이터 행
    const rows = monthlyData.map(data => [
        data.month,
        data.fees,
        data.tips,
        data.fees + data.tips
    ]);

    // 합계 행 추가
    const totalFees = monthlyData.reduce((sum, d) => sum + d.fees, 0);
    const totalTips = monthlyData.reduce((sum, d) => sum + d.tips, 0);
    rows.push(['합계', totalFees, totalTips, totalFees + totalTips]);

    // CSV 문자열 생성
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // BOM 추가 (한글 엑셀 호환)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // 다운로드
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `도노트_수익리포트_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('리포트가 다운로드되었습니다!');
};

export function TipsTab({ creators, donations }: TipsTabProps) {
    // 총 후원금
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    // 총 수수료
    const totalFee = Math.floor(totalDonations * FEE_RATE);
    // 팁 (Mock - 실제로는 DB에서)
    const totalTips = Math.floor(totalDonations * 0.02); // 평균 2% 팁 가정
    // 도노트 총 수익
    const totalRevenue = totalFee + totalTips;

    // 월별 데이터 (Mock)
    const monthlyData = [
        { month: '10월', fees: 125000, tips: 45000 },
        { month: '11월', fees: 189000, tips: 67000 },
        { month: '12월', fees: totalFee, tips: totalTips },
    ];

    // 크리에이터별 수수료
    const creatorFees = creators.map(creator => {
        const creatorDonations = donations.filter(d => d.creatorId === creator.id);
        const amount = creatorDonations.reduce((sum, d) => sum + d.amount, 0);
        return {
            ...creator,
            totalAmount: amount,
            fee: Math.floor(amount * FEE_RATE),
        };
    }).sort((a, b) => b.fee - a.fee);

    return (
        <div className="space-y-6">
            {/* 수익 요약 카드 */}
            <div className="grid md:grid-cols-4 gap-4">
                <motion.div
                    className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-xl p-6 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-sm opacity-80">총 수수료 (5%)</p>
                    <p className="text-3xl font-bold mt-2">₩{totalFee.toLocaleString()}</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-[#FFD95A] to-[#FFE57F] rounded-xl p-6 text-[#333]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-sm opacity-80">총 팁 수익</p>
                    <p className="text-3xl font-bold mt-2">₩{totalTips.toLocaleString()}</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-[#48BB78] to-[#68D391] rounded-xl p-6 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-sm opacity-80">도노트 총 수익</p>
                    <p className="text-3xl font-bold mt-2">₩{totalRevenue.toLocaleString()}</p>
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-[#4299E1] to-[#63B3ED] rounded-xl p-6 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm opacity-80">평균 팁 비율</p>
                    <p className="text-3xl font-bold mt-2">2.0%</p>
                </motion.div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#333]">📊 월별 수익 추이</h3>
                    <button
                        onClick={() => downloadCSV(monthlyData)}
                        className="px-4 py-2 bg-[#FFD95A] text-[#333] rounded-lg text-sm hover:bg-[#FFCE3A] transition-colors"
                    >
                        📥 리포트 다운로드
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left text-[#666] font-medium px-4 py-3">월</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">수수료</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">팁</th>
                                <th className="text-right text-[#666] font-medium px-4 py-3">합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map((data, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="px-4 py-4 font-medium text-[#333]">{data.month}</td>
                                    <td className="px-4 py-4 text-right text-[#FF6B6B]">₩{data.fees.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-right text-[#FFD95A]">₩{data.tips.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-right font-bold text-[#333]">
                                        ₩{(data.fees + data.tips).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td className="px-4 py-4 font-bold text-[#333]">합계</td>
                                <td className="px-4 py-4 text-right font-bold text-[#FF6B6B]">
                                    ₩{monthlyData.reduce((sum, d) => sum + d.fees, 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-[#FFD95A]">
                                    ₩{monthlyData.reduce((sum, d) => sum + d.tips, 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-[#48BB78]">
                                    ₩{monthlyData.reduce((sum, d) => sum + d.fees + d.tips, 0).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* 크리에이터별 수수료 TOP */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">👑 크리에이터별 수수료 TOP 10</h3>
                <div className="space-y-3">
                    {creatorFees.slice(0, 10).map((creator, i) => (
                        <div key={creator.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${i === 0 ? 'bg-[#FFD95A] text-[#333]' :
                                i === 1 ? 'bg-gray-300 text-[#333]' :
                                    i === 2 ? 'bg-[#CD7F32] text-white' :
                                        'bg-gray-100 text-[#666]'
                                }`}>
                                {i + 1}
                            </span>
                            <span className="text-2xl">{creator.avatar}</span>
                            <div className="flex-1">
                                <p className="font-medium text-[#333]">{creator.displayName}</p>
                                <p className="text-sm text-[#666]">@{creator.handle}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#666]">총 후원: ₩{creator.totalAmount.toLocaleString()}</p>
                                <p className="font-bold text-[#FF6B6B]">수수료: ₩{creator.fee.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
