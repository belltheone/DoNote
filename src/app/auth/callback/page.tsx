"use client";
// OAuth 콜백 처리 페이지

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // URL에서 코드 추출하여 세션 교환
        const handleCallback = async () => {
            const { error } = await supabase.auth.getSession();

            if (error) {
                console.error("Auth callback error:", error);
                router.push("/auth?error=callback_failed");
            } else {
                router.push("/dashboard");
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
