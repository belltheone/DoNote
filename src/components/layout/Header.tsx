"use client";
// 공통 헤더 컴포넌트
// 로그인 상태에 따라 다르게 표시 + 다크 모드 지원 + 모바일 햄버거 메뉴

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Header() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 관리자 이메일 체크
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';
    const isAdmin = user?.email === ADMIN_EMAIL;

    // 로그아웃 처리
    const handleSignOut = async () => {
        await signOut();
        router.refresh(); // 페이지 상태 새로고침
        router.push('/');
    };

    return (
        <motion.header
            className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center relative">
                    {/* 로고 */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image
                                src="/logo-140.png"
                                alt="도노트 로고"
                                width={36}
                                height={36}
                                className="rounded-lg"
                                priority
                            />
                        </motion.div>
                        <span className="text-xl font-bold text-[#333] dark:text-white group-hover:text-[#FF6B6B] transition-colors">
                            도노트
                        </span>
                    </Link>

                    {/* 네비게이션 - 중앙 정렬 */}
                    <nav className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
                        <Link href="/about" className="px-3 py-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm text-center whitespace-nowrap">
                            서비스 소개
                        </Link>
                        <Link href="/widget" className="px-3 py-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm text-center whitespace-nowrap">
                            위젯
                        </Link>
                        <Link href="/guide" className="px-3 py-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm text-center whitespace-nowrap">
                            시작가이드
                        </Link>
                        <Link href="/faq" className="px-3 py-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm text-center whitespace-nowrap">
                            FAQ
                        </Link>
                        <Link href="/blog" className="px-3 py-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm text-center whitespace-nowrap">
                            블로그
                        </Link>
                        <Link href="/notice" className="px-3 py-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm text-center whitespace-nowrap">
                            공지
                        </Link>
                    </nav>

                    {/* 우측 메뉴 */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* 모바일 햄버거 버튼 */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-[#666] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="메뉴 열기"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>

                        {/* 다크 모드 토글 */}
                        <ThemeToggle />

                        {isLoading ? (
                            // 로딩 중
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        ) : user ? (
                            // 로그인 상태
                            <>
                                {/* 관리자 전용 버튼 */}
                                {isAdmin && (
                                    <Link href="/admin">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white"
                                        >
                                            🔐 관리자
                                        </Button>
                                    </Link>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-9 w-9 border-2 border-[#FFD95A]">
                                                <AvatarImage
                                                    src={user.user_metadata?.avatar_url}
                                                    alt={user.user_metadata?.full_name || '사용자'}
                                                />
                                                <AvatarFallback className="bg-[#FFD95A] text-[#333] font-bold">
                                                    {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="flex items-center gap-3 p-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.user_metadata?.avatar_url} />
                                                <AvatarFallback className="bg-[#FFD95A]">
                                                    {(user.user_metadata?.full_name || 'U').charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {user.user_metadata?.full_name || '사용자'}
                                                </span>
                                                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        {/* 관리자 전용 메뉴 */}
                                        {isAdmin && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin" className="cursor-pointer text-[#FF6B6B]">
                                                        🔐 관리자 대시보드
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer">
                                                📊 대시보드
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/settings" className="cursor-pointer">
                                                ⚙️ 설정
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleSignOut}
                                            className="text-red-500 cursor-pointer"
                                        >
                                            🚪 로그아웃
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            // 비로그인 상태
                            <>
                                <Link href="/auth">
                                    <Button
                                        variant="ghost"
                                        className="text-[#666] hover:text-[#333]"
                                    >
                                        로그인
                                    </Button>
                                </Link>
                                <Link href="/auth">
                                    <Button
                                        className="bg-[#FFD95A] text-[#333] hover:bg-[#FFCE3A] font-semibold"
                                    >
                                        시작하기
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 모바일 메뉴 패널 */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                        <div className="px-6 py-4 space-y-1">
                            <Link
                                href="/about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                서비스 소개
                            </Link>
                            <Link
                                href="/widget"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                위젯
                            </Link>
                            <Link
                                href="/guide"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                시작가이드
                            </Link>
                            <Link
                                href="/faq"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                FAQ
                            </Link>
                            <Link
                                href="/blog"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                블로그
                            </Link>
                            <Link
                                href="/notice"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                공지
                            </Link>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
