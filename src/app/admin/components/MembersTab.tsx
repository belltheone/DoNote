"use client";
// 회원 관리 탭 - 크리에이터 목록, 검색, 상세 모달

import { motion } from "framer-motion";
import { useState } from "react";
import type { CreatorProfile, Donation } from "@/lib/supabase";

// Props 타입
interface MembersTabProps {
    creators: CreatorProfile[];
    donations: Donation[];
}

// 회원 유형
type MemberType = "all" | "admin" | "creator" | "donor";

// 수수료율
const FEE_RATE = 0.05;

// 관리자 이메일
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';

// 후원자 타입 (실제 데이터에서 계산)
interface DonorInfo {
    nickname: string;
    totalAmount: number;
    count: number;
    lastDonation: string;
}

export function MembersTab({ creators, donations }: MembersTabProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
    const [memberType, setMemberType] = useState<MemberType>("all");
    const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

    // 실제 후원 데이터에서 후원자 목록 계산
    const donors: DonorInfo[] = Object.values(
        donations.reduce((acc, d) => {
            const key = d.donorName;
            if (!acc[key]) {
                acc[key] = { nickname: d.donorName, totalAmount: 0, count: 0, lastDonation: d.createdAt };
            }
            acc[key].totalAmount += d.amount;
            acc[key].count += 1;
            if (new Date(d.createdAt) > new Date(acc[key].lastDonation)) {
                acc[key].lastDonation = d.createdAt;
            }
            return acc;
        }, {} as Record<string, DonorInfo>)
    ).sort((a, b) => b.totalAmount - a.totalAmount);

    // 관리자 목록 (현재 로그인한 관리자만 표시)
    const admins = [
        { id: 'admin', name: '관리자', email: ADMIN_EMAIL, role: '최고관리자', lastLogin: new Date().toISOString().split('T')[0] },
    ];

    // 크리에이터별 통계 계산
    const getCreatorStats = (creatorId: string) => {
        const creatorDonations = donations.filter(d => d.creatorId === creatorId);
        return {
            totalAmount: creatorDonations.reduce((sum, d) => sum + d.amount, 0),
            count: creatorDonations.length,
            fee: Math.floor(creatorDonations.reduce((sum, d) => sum + d.amount, 0) * FEE_RATE),
        };
    };

    // 필터링
    const filteredCreators = creators.filter(creator => {
        const matchesSearch = creator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            creator.handle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* 회원 유형별 탭 */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { type: 'all' as MemberType, label: '전체', count: creators.length + donors.length + admins.length },
                    { type: 'admin' as MemberType, label: '관리자', count: admins.length },
                    { type: 'creator' as MemberType, label: '크리에이터', count: creators.length },
                    { type: 'donor' as MemberType, label: '후원자', count: donors.length },
                ].map((tab) => (
                    <button
                        key={tab.type}
                        onClick={() => setMemberType(tab.type)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${memberType === tab.type
                            ? 'bg-[#FF6B6B] text-white'
                            : 'bg-gray-100 text-[#666] hover:bg-gray-200'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* 검색 및 필터 */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="이름, 핸들, 이메일로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                    />
                </div>
                {memberType === "creator" && (
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFD95A] focus:outline-none"
                    >
                        <option value="all">전체 상태</option>
                        <option value="active">활성</option>
                        <option value="suspended">정지</option>
                    </select>
                )}
            </div>

            {/* 관리자 목록 */}
            {(memberType === "all" || memberType === "admin") && (
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="bg-purple-50 px-6 py-3 border-b">
                        <h4 className="font-bold text-purple-700">👑 관리자</h4>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left text-[#666] font-medium px-6 py-3">이름</th>
                                <th className="text-left text-[#666] font-medium px-6 py-3">이메일</th>
                                <th className="text-left text-[#666] font-medium px-6 py-3">역할</th>
                                <th className="text-left text-[#666] font-medium px-6 py-3">최근 로그인</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id} className="border-t border-gray-100">
                                    <td className="px-6 py-4 font-medium text-[#333]">{admin.name}</td>
                                    <td className="px-6 py-4 text-[#666]">{admin.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#666]">{admin.lastLogin}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 후원자 목록 */}
            {(memberType === "all" || memberType === "donor") && (
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="bg-green-50 px-6 py-3 border-b">
                        <h4 className="font-bold text-green-700">💚 후원자</h4>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left text-[#666] font-medium px-6 py-3">닉네임</th>
                                <th className="text-right text-[#666] font-medium px-6 py-3">총 후원금</th>
                                <th className="text-right text-[#666] font-medium px-6 py-3">후원 횟수</th>
                                <th className="text-left text-[#666] font-medium px-6 py-3">최근 후원</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donors.filter(d => d.nickname.includes(searchTerm)).map((donor, idx) => (
                                <tr key={idx} className="border-t border-gray-100">
                                    <td className="px-6 py-4 font-medium text-[#333]">🎁 {donor.nickname}</td>
                                    <td className="px-6 py-4 text-right text-[#FF6B6B] font-bold">
                                        ₩{donor.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-[#666]">{donor.count}건</td>
                                    <td className="px-6 py-4 text-[#666]">{new Date(donor.lastDonation).toLocaleDateString('ko-KR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 크리에이터 목록 */}
            {(memberType === "all" || memberType === "creator") && (
                <>
                    <div className="text-sm text-[#666]">
                        총 {filteredCreators.length}명의 크리에이터
                    </div>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="bg-yellow-50 px-6 py-3 border-b">
                            <h4 className="font-bold text-yellow-700">✨ 크리에이터</h4>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">크리에이터</th>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">핸들</th>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">소개</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">총 후원</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">후원 수</th>
                                    <th className="text-center text-[#666] font-medium px-6 py-4">상태</th>
                                    <th className="text-center text-[#666] font-medium px-6 py-4">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCreators.map((creator, index) => {
                                    const stats = getCreatorStats(creator.id);
                                    return (
                                        <motion.tr
                                            key={creator.id}
                                            className="border-t border-gray-100 hover:bg-gray-50"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{creator.avatar}</span>
                                                    <span className="font-medium text-[#333]">{creator.displayName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#666]">@{creator.handle}</td>
                                            <td className="px-6 py-4 text-[#666] text-sm max-w-xs truncate">{creator.bio || '-'}</td>
                                            <td className="px-6 py-4 text-right text-[#FF6B6B] font-bold">
                                                ₩{stats.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-[#666]">{stats.count}건</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                                                    활성
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setSelectedCreator(creator)}
                                                    className="px-3 py-1 bg-[#FFD95A] text-[#333] rounded-lg text-sm hover:bg-[#FFCE3A] transition-colors"
                                                >
                                                    상세
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                                {filteredCreators.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-[#666]">
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 회원 상세 모달 */}
                    {selectedCreator && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                                    <h3 className="text-xl font-bold text-[#333]">회원 상세 정보</h3>
                                    <button
                                        onClick={() => setSelectedCreator(null)}
                                        className="text-2xl text-[#666] hover:text-[#333]"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* 프로필 */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-5xl">{selectedCreator.avatar}</span>
                                        <div>
                                            <h4 className="text-2xl font-bold text-[#333]">{selectedCreator.displayName}</h4>
                                            <p className="text-[#666]">@{selectedCreator.handle}</p>
                                            <p className="text-sm text-[#999]">{selectedCreator.bio?.slice(0, 50) || '소개글 없음'}</p>
                                        </div>
                                    </div>

                                    {/* 소개 */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-[#666]">{selectedCreator.bio || '소개글이 없습니다.'}</p>
                                    </div>

                                    {/* 통계 */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-[#FFFACD] rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-[#333]">
                                                ₩{getCreatorStats(selectedCreator.id).totalAmount.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-[#666]">총 후원금</p>
                                        </div>
                                        <div className="bg-[#FFE4E1] rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-[#FF6B6B]">
                                                ₩{getCreatorStats(selectedCreator.id).fee.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-[#666]">수수료</p>
                                        </div>
                                        <div className="bg-[#E6F3FF] rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-[#333]">
                                                {getCreatorStats(selectedCreator.id).count}건
                                            </p>
                                            <p className="text-sm text-[#666]">후원 횟수</p>
                                        </div>
                                    </div>

                                    {/* 가입일 */}
                                    <div className="text-sm text-[#999]">
                                        가입일: {new Date(selectedCreator.createdAt).toLocaleDateString('ko-KR')}
                                    </div>

                                    {/* 액션 버튼 */}
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 bg-gray-100 text-[#666] rounded-xl hover:bg-gray-200 transition-colors">
                                            정지하기
                                        </button>
                                        <button className="flex-1 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#e55555] transition-colors">
                                            관리자 지정
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
