// GA4 Analytics API Route
// 관리자 대시보드에서 방문자 통계를 가져오는 API

import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// 동적 라우트로 설정 (빌드 시 실행 방지)
export const dynamic = 'force-dynamic';

// GA4 Property ID
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;

// 서비스 계정 인증 정보
function getCredentials() {
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJson) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON 환경변수가 설정되지 않았습니다.');
    }
    return JSON.parse(credentialsJson);
}

export async function GET() {
    try {
        // 환경변수 확인
        if (!GA4_PROPERTY_ID) {
            return NextResponse.json({
                error: 'GA4_PROPERTY_ID가 설정되지 않았습니다.',
                data: null
            }, { status: 500 });
        }

        // 인증 정보 파싱
        const credentials = getCredentials();

        // GA4 클라이언트 초기화
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
        });

        // 오늘 날짜 계산
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // 7일 전
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];

        // 30일 전
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        const monthAgoStr = monthAgo.toISOString().split('T')[0];

        // 1. 오늘 방문자 수
        const [todayResponse] = await analyticsDataClient.runReport({
            property: GA4_PROPERTY_ID,
            dateRanges: [{ startDate: todayStr, endDate: todayStr }],
            metrics: [{ name: 'activeUsers' }],
        });

        // 2. 주간 방문자 수
        const [weekResponse] = await analyticsDataClient.runReport({
            property: GA4_PROPERTY_ID,
            dateRanges: [{ startDate: weekAgoStr, endDate: todayStr }],
            metrics: [{ name: 'activeUsers' }],
        });

        // 3. 월간 방문자 수
        const [monthResponse] = await analyticsDataClient.runReport({
            property: GA4_PROPERTY_ID,
            dateRanges: [{ startDate: monthAgoStr, endDate: todayStr }],
            metrics: [{ name: 'activeUsers' }],
        });

        // 4. 평균 세션 시간 및 이탈률
        const [engagementResponse] = await analyticsDataClient.runReport({
            property: GA4_PROPERTY_ID,
            dateRanges: [{ startDate: monthAgoStr, endDate: todayStr }],
            metrics: [
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
            ],
        });

        // 5. 일별 방문자 추이 (최근 7일)
        const [dailyResponse] = await analyticsDataClient.runReport({
            property: GA4_PROPERTY_ID,
            dateRanges: [{ startDate: weekAgoStr, endDate: todayStr }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
        });

        // 데이터 파싱
        const todayVisitors = todayResponse.rows?.[0]?.metricValues?.[0]?.value || '0';
        const weekVisitors = weekResponse.rows?.[0]?.metricValues?.[0]?.value || '0';
        const monthVisitors = monthResponse.rows?.[0]?.metricValues?.[0]?.value || '0';

        const avgSessionDuration = engagementResponse.rows?.[0]?.metricValues?.[0]?.value || '0';
        const bounceRate = engagementResponse.rows?.[0]?.metricValues?.[1]?.value || '0';

        // 세션 시간을 분:초 형식으로 변환
        const durationSeconds = parseFloat(avgSessionDuration);
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.round(durationSeconds % 60);
        const formattedDuration = `${minutes}분 ${seconds}초`;

        // 이탈률을 퍼센트로 변환
        const bounceRatePercent = `${(parseFloat(bounceRate) * 100).toFixed(1)}%`;

        // 일별 데이터 파싱
        const dailyStats = dailyResponse.rows?.map(row => ({
            date: row.dimensionValues?.[0]?.value || '',
            visitors: parseInt(row.metricValues?.[0]?.value || '0'),
            sessions: parseInt(row.metricValues?.[1]?.value || '0'),
        })) || [];

        return NextResponse.json({
            success: true,
            data: {
                today: parseInt(todayVisitors),
                week: parseInt(weekVisitors),
                month: parseInt(monthVisitors),
                avgSessionDuration: formattedDuration,
                bounceRate: bounceRatePercent,
                dailyStats: dailyStats,
            }
        });

    } catch (error) {
        console.error('[GA4 API] 오류:', error);
        return NextResponse.json({
            error: 'GA4 데이터를 가져오는 중 오류가 발생했습니다.',
            details: String(error),
            data: null
        }, { status: 500 });
    }
}
