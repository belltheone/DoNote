// 추천인 시스템 유틸리티
// 레퍼럴 코드 생성 및 검증

import { supabase } from "./supabase";

// 레퍼럴 코드 생성 (8자리 영숫자)
export function generateReferralCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 혼동 가능한 문자 제외
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// 레퍼럴 코드 저장
export async function saveReferralCode(
    creatorId: string,
    code: string
): Promise<boolean> {
    const { error } = await supabase
        .from("creators")
        .update({ referral_code: code })
        .eq("id", creatorId);

    return !error;
}

// 레퍼럴 코드로 크리에이터 찾기
export async function findCreatorByReferralCode(
    code: string
): Promise<{ id: string; displayName: string } | null> {
    const { data, error } = await supabase
        .from("creators")
        .select("id, display_name")
        .eq("referral_code", code)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        displayName: data.display_name,
    };
}

// 추천인 보상 기록
export async function recordReferralReward(
    referrerId: string,
    referredId: string,
    rewardAmount: number
): Promise<boolean> {
    const { error } = await supabase.from("referral_rewards").insert({
        referrer_id: referrerId,
        referred_id: referredId,
        reward_amount: rewardAmount,
        status: "pending",
    });

    return !error;
}

// 내 추천 현황 조회
export async function getMyReferralStats(
    creatorId: string
): Promise<{
    totalReferred: number;
    totalRewards: number;
    pendingRewards: number;
}> {
    const { data, error } = await supabase
        .from("referral_rewards")
        .select("reward_amount, status")
        .eq("referrer_id", creatorId);

    if (error || !data) {
        return { totalReferred: 0, totalRewards: 0, pendingRewards: 0 };
    }

    const totalReferred = data.length;
    const totalRewards = data
        .filter((r) => r.status === "completed")
        .reduce((sum, r) => sum + r.reward_amount, 0);
    const pendingRewards = data
        .filter((r) => r.status === "pending")
        .reduce((sum, r) => sum + r.reward_amount, 0);

    return { totalReferred, totalRewards, pendingRewards };
}

// 레퍼럴 링크 생성
export function generateReferralLink(code: string): string {
    const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "https://donote.site";
    return `${baseUrl}/?ref=${code}`;
}
