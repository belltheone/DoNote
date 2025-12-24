// 공지사항 데이터 공유 파일
// ContentTab과 /notice 페이지에서 동시 사용

// 공지사항 타입
export interface Notice {
    id: string;
    title: string;
    content?: string;
    type: "info" | "warning" | "success";
    active: boolean;
    createdAt: string;
}

// 공지사항 데이터
export const noticesData: Notice[] = [
    {
        id: "1",
        title: "도노트 서비스 정식 오픈!",
        content: "안녕하세요, 도노트입니다! 🎉\n\n많은 분들의 성원에 힘입어 드디어 도노트가 정식 오픈했습니다.\n크리에이터와 팬을 연결하는 따뜻한 후원 문화를 만들어가겠습니다.\n\n앞으로도 많은 관심 부탁드립니다!",
        type: "success",
        active: true,
        createdAt: "2024-12-20"
    },
    {
        id: "2",
        title: "연말 이벤트 진행 중",
        content: "🎄 연말을 맞이하여 특별 이벤트를 진행합니다!\n\n12월 31일까지 첫 정산 신청 시 수수료를 면제해 드립니다.\n많은 참여 부탁드립니다.",
        type: "info",
        active: true,
        createdAt: "2024-12-22"
    },
    {
        id: "3",
        title: "서비스 점검 안내 (완료)",
        content: "서버 점검이 완료되었습니다.\n이용에 불편을 드려 죄송합니다.",
        type: "warning",
        active: false,
        createdAt: "2024-12-15"
    },
];

// 활성화된 공지만 반환
export function getActiveNotices(): Notice[] {
    return noticesData.filter(notice => notice.active);
}

// 모든 공지 반환 (관리자용)
export function getAllNotices(): Notice[] {
    return noticesData;
}
