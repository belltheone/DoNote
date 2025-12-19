// 동적 OG 이미지 생성
// 크리에이터 페이지용 소셜 미리보기 이미지

import { ImageResponse } from 'next/og';

// 이미지 크기 설정
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// OG 이미지 생성 함수
export default async function OGImage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params;

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD95A 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* 배경 패턴 */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }}
                />

                {/* 카드 */}
                <div
                    style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '60px 80px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '900px',
                    }}
                >
                    {/* 도노트 로고 */}
                    <div
                        style={{
                            fontSize: '80px',
                            marginBottom: '20px',
                        }}
                    >
                        🍩
                    </div>

                    {/* 크리에이터 이름 */}
                    <div
                        style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '12px',
                        }}
                    >
                        @{username}
                    </div>

                    {/* 설명 */}
                    <div
                        style={{
                            fontSize: '28px',
                            color: '#666',
                            marginBottom: '30px',
                        }}
                    >
                        님에게 후원하기
                    </div>

                    {/* CTA 버튼 스타일 */}
                    <div
                        style={{
                            background: '#FF6B6B',
                            borderRadius: '16px',
                            padding: '16px 40px',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                        }}
                    >
                        💌 쪽지 보내기
                    </div>
                </div>

                {/* 하단 브랜딩 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '24px',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 'bold',
                    }}
                >
                    donote.site
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
