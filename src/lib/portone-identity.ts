// 포트원 V2 본인인증 클라이언트 함수
// 브라우저에서 호출하여 본인인증 팝업 실행

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortOneSDK = any;

// 포트원 SDK 동적 로드 (이미 로드된 경우 스킵)
export async function loadPortOneSDK(): Promise<PortOneSDK> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).PortOne) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (window as any).PortOne;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.portone.io/v2/browser-sdk.js';
        script.async = true;
        script.onload = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((window as any).PortOne) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                resolve((window as any).PortOne);
            } else {
                reject(new Error('PortOne SDK 로드 실패'));
            }
        };
        script.onerror = () => reject(new Error('PortOne SDK 스크립트 로드 실패'));
        document.head.appendChild(script);
    });
}

// 본인인증 요청 결과 타입
export interface IdentityVerificationResult {
    success: boolean;
    identityVerificationId?: string;
    name?: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: string;
    ci?: string;
    message?: string;
}

// 클라이언트에서 본인인증 요청
export async function requestIdentityVerification(): Promise<IdentityVerificationResult> {
    try {
        const PortOne = await loadPortOneSDK();

        // SDK 로드 확인
        if (!PortOne) {
            return {
                success: false,
                message: 'PortOne SDK를 로드할 수 없습니다.',
            };
        }

        // 고유 ID 생성
        const identityVerificationId = `identity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // 포트원 SDK 호출
        const response = await PortOne.requestIdentityVerification({
            storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
            identityVerificationId,
            channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        });

        // 응답 확인
        if (!response) {
            return {
                success: false,
                message: '본인인증 응답이 없습니다.',
            };
        }

        // 에러 체크
        if (response.code !== undefined) {
            return {
                success: false,
                message: response.message || '본인인증이 취소되었습니다.',
            };
        }

        // 서버에서 인증 결과 조회
        const verifyResult = await fetch('/api/identity/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identityVerificationId }),
        });

        const data = await verifyResult.json();

        if (!verifyResult.ok || !data.success) {
            return {
                success: false,
                message: data.message || '본인인증 확인에 실패했습니다.',
            };
        }

        return {
            success: true,
            identityVerificationId,
            name: data.name,
            phoneNumber: data.phoneNumber,
            birthDate: data.birthDate,
            gender: data.gender,
            ci: data.ci,
        };

    } catch (error) {
        console.error('본인인증 오류:', error);
        return {
            success: false,
            message: '본인인증 중 오류가 발생했습니다.',
        };
    }
}
