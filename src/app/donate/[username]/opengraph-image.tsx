// 동적 OG 이미지 생성
// 크리에이터 페이지용 소셜 미리보기 이미지

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 이미지 크기 설정  
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// OG 이미지 생성 함수
export default async function OGImage(props: {
    params: Promise<{ username: string }>
}) {
    const { username } = await props.params;

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
                {/* 메인 카드 */}
                <div
                    style={{
                        background: 'white',
                        borderRadius: '32px',
                        padding: '60px 100px',
                        boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* 로고 */}
                    <div
                        style={{
                            fontSize: '100px',
                            marginBottom: '20px',
                        }}
                    >
                        🍩
                    </div>

                    {/* 크리에이터 이름 */}
                    <div
                        style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '16px',
                        }}
                    >
                        @{username}
                    </div>

                    {/* 설명 */}
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#666',
                        }}
                    >
                        님에게 후원하기
                    </div>
                </div>

                {/* CTA 버튼 */}
                <div
                    style={{
                        marginTop: '50px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '16px',
                        padding: '16px 40px',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                    }}
                >
                    💌 쪽지 보내기
                </div>

                {/* 브랜딩 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '28px',
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
