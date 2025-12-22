// 포트원 V2 본인인증 결과 조회 API
// 서버사이드에서 인증 결과를 조회하고 사용자 정보 반환

import { NextRequest, NextResponse } from "next/server";

const PORTONE_V2_API_SECRET = process.env.PORTONE_V2_API_SECRET || "";

export async function POST(request: NextRequest) {
    try {
        const { identityVerificationId } = await request.json();

        if (!identityVerificationId) {
            return NextResponse.json(
                { success: false, message: "인증 ID가 필요합니다." },
                { status: 400 }
            );
        }

        // 포트원 V2 본인인증 결과 조회 API 호출
        const verificationResponse = await fetch(
            `https://api.portone.io/identity-verifications/${encodeURIComponent(identityVerificationId)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `PortOne ${PORTONE_V2_API_SECRET}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await verificationResponse.json();

        if (!verificationResponse.ok) {
            console.error("포트원 본인인증 조회 오류:", data);
            return NextResponse.json(
                { success: false, message: "본인인증 조회에 실패했습니다." },
                { status: verificationResponse.status }
            );
        }

        // 인증 상태 확인
        if (data.status !== "VERIFIED") {
            return NextResponse.json(
                { success: false, message: "본인인증이 완료되지 않았습니다." },
                { status: 400 }
            );
        }

        // 인증된 고객 정보 추출
        const customer = data.verifiedCustomer;

        return NextResponse.json({
            success: true,
            name: customer?.name,
            phoneNumber: customer?.phoneNumber,
            birthDate: customer?.birthDate,
            gender: customer?.gender,
            ci: customer?.ci,
            di: customer?.di,
        });

    } catch (error) {
        console.error("본인인증 API 오류:", error);
        return NextResponse.json(
            { success: false, message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
