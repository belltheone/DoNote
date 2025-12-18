"use client";
// 관리자 페이지 - 실제 데이터 연동
// Supabase 인증 통합 (admin@admin.admin)

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import {
    supabase,
    getAllCreators,
    getAllDonations,
    getAllSettlements,
    mockDonations,
    type CreatorProfile,
    type Donation
} from "@/lib/supabase";
import { Header } from "@/components/layout/Header";

// 관리자 이메일
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';

// 수수료율 5%
const FEE_RATE = 0.05;

// 정산 타입
interface Settlement {
    id: string;
    creatorId: string;
    amount: number;
    netAmount: number;
    status: string;
    requestedAt: string;
    completedAt?: string;
}

export default function AdminPage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'creators' | 'donations' | 'settlements' | 'revenue'>('dashboard');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // 실제 데이터 상태
    const [creators, setCreators] = useState<CreatorProfile[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // 관리자 권한 체크
    const isAdmin = user?.email === ADMIN_EMAIL;

    // 실제 데이터 로드
    useEffect(() => {
        if (isAdmin) {
            loadData();
        }
    }, [isAdmin]);

    const loadData = async () => {
        setIsDataLoading(true);
        try {
            const [creatorsData, donationsData, settlementsData] = await Promise.all([
                getAllCreators(),
                getAllDonations(),
                getAllSettlements(),
            ]);

            setCreators(creatorsData);
            // 실제 데이터가 없으면 Mock 데이터 사용
            setDonations(donationsData.length > 0 ? donationsData : mockDonations);
            setSettlements(settlementsData);
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            // 오류 시 Mock 데이터 사용
            setDonations(mockDonations);
        } finally {
            setIsDataLoading(false);
        }
    };

    // 관리자 로그인 처리
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPw,
            });

            if (error) {
                setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else if (loginEmail !== ADMIN_EMAIL) {
                await supabase.auth.signOut();
                setLoginError('관리자 권한이 없습니다.');
            }
        } catch {
            setLoginError('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    // 로그아웃
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // 통계 계산 (실제 데이터 기반)
    const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalFee = Math.floor(totalDonationsAmount * FEE_RATE);
    const pendingSettlements = settlements.filter(s => s.status === 'pending').length;

    // 크리에이터별 후원 합계 계산
    const getCreatorStats = (creatorId: string) => {
        const creatorDonations = donations.filter(d => d.creatorId === creatorId);
        const totalAmount = creatorDonations.reduce((sum, d) => sum + d.amount, 0);
        return {
            totalAmount,
            fee: Math.floor(totalAmount * FEE_RATE),
        };
    };

    // 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
                <motion.div
                    className="text-4xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    🍩
                </motion.div>
            </div>
        );
    }

    // 로그인 필요 또는 관리자 아님
    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-6">
                    <motion.div
                        className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg border border-gray-100 relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* 테이프 장식 */}
                        <div className="absolute -top-2 left-8 w-16 h-3 bg-[#FFD95A]/80 rounded transform -rotate-2" />

                        <div className="text-center mb-8">
                            <span className="text-5xl mb-4 block">🔐</span>
                            <h1 className="text-2xl font-bold text-[#333]">관리자 로그인</h1>
                            <p className="text-[#666] mt-2 text-sm">도노트 관리 시스템</p>
                        </div>

                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#333] mb-2">이메일</label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                    placeholder="admin@admin.admin"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#333] mb-2">비밀번호</label>
                                <input
                                    type="password"
                                    value={loginPw}
                                    onChange={(e) => setLoginPw(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            {loginError && (
                                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{loginError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50"
                            >
                                {isLoggingIn ? '로그인 중...' : '관리자 로그인'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/" className="text-[#666] hover:text-[#333] text-sm transition-colors">
                                ← 홈으로 돌아가기
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // 관리자 대시보드
    return (
        <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
            <Header />

            <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
                {/* 페이지 헤더 */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#333]">🍩 관리자 대시보드</h1>
                        <p className="text-[#666] text-sm mt-1">도노트 관리 시스템 {isDataLoading && '(로딩 중...)'}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={loadData}
                            className="px-4 py-2 bg-[#FFD95A] text-[#333] rounded-lg hover:bg-[#FFCE3A] transition-colors"
                        >
                            🔄 새로고침
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-[#666] hover:text-[#333] transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>

                {/* 탭 네비게이션 - 포스트잇 스타일 */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'dashboard', label: '대시보드', icon: '📊' },
                        { id: 'revenue', label: '수익 현황', icon: '💰' },
                        { id: 'creators', label: '크리에이터', icon: '👥' },
                        { id: 'donations', label: '후원 내역', icon: '💌' },
                        { id: 'settlements', label: '정산 관리', icon: '🏦' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-[#FFD95A] text-[#333] shadow-md -mb-1'
                                    : 'bg-white text-[#666] hover:bg-gray-50'
                                }`}
                            style={{ transform: activeTab === tab.id ? 'rotate(-1deg)' : 'none' }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* 대시보드 탭 */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* 통계 카드 - 포스트잇 스타일 */}
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { label: '총 크리에이터', value: creators.length || '0', icon: '👥', color: 'bg-[#E6F3FF]' },
                                { label: '총 후원 건수', value: donations.length, icon: '💌', color: 'bg-[#FFE4E1]' },
                                { label: '총 거래액', value: `₩${totalDonationsAmount.toLocaleString()}`, icon: '💵', color: 'bg-[#E8F5E9]' },
                                { label: '총 수수료 수익', value: `₩${totalFee.toLocaleString()}`, icon: '🍩', color: 'bg-[#FFFACD]' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className={`${stat.color} rounded-xl p-6 shadow-sm border border-gray-100 relative`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1)}deg)` }}
                                >
                                    <div className="absolute -top-1 left-4 w-6 h-2 bg-[#FF6B6B]/50 rounded" />
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{stat.icon}</span>
                                    </div>
                                    <p className="text-[#666] text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold text-[#333]">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* 최근 활동 */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-[#333] mb-4">📮 최근 후원</h3>
                            <div className="space-y-3">
                                {donations.slice(0, 5).map((donation) => (
                                    <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{donation.sticker}</span>
                                            <div>
                                                <p className="text-[#333] font-medium">{donation.donorName}</p>
                                                <p className="text-[#666] text-sm truncate max-w-xs">{donation.message}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#FF6B6B] font-bold">₩{donation.amount.toLocaleString()}</p>
                                            <p className="text-[#999] text-xs">수수료: ₩{Math.floor(donation.amount * FEE_RATE).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {donations.length === 0 && (
                                    <p className="text-center text-[#666] py-8">아직 후원 내역이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 수익 현황 탭 */}
                {activeTab === 'revenue' && (
                    <div className="space-y-6">
                        {/* 수익 요약 */}
                        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-xl p-8 text-white shadow-lg">
                            <h2 className="text-xl font-bold mb-6">🍩 플랫폼 수익 현황</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/20 rounded-xl p-6 backdrop-blur">
                                    <p className="text-white/80 text-sm mb-1">총 거래액</p>
                                    <p className="text-3xl font-bold">₩{totalDonationsAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-6 backdrop-blur">
                                    <p className="text-white/80 text-sm mb-1">수수료 수익 (5%)</p>
                                    <p className="text-3xl font-bold">₩{totalFee.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-6 backdrop-blur">
                                    <p className="text-white/80 text-sm mb-1">대기 중 정산</p>
                                    <p className="text-3xl font-bold">{pendingSettlements}건</p>
                                </div>
                            </div>
                        </div>

                        {/* 크리에이터별 수익 */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-[#333] mb-4">👥 크리에이터별 수수료 현황</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left text-[#666] font-medium px-4 py-3">크리에이터</th>
                                            <th className="text-right text-[#666] font-medium px-4 py-3">총 후원</th>
                                            <th className="text-right text-[#666] font-medium px-4 py-3">수수료 (5%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creators.map((creator) => {
                                            const stats = getCreatorStats(creator.id);
                                            return (
                                                <tr key={creator.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <p className="font-medium text-[#333]">{creator.displayName}</p>
                                                        <p className="text-sm text-[#666]">@{creator.handle}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-medium text-[#333]">
                                                        ₩{stats.totalAmount.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-bold text-[#FF6B6B]">
                                                        ₩{stats.fee.toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {creators.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="text-center py-8 text-[#666]">
                                                    등록된 크리에이터가 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 크리에이터 탭 */}
                {activeTab === 'creators' && (
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">크리에이터</th>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">핸들</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">총 후원</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">가입일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creators.map((creator) => {
                                    const stats = getCreatorStats(creator.id);
                                    return (
                                        <tr key={creator.id} className="border-t border-gray-100 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{creator.avatar}</span>
                                                    <span className="font-medium text-[#333]">{creator.displayName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#666]">@{creator.handle}</td>
                                            <td className="px-6 py-4 text-right text-[#FF6B6B] font-bold">
                                                ₩{stats.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-[#999]">
                                                {new Date(creator.createdAt).toLocaleDateString('ko-KR')}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {creators.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-[#666]">
                                            등록된 크리에이터가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 후원 내역 탭 */}
                {activeTab === 'donations' && (
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">후원자</th>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">메시지</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">금액</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">수수료</th>
                                    <th className="text-center text-[#666] font-medium px-6 py-4">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((donation) => (
                                    <tr key={donation.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span>{donation.sticker}</span>
                                                <span className="text-[#333]">{donation.donorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#666] max-w-xs truncate">{donation.message}</td>
                                        <td className="px-6 py-4 text-right text-[#333] font-medium">₩{donation.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-[#FF6B6B] font-bold">₩{Math.floor(donation.amount * FEE_RATE).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${donation.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {donation.status === 'paid' ? '완료' : '대기'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 정산 관리 탭 */}
                {activeTab === 'settlements' && (
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left text-[#666] font-medium px-6 py-4">크리에이터</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">총액</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">수수료 (5%)</th>
                                    <th className="text-right text-[#666] font-medium px-6 py-4">정산액</th>
                                    <th className="text-center text-[#666] font-medium px-6 py-4">상태</th>
                                    <th className="text-center text-[#666] font-medium px-6 py-4">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settlements.map((settlement) => (
                                    <tr key={settlement.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-[#333]">{settlement.creatorId}</td>
                                        <td className="px-6 py-4 text-right text-[#333]">₩{settlement.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-[#FF6B6B]">-₩{Math.floor(settlement.amount * FEE_RATE).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-[#333] font-bold">₩{settlement.netAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${settlement.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {settlement.status === 'completed' ? '완료' : '대기'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {settlement.status === 'pending' && (
                                                <button className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg text-sm font-medium hover:bg-[#FF5252] transition-colors">
                                                    승인
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {settlements.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-[#666]">
                                            정산 요청이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
