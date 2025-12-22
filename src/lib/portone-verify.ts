// 포트원 V2 계좌 예금주 조회 API
// 서버사이드에서 호출

// 은행 코드 매핑 (한글 → PortOne 코드)
export const BANK_CODES: Record<string, string> = {
    "KB국민은행": "BANK_OF_KOREA",
    "국민은행": "BANK_OF_KOREA",
    "신한은행": "BANK_SHINHAN",
    "우리은행": "BANK_WOORI",
    "하나은행": "BANK_HANA",
    "농협은행": "BANK_NONGHYUP",
    "농협": "BANK_NONGHYUP",
    "기업은행": "BANK_IBK",
    "IBK기업은행": "BANK_IBK",
    "SC제일은행": "BANK_SC",
    "씨티은행": "BANK_CITI",
    "카카오뱅크": "BANK_KAKAO",
    "케이뱅크": "BANK_KBANK",
    "토스뱅크": "BANK_TOSS",
    "새마을금고": "BANK_SAEMAUL",
    "우체국": "BANK_POST",
    "신협": "BANK_SHINHYUP",
    "수협": "BANK_SUHYUP",
    "부산은행": "BANK_BUSAN",
    "대구은행": "BANK_DAEGU",
    "광주은행": "BANK_KWANGJU",
    "전북은행": "BANK_JEONBUK",
    "제주은행": "BANK_JEJU",
    "경남은행": "BANK_KYONGNAM",
};

// 은행 목록 (드롭다운용)
export const BANK_LIST = [
    "KB국민은행",
    "신한은행",
    "우리은행",
    "하나은행",
    "농협은행",
    "기업은행",
    "SC제일은행",
    "카카오뱅크",
    "케이뱅크",
    "토스뱅크",
    "새마을금고",
    "우체국",
    "신협",
    "수협",
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
