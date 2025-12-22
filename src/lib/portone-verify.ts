// 포트원 V2 계좌 예금주 조회 API
// 서버사이드에서 호출

// 은행 코드 매핑 (한글 → 포트원 V2 Bank enum)
// GET /banks API 응답 기반
export const BANK_CODES: Record<string, string> = {
    // 주요 시중은행
    "KB국민은행": "KOOKMIN",
    "국민은행": "KOOKMIN",
    "신한은행": "SHINHAN",
    "우리은행": "WOORI",
    "하나은행": "HANA",
    "농협은행": "NONGHYUP",
    "NH농협은행": "NONGHYUP",
    "농협": "NONGHYUP",

    // 인터넷전문은행
    "카카오뱅크": "KAKAO",
    "케이뱅크": "K_BANK",
    "토스뱅크": "TOSS",

    // 특수은행/기타
    "기업은행": "IBK",
    "IBK기업은행": "IBK",
    "SC제일은행": "STANDARD_CHARTERED",
    "씨티은행": "CITI",
    "한국씨티은행": "CITI",
    "수협은행": "SUHYUP",
    "산업은행": "KDB",
    "KDB산업은행": "KDB",

    // 지방은행
    "부산은행": "BUSAN",
    "대구은행": "DAEGU",
    "아이엠뱅크": "DAEGU",
    "광주은행": "KWANGJU",
    "전북은행": "JEONBUK",
    "제주은행": "JEJU",
    "경남은행": "KYONGNAM",

    // 기타 금융기관
    "새마을금고": "KFCC",
    "우체국": "POST",
    "신협": "SHINHYUP",
    "저축은행": "SAVINGS_BANK",
    "지역농축협": "LOCAL_NONGHYUP",
};

// 은행 목록 (드롭다운용)
export const BANK_LIST = [
    "카카오뱅크",
    "토스뱅크",
    "케이뱅크",
    "KB국민은행",
    "신한은행",
    "우리은행",
    "하나은행",
    "NH농협은행",
    "IBK기업은행",
    "SC제일은행",
    "새마을금고",
    "우체국",
    "신협",
    "수협은행",
    "부산은행",
    "대구은행",
    "광주은행",
    "전북은행",
    "제주은행",
    "경남은행",
];

// 예금주 조회 응답 타입
export interface AccountHolderResponse {
    success: boolean;
    holderName?: string;
    message?: string;
}

// 클라이언트에서 호출하는 함수 (API 라우트 경유)
export async function verifyAccountHolder(
    bankName: string,
    accountNumber: string,
    birthdate?: string
): Promise<AccountHolderResponse> {
    try {
        const response = await fetch("/api/verify-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bankName,
                accountNumber: accountNumber.replace(/-/g, ""),
                birthdate,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("계좌 인증 API 호출 오류:", error);
        return {
            success: false,
            message: "계좌 인증 중 오류가 발생했습니다.",
        };
    }
}
