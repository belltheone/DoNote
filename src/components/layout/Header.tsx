"use client";
// 공통 헤더 컴포넌트
// 로그인 상태에 따라 다르게 표시

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

export function Header() {
    const router = useRouter();
    const { user, isLoading, signOut } = useAuthStore();

    // 관리자 이메일 체크
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';
    const isAdmin = user?.email === ADMIN_EMAIL;

    // 로그아웃 처리
    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <motion.header
            className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* 로고 */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.span
                            className="text-2xl"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            🍩
                        </motion.span>
                        <span className="text-xl font-bold text-[#333] group-hover:text-[#FF6B6B] transition-colors">
                            도노트
                        </span>
                    </Link>

                    {/* 네비게이션 */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/about" className="text-[#666] hover:text-[#333] transition-colors text-sm">
                            서비스 소개
                        </Link>
                        <Link href="/widget" className="text-[#666] hover:text-[#333] transition-colors text-sm">
                            위젯 데모
                        </Link>
                    </nav>

                    {/* 우측 메뉴 */}
                    <div className="flex items-center gap-3">
                        {isLoading ? (
                            // 로딩 중
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
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
        </motion.header>
    );
}
