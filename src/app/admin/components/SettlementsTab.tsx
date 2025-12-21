"use client";
// 정산 관리 탭 - 정산 요청 목록, 상세, 일괄 처리

import { motion } from "framer-motion";
import { useState } from "react";
import type { CreatorProfile } from "@/lib/supabase";

// 정산 타입
interface Settlement {
    id: string;
    creatorId: string;
    amount: number;
    netAmount: number;
    status: 'pending' | 'completed' | 'rejected';
    requestedAt: string;
    completedAt?: string;
    bankInfo?: string;
}

// Props 타입
interface SettlementsTabProps {
    creators: CreatorProfile[];
    settlements: Settlement[];
    onRefresh: () => void;
}

export function SettlementsTab({ creators, settlements, onRefresh }: SettlementsTabProps) {
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // 크리에이터 이름 조회
    const getCreatorName = (creatorId: string) => {
        const creator = creators.find(c => c.id === creatorId);
        return creator?.displayName || '알 수 없음';
    };

    // 필터링
    const filteredSettlements = settlements.filter(s =>
        statusFilter === 'all' || s.status === statusFilter
    );

    // 전체 선택
    const handleSelectAll = () => {
        if (selectedIds.length === filteredSettlements.filter(s => s.status === 'pending').length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSettlements.filter(s => s.status === 'pending').map(s => s.id));
        }
    };

    // 일괄 승인
    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        alert(`${selectedIds.length}건의 정산을 승인합니다.`);
        setSelectedIds([]);
        onRefresh();
    };

    // 통계
    const stats = {
        pending: settlements.filter(s => s.status === 'pending').length,
        pendingAmount: settlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.netAmount, 0),
        completed: settlements.filter(s => s.status === 'completed').length,
        completedAmount: settlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.netAmount, 0),
    };

    return (
        <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid md:grid-cols-4 gap-4">
                <motion.div
                    className="bg-yellow-50 rounded-xl p-4 border border-yellow-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-sm text-yellow-600">대기 중</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.pending}건</p>
                    <p className="text-sm text-yellow-600">₩{stats.pendingAmount.toLocaleString()}</p>
                </motion.div>
                <motion.div
                    className="bg-green-50 rounded-xl p-4 border border-green-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <p className="text-sm text-green-600">완료</p>
                    <p className="text-2xl font-bold text-green-700">{stats.completed}건</p>
                    <p className="text-sm text-green-600">₩{stats.completedAmount.toLocaleString()}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-sm text-[#666]">이번 달 정산 예정</p>
                    <p className="text-2xl font-bold text-[#333]">₩{stats.pendingAmount.toLocaleString()}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                    <div>
                        <p className="font-medium text-[#333]">자동 정산</p>
                        <p className="text-xs text-[#666]">매월 1일</p>
                    </div>
                </motion.div>
            </div>

            {/* 필터 및 일괄 작업 */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2">
                    {[
                        { id: 'all', label: '전체' },
                        { id: 'pending', label: '대기 중' },
                        { id: 'completed', label: '완료' },
                        { id: 'rejected', label: '거절' },
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setStatusFilter(filter.id as typeof statusFilter)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === filter.id
                                    ? 'bg-[#FFD95A] text-[#333]'
                                    : 'bg-gray-100 text-[#666] hover:bg-gray-200'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
                {selectedIds.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleBulkApprove}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                        >
                            ✓ {selectedIds.length}건 일괄 승인
                        </button>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="px-4 py-2 bg-gray-100 text-[#666] rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        >
                            선택 취소
                        </button>
                    </div>
                )}
            </div>

            {/* 정산 목록 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredSettlements.filter(s => s.status === 'pending').length && selectedIds.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4"
                                />
                            </th>
                            <th className="text-left text-[#666] font-medium px-4 py-3">크리에이터</th>
                            <th className="text-right text-[#666] font-medium px-4 py-3">요청 금액</th>
                            <th className="text-right text-[#666] font-medium px-4 py-3">정산 금액</th>
                            <th className="text-center text-[#666] font-medium px-4 py-3">상태</th>
                            <th className="text-right text-[#666] font-medium px-4 py-3">요청일</th>
                            <th className="text-center text-[#666] font-medium px-4 py-3">액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSettlements.map((settlement) => (
                            <tr key={settlement.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    {settlement.status === 'pending' && (
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(settlement.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds([...selectedIds, settlement.id]);
                                                } else {
                                                    setSelectedIds(selectedIds.filter(id => id !== settlement.id));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                    )}
                                </td>
                                <td className="px-4 py-4 font-medium text-[#333]">
                                    {getCreatorName(settlement.creatorId)}
                                </td>
                                <td className="px-4 py-4 text-right text-[#666]">
                                    ₩{settlement.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-[#FF6B6B]">
                                    ₩{settlement.netAmount.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${settlement.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                            settlement.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                'bg-red-100 text-red-600'
                                        }`}>
                                        {settlement.status === 'pending' ? '대기 중' :
                                            settlement.status === 'completed' ? '완료' : '거절'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right text-sm text-[#999]">
                                    {new Date(settlement.requestedAt).toLocaleDateString('ko-KR')}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {settlement.status === 'pending' && (
                                        <div className="flex gap-1 justify-center">
                                            <button className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200">
                                                승인
                                            </button>
                                            <button className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200">
                                                거절
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredSettlements.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-[#666]">
                                    정산 요청이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
