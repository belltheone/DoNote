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
    { href: "/dashboard/widget", label: "위젯 생성", icon: "🎫" },
    { href: "/dashboard/settings", label: "설정", icon: "⚙️" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // 사용자 정보 가져오기
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            // 로그인 안 된 경우 Mock 사용자 설정 (개발용)
            setUser({
                id: 'mock-user-123',
                email: 'demo@donote.kr',
                displayName: '개발하는 민수',
                avatar: '👨‍💻',
                handle: 'devminsu',
                bio: '프론트엔드 개발자',
                createdAt: new Date().toISOString(),
            });
        } else {
            setUser(currentUser);
        }
    }, []);

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
        <div className="min-h-screen bg-[#F9F9F9] flex">
            {/* 사이드바 */}
            <motion.aside
                className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-40 ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
                {/* 로고 */}
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="text-2xl">🍩</span>
                        {sidebarOpen && <span className="text-xl font-bold text-[#333]">도노트</span>}
                    </Link>
                </div>

                {/* 네비게이션 */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href, item.exact)
                                    ? 'bg-[#FFFACD] text-[#333] font-medium'
                                    : 'text-[#666] hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* 사이드바 하단 - 사용자 정보 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    {user && (
                        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
                            <div className="w-10 h-10 rounded-full bg-[#FFFACD] flex items-center justify-center text-xl">
                                {user.avatar}
                            </div>
                            {sidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[#333] truncate">{user.displayName}</p>
                                    <p className="text-xs text-[#999] truncate">@{user.handle}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* 메인 컨텐츠 영역 */}
            <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* 헤더 */}
                <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* 사이드바 토글 */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <span className="text-xl">{sidebarOpen ? '◀️' : '▶️'}</span>
                            </button>

                            {/* 페이지 타이틀 */}
                            <h1 className="text-xl font-bold text-[#333]">
                                {navItems.find(item => isActive(item.href, item.exact))?.label || '대시보드'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* 내 페이지 보기 */}
                            <Link
                                href={`/${user?.handle || 'demo'}`}
                                className="px-4 py-2 text-[#666] hover:text-[#333] transition-colors flex items-center gap-2"
                            >
                                <span>👁️</span>
                                <span className="hidden sm:inline">내 페이지 보기</span>
                            </Link>

                            {/* 로그아웃 */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-[#999] hover:text-[#FF6B6B] transition-colors"
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
