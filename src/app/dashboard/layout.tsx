"use client";
// 대시보드 레이아웃 - 사이드바 + 헤더

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut, type User } from "@/lib/supabase";

// 네비게이션 메뉴 항목
const navItems = [
    { href: "/dashboard", label: "홈", icon: "🏠", exact: true },
    { href: "/dashboard/messages", label: "메시지 월", icon: "📌" },
    { href: "/dashboard/analytics", label: "분석", icon: "📊" },
    { href: "/dashboard/settlement", label: "수확하기", icon: "🍯" },
    { href: "/dashboard/widget", label: "위젯 생성", icon: "🎫" },
    { href: "/dashboard/settings", label: "설정", icon: "⚙️" },
];

// 관리자 이메일
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // 사용자 정보 가져오기 및 관리자 리디렉션
    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();

            // 관리자인 경우 관리자 대시보드로 리디렉션
            if (currentUser?.email === ADMIN_EMAIL) {
                router.replace('/admin');
                return;
            }

            if (!currentUser) {
                // 로그인 안 된 경우 로그인 페이지로 리디렉션
                router.replace('/auth');
                return;
            } else {
                // Supabase User를 우리 User 타입으로 변환
                setUser({
                    id: currentUser.id,
                    email: currentUser.email || '',
                    displayName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '사용자',
                    avatar: currentUser.user_metadata?.avatar_url || '👨‍💻',
                    handle: currentUser.user_metadata?.handle || currentUser.email?.split('@')[0] || 'user',
                    bio: '',
                    createdAt: currentUser.created_at,
                });
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [router]);

    // 로그아웃 처리
    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    // 현재 페이지 확인
    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex">
            {/* 사이드바 */}
            <motion.aside
                className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 z-40 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
                {/* 로고 */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="text-2xl">🍩</span>
                        {sidebarOpen && <span className="text-xl font-bold text-[#333] dark:text-white">도노트</span>}
                    </Link>
                </div>

                {/* 네비게이션 */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href, item.exact)
                                ? 'bg-[#FFFACD] dark:bg-yellow-900/50 text-[#333] dark:text-white font-medium'
                                : 'text-[#666] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* 사이드바 하단 - 사용자 정보 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-700">
                    {user && (
                        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
                            <div className="w-10 h-10 rounded-full bg-[#FFFACD] dark:bg-yellow-900/50 flex items-center justify-center text-xl">
                                {user.avatar}
                            </div>
                            {sidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[#333] dark:text-white truncate">{user.displayName}</p>
                                    <p className="text-xs text-[#999] dark:text-gray-500 truncate">@{user.handle}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* 메인 컨텐츠 영역 */}
            <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* 헤더 */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* 사이드바 토글 */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="text-xl">{sidebarOpen ? '◀️' : '▶️'}</span>
                            </button>

                            {/* 페이지 타이틀 */}
                            <h1 className="text-xl font-bold text-[#333] dark:text-white">
                                {navItems.find(item => isActive(item.href, item.exact))?.label || '대시보드'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* 내 페이지 보기 */}
                            <Link
                                href={`/${user?.handle || 'demo'}`}
                                className="px-4 py-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white transition-colors flex items-center gap-2"
                            >
                                <span className="hidden sm:inline">내 페이지 보기</span>
                                <span className="sm:hidden">페이지</span>
                            </Link>

                            {/* 로그아웃 */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-[#999] dark:text-gray-500 hover:text-[#FF6B6B] transition-colors"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </header>

                {/* 페이지 컨텐츠 */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
