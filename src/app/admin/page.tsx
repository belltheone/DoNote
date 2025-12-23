"use client";
// 관리자 페이지 - 전체 기능 통합
// 10개 탭: 대시보드, 회원, 후원, 팁/수수료, 정산, 콘텐츠, 설정, 분석, 시스템, 수익

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
    type CreatorProfile,
    type Donation
} from "@/lib/supabase";
import { Header } from "@/components/layout/Header";

// 탭 컴포넌트 import
import { DashboardTab } from "./components/DashboardTab";
import { MembersTab } from "./components/MembersTab";
import { DonationsTab } from "./components/DonationsTab";
import { TipsTab } from "./components/TipsTab";
import { SettlementsTab } from "./components/SettlementsTab";
import { ContentTab } from "./components/ContentTab";
import { SettingsTab } from "./components/SettingsTab";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { SystemTab } from "./components/SystemTab";
import { RevenueTab } from "./components/RevenueTab";
import { NotificationsTab } from "./components/NotificationsTab";

// 관리자 이메일
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';

// 정산 타입
interface Settlement {
    id: string;
    creatorId: string;
    amount: number;
    netAmount: number;
    status: 'pending' | 'completed' | 'rejected';
    requestedAt: string;
    completedAt?: string;
}

// 탭 타입
type TabId = 'dashboard' | 'members' | 'donations' | 'tips' | 'settlements' | 'content' | 'settings' | 'analytics' | 'system' | 'revenue' | 'notifications';

// 탭 설정
const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'members', label: '회원 관리', icon: '👥' },
    { id: 'donations', label: '후원 내역', icon: '💌' },
    { id: 'tips', label: '팁/수수료', icon: '🍩' },
    { id: 'settlements', label: '정산 관리', icon: '🏦' },
    { id: 'content', label: '콘텐츠', icon: '📝' },
    { id: 'settings', label: '설정', icon: '⚙️' },
    { id: 'analytics', label: '분석', icon: '📈' },
    { id: 'system', label: '시스템', icon: '🖥️' },
    { id: 'revenue', label: '수익', icon: '💰' },
    { id: 'notifications', label: '알림', icon: '🔔' },
];

export default function AdminPage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabId>('dashboard');
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

            // 데모 크리에이터 핸들 (통계에서 제외)
            const DEMO_HANDLES = ['devminsu', 'demo'];

            // 데모 크리에이터 ID 찾기
            const demoCreatorIds = creatorsData
                .filter(c => DEMO_HANDLES.includes(c.handle.toLowerCase()))
                .map(c => c.id);

            // 실제 크리에이터만 (데모 제외)
            const realCreators = creatorsData.filter(c => !DEMO_HANDLES.includes(c.handle.toLowerCase()));

            // 데모 크리에이터의 후원은 통계에서 제외
            const realDonations = donationsData.filter(d => !demoCreatorIds.includes(d.creatorId));

            setCreators(realCreators);
            setDonations(realDonations);
            setSettlements(settlementsData as Settlement[]);
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            // 오류 시 빈 배열 사용
            setDonations([]);
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

                {/* 탭 네비게이션 - 2줄 그리드 */}
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-[#FFD95A] text-[#333] shadow-md'
                                : 'bg-white text-[#666] hover:bg-gray-100 border border-gray-100'
                                }`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            <span className="text-xs font-medium whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* 탭 콘텐츠 */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && (
                        <DashboardTab
                            creators={creators}
                            donations={donations}
                            settlements={settlements}
                            isLoading={isDataLoading}
                        />
                    )}
                    {activeTab === 'members' && (
                        <MembersTab creators={creators} donations={donations} />
                    )}
                    {activeTab === 'donations' && (
                        <DonationsTab creators={creators} donations={donations} />
                    )}
                    {activeTab === 'tips' && (
                        <TipsTab creators={creators} donations={donations} />
                    )}
                    {activeTab === 'settlements' && (
                        <SettlementsTab
                            creators={creators}
                            settlements={settlements}
                            onRefresh={loadData}
                        />
                    )}
                    {activeTab === 'content' && <ContentTab />}
                    {activeTab === 'settings' && <SettingsTab />}
                    {activeTab === 'analytics' && (
                        <AnalyticsTab creators={creators} donations={donations} />
                    )}
                    {activeTab === 'system' && <SystemTab />}
                    {activeTab === 'revenue' && (
                        <RevenueTab creators={creators} donations={donations} />
                    )}
                    {activeTab === 'notifications' && (
                        <NotificationsTab supabaseClient={supabase} />
                    )}
                </motion.div>
            </div>
        </div>
    );
}
