// 포트원 V2 계좌 예금주 조회 API 라우트
// 서버사이드에서 API Secret 보호

import { NextRequest, NextResponse } from "next/server";
import { BANK_CODES } from "@/lib/portone-verify";

const PORTONE_V2_API_SECRET = process.env.PORTONE_V2_API_SECRET || "";

export async function POST(request: NextRequest) {
    try {
        const { bankName, accountNumber, birthdate } = await request.json();

        // 유효성 검사
        if (!bankName || !accountNumber) {
            return NextResponse.json(
                { success: false, message: "은행명과 계좌번호를 입력해주세요." },
                { status: 400 }
            );
        }

        // 은행 코드 변환
        const bankCode = BANK_CODES[bankName];
        if (!bankCode) {
            return NextResponse.json(
                { success: false, message: "지원하지 않는 은행입니다." },
                { status: 400 }
            );
        }

        // 포트원 V2 API 호출
        const url = `https://api.portone.io/platform/bank-accounts/${bankCode}/${accountNumber}/holder`;
        const params = new URLSearchParams();

        if (birthdate) {
            params.append("birthdate", birthdate);
        }

        const response = await fetch(`${url}?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `PortOne ${PORTONE_V2_API_SECRET}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("포트원 API 오류:", data);

            // 에러 유형별 메시지
            if (data.type === "INVALID_REQUEST") {
                return NextResponse.json(
                    { success: false, message: "계좌 정보가 올바르지 않습니다." },
                    { status: 400 }
                );
            }
            if (data.type === "PLATFORM_NOT_SUPPORTED_BANK") {
                return NextResponse.json(
                    { success: false, message: "지원하지 않는 은행입니다." },
                    { status: 400 }
                );
            }
            if (data.type === "UNAUTHORIZED") {
                return NextResponse.json(
                    { success: false, message: "API 인증에 실패했습니다." },
                    { status: 401 }
                );
            }

            return NextResponse.json(
                { success: false, message: "계좌 조회에 실패했습니다." },
                { status: response.status }
            );
        }

        // 성공 응답
        return NextResponse.json({
            success: true,
            holderName: data.holderName,
        });

    } catch (error) {
        console.error("계좌 인증 API 오류:", error);
        return NextResponse.json(
            { success: false, message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
