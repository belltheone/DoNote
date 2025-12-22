// 포트원 V2 계좌 예금주 조회 API
// 서버사이드에서 호출

// 은행 코드 매핑 (한글 → 금융결제원 표준 3자리 코드)
export const BANK_CODES: Record<string, string> = {
    "KB국민은행": "004",
    "국민은행": "004",
    "신한은행": "088",
    "우리은행": "020",
    "하나은행": "081",
    "농협은행": "011",
    "NH농협은행": "011",
    "농협": "011",
    "기업은행": "003",
    "IBK기업은행": "003",
    "SC제일은행": "023",
    "씨티은행": "027",
    "카카오뱅크": "090",
    "케이뱅크": "089",
    "토스뱅크": "092",
    "새마을금고": "045",
    "우체국": "071",
    "신협": "048",
    "수협": "007",
    "부산은행": "032",
    "대구은행": "031",
    "광주은행": "034",
    "전북은행": "037",
    "제주은행": "035",
    "경남은행": "039",
    "산업은행": "002",
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
    "농협은행",
    "기업은행",
    "SC제일은행",
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
