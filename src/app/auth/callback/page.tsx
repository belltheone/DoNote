"use client";
// OAuth 콜백 처리 페이지
// 프로필 체크 후 온보딩 또는 대시보드로 리디렉션

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // URL에서 코드 추출하여 세션 교환
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                console.error("Auth callback error:", error);
                router.push("/auth?error=callback_failed");
                return;
            }

            // 관리자 체크
            const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';
            if (session.user.email === ADMIN_EMAIL) {
                router.push("/admin");
                return;
            }

            // 크리에이터 프로필이 있는지 확인
            const { data: profile } = await supabase
                .from('creators')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            if (profile) {
                // 프로필이 있으면 대시보드로
                router.push("/dashboard");
            } else {
                // 프로필이 없으면 온보딩으로
                router.push("/onboarding");
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">🍩</div>
                <p className="text-[#666]">로그인 처리 중...</p>
            </div>
        </div>
    );
}
