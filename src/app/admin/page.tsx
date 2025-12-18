"use client";
// 관리자 페이지 - 전체 사이트 관리
// 보안: 환경 변수에서 관리자 계정 정보 가져옴

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { mockDonations } from "@/lib/supabase";

// 관리자 계정 (환경 변수에서 가져옴)
const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

// Mock 크리에이터 데이터
const mockCreators = [
    { id: '1', handle: 'devminsu', displayName: '개발하는 민수', email: 'minsu@test.com', totalDonations: 39000, joinedAt: '2024-11-01' },
    { id: '2', handle: 'designsuji', displayName: '디자인하는 수지', email: 'suji@test.com', totalDonations: 25000, joinedAt: '2024-11-05' },
    { id: '3', handle: 'contentchulsu', displayName: '글쓰는 철수', email: 'chulsu@test.com', totalDonations: 18000, joinedAt: '2024-11-10' },
];

// Mock 정산 요청 데이터
const mockSettlements = [
    { id: '1', creatorHandle: 'devminsu', amount: 50000, status: 'pending', requestedAt: '2024-12-15' },
    { id: '2', creatorHandle: 'designsuji', amount: 25000, status: 'completed', requestedAt: '2024-12-10', completedAt: '2024-12-13' },
];

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'creators' | 'donations' | 'settlements'>('dashboard');

    // 세션 체크
    useEffect(() => {
        const adminSession = sessionStorage.getItem('donote_admin');
        if (adminSession === 'authenticated') {
            setIsAuthenticated(true);
        }
    }, []);

    // 로그인 처리
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginId === ADMIN_ID && loginPw === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('donote_admin', 'authenticated');
            setLoginError('');
        } else {
            setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    // 로그아웃
    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('donote_admin');
    };

    // 로그인 폼
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
                <motion.div
                    className="w-full max-w-md bg-[#16213e] rounded-xl p-8 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-8">
                        <span className="text-4xl mb-4 block">🔐</span>
                        <h1 className="text-2xl font-bold text-white">관리자 로그인</h1>
                        <p className="text-gray-400 mt-2">도노트 관리 시스템</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">아이디</label>
                            <input
                                type="text"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0f3460] border border-[#1a1a2e] rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                                placeholder="admin"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">비밀번호</label>
                            <input
                                type="password"
                                value={loginPw}
                                onChange={(e) => setLoginPw(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0f3460] border border-[#1a1a2e] rounded-lg text-white focus:outline-none focus:border-[#e94560]"
                                placeholder="••••••••"
                            />
                        </div>

                        {loginError && (
                            <p className="text-red-400 text-sm">{loginError}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#e94560] rounded-lg text-white font-semibold hover:bg-[#ff6b6b] transition-colors"
                        >
                            로그인
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // 관리자 대시보드
    return (
        <div className="min-h-screen bg-[#1a1a2e]">
            {/* 헤더 */}
            <header className="bg-[#16213e] border-b border-[#0f3460] px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🍩</span>
                        <h1 className="text-xl font-bold text-white">도노트 관리자</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* 탭 네비게이션 */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {[
                        { id: 'dashboard', label: '대시보드', icon: '📊' },
                        { id: 'creators', label: '크리에이터', icon: '👥' },
                        { id: 'donations', label: '후원 내역', icon: '💌' },
                        { id: 'settlements', label: '정산 관리', icon: '💰' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-[#e94560] text-white'
                                : 'bg-[#16213e] text-gray-400 hover:text-white'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* 대시보드 탭 */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* 통계 카드 */}
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { label: '총 크리에이터', value: mockCreators.length, icon: '👥', color: 'from-blue-500 to-blue-600' },
                                { label: '총 후원 건수', value: mockDonations.length, icon: '💌', color: 'from-pink-500 to-pink-600' },
                                { label: '총 거래액', value: `₩${mockDonations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}`, icon: '💰', color: 'from-green-500 to-green-600' },
                                { label: '대기 중 정산', value: mockSettlements.filter(s => s.status === 'pending').length, icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-lg`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{stat.icon}</span>
                                    </div>
                                    <p className="text-white/80 text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* 최근 활동 */}
                        <div className="bg-[#16213e] rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">최근 후원</h3>
                            <div className="space-y-3">
                                {mockDonations.slice(0, 5).map((donation) => (
                                    <div key={donation.id} className="flex items-center justify-between p-3 bg-[#0f3460] rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{donation.sticker}</span>
                                            <div>
                                                <p className="text-white font-medium">{donation.donorName}</p>
                                                <p className="text-gray-400 text-sm truncate max-w-xs">{donation.message}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#e94560] font-bold">₩{donation.amount.toLocaleString()}</p>
                                            <p className="text-gray-500 text-xs">{new Date(donation.createdAt).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 크리에이터 탭 */}
                {activeTab === 'creators' && (
                    <div className="bg-[#16213e] rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#0f3460]">
                                <tr>
                                    <th className="text-left text-gray-400 font-medium px-6 py-4">크리에이터</th>
                                    <th className="text-left text-gray-400 font-medium px-6 py-4">핸들</th>
                                    <th className="text-left text-gray-400 font-medium px-6 py-4">이메일</th>
                                    <th className="text-right text-gray-400 font-medium px-6 py-4">총 후원</th>
                                    <th className="text-right text-gray-400 font-medium px-6 py-4">가입일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockCreators.map((creator) => (
                                    <tr key={creator.id} className="border-t border-[#0f3460]">
                                        <td className="px-6 py-4 text-white font-medium">{creator.displayName}</td>
                                        <td className="px-6 py-4 text-gray-400">@{creator.handle}</td>
                                        <td className="px-6 py-4 text-gray-400">{creator.email}</td>
                                        <td className="px-6 py-4 text-right text-[#e94560] font-bold">₩{creator.totalDonations.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-gray-500">{creator.joinedAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 후원 내역 탭 */}
                {activeTab === 'donations' && (
                    <div className="bg-[#16213e] rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#0f3460]">
                                <tr>
                                    <th className="text-left text-gray-400 font-medium px-6 py-4">후원자</th>
                                    <th className="text-left text-gray-400 font-medium px-6 py-4">메시지</th>
                                    <th className="text-right text-gray-400 font-medium px-6 py-4">금액</th>
                                    <th className="text-center text-gray-400 font-medium px-6 py-4">상태</th>
                                    <th className="text-right text-gray-400 font-medium px-6 py-4">일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockDonations.map((donation) => (
                                    <tr key={donation.id} className="border-t border-[#0f3460]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span>{donation.sticker}</span>
                                                <span className="text-white">{donation.donorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{donation.message}</td>
                                        <td className="px-6 py-4 text-right text-[#e94560] font-bold">₩{donation.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs ${donation.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>{donation.status === 'paid' ? '완료' : '대기'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">{new Date(donation.createdAt).toLocaleDateString('ko-KR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 정산 관리 탭 */}
                {activeTab === 'settlements' && (
                    <div className="bg-[#16213e] rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#0f3460]">
                                <tr>
                                    <th className="text-left text-gray-400 font-medium px-6 py-4">크리에이터</th>
                                    <th className="text-right text-gray-400 font-medium px-6 py-4">정산 금액</th>
                                    <th className="text-center text-gray-400 font-medium px-6 py-4">상태</th>
                                    <th className="text-right text-gray-400 font-medium px-6 py-4">신청일</th>
                                    <th className="text-center text-gray-400 font-medium px-6 py-4">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockSettlements.map((settlement) => (
                                    <tr key={settlement.id} className="border-t border-[#0f3460]">
                                        <td className="px-6 py-4 text-white">@{settlement.creatorHandle}</td>
                                        <td className="px-6 py-4 text-right text-[#e94560] font-bold">₩{settlement.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs ${settlement.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>{settlement.status === 'completed' ? '완료' : '대기'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">{settlement.requestedAt}</td>
                                        <td className="px-6 py-4 text-center">
                                            {settlement.status === 'pending' && (
                                                <button className="px-3 py-1 bg-[#e94560] text-white rounded text-sm hover:bg-[#ff6b6b] transition-colors">
                                                    승인
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
