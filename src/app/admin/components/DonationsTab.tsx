"use client";
// 후원/결제 관리 탭 - 전체 후원 내역, 상세 정보

import { motion } from "framer-motion";
import { useState } from "react";
import type { CreatorProfile, Donation } from "@/lib/supabase";

// Props 타입
interface DonationsTabProps {
    creators: CreatorProfile[];
    donations: Donation[];
}

export function DonationsTab({ creators, donations }: DonationsTabProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

    // 크리에이터 이름 조회
    const getCreatorName = (creatorId: string) => {
        const creator = creators.find(c => c.id === creatorId);
        return creator?.displayName || '알 수 없음';
    };

    // 필터링
    const filteredDonations = donations.filter(d =>
        d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCreatorName(d.creatorId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* 통계 요약 */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-[#666]">총 후원 건수</p>
                    <p className="text-2xl font-bold text-[#333]">{donations.length}건</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-[#666]">총 후원 금액</p>
                    <p className="text-2xl font-bold text-[#FF6B6B]">
                        ₩{donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm text-[#666]">평균 후원 금액</p>
                    <p className="text-2xl font-bold text-[#333]">
                        ₩{donations.length > 0 ? Math.floor(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length).toLocaleString() : 0}
                    </p>
                </div>
            </div>

            {/* 검색 */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="후원자, 크리에이터, 메시지로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                />
            </div>

            {/* 후원 목록 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left text-[#666] font-medium px-4 py-3">후원자</th>
                            <th className="text-left text-[#666] font-medium px-4 py-3">크리에이터</th>
                            <th className="text-left text-[#666] font-medium px-4 py-3">메시지</th>
                            <th className="text-right text-[#666] font-medium px-4 py-3">금액</th>
                            <th className="text-right text-[#666] font-medium px-4 py-3">날짜</th>
                            <th className="text-center text-[#666] font-medium px-4 py-3">상세</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDonations.map((donation, i) => (
                            <motion.tr
                                key={donation.id}
                                className="border-t border-gray-100 hover:bg-gray-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <span>{donation.sticker}</span>
                                        <span className="font-medium text-[#333]">{donation.donorName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-[#666]">{getCreatorName(donation.creatorId)}</td>
                                <td className="px-4 py-4 text-[#666] max-w-xs truncate">{donation.message}</td>
                                <td className="px-4 py-4 text-right font-bold text-[#FF6B6B]">
                                    ₩{donation.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-right text-sm text-[#999]">
                                    {new Date(donation.createdAt).toLocaleDateString('ko-KR')}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <button
                                        onClick={() => setSelectedDonation(donation)}
                                        className="px-3 py-1 bg-gray-100 text-[#666] rounded-lg text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        보기
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 상세 모달 */}
            {selectedDonation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-2xl w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#333]">후원 상세</h3>
                            <button onClick={() => setSelectedDonation(null)} className="text-2xl text-[#666]">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-center">
                                <span className="text-5xl">{selectedDonation.sticker}</span>
                                <p className="text-3xl font-bold text-[#FF6B6B] mt-4">
                                    ₩{selectedDonation.amount.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#666]">후원자</span>
                                    <span className="font-medium text-[#333]">{selectedDonation.donorName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#666]">크리에이터</span>
                                    <span className="font-medium text-[#333]">{getCreatorName(selectedDonation.creatorId)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#666]">날짜</span>
                                    <span className="font-medium text-[#333]">
                                        {new Date(selectedDonation.createdAt).toLocaleString('ko-KR')}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-[#FFFACD] rounded-xl p-4">
                                <p className="text-sm text-[#666] mb-1">메시지</p>
                                <p className="text-[#333]">{selectedDonation.message}</p>
                            </div>
                            <button className="w-full py-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors">
                                환불 처리
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
