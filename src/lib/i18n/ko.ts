// 다국어 번역 파일 - 한국어 (기본)
// i18n 설정용

export const ko = {
    // 공통
    common: {
        loading: '로딩 중...',
        error: '오류가 발생했습니다',
        save: '저장',
        cancel: '취소',
        confirm: '확인',
        delete: '삭제',
        edit: '수정',
        copy: '복사',
        copied: '복사됨!',
        close: '닫기',
        back: '뒤로',
        next: '다음',
        submit: '제출',
        search: '검색',
        filter: '필터',
        sort: '정렬',
        all: '전체',
    },

    // 네비게이션
    nav: {
        home: '홈',
        about: '서비스 소개',
        widget: '위젯 미리보기',
        guide: '시작가이드',
        faq: 'FAQ',
        blog: '블로그',
        ranking: '랭킹',
        login: '로그인',
        signup: '회원가입',
        logout: '로그아웃',
        dashboard: '대시보드',
        settings: '설정',
        profile: '프로필',
    },

    // 메인 페이지
    landing: {
        hero: {
            title: '마음을 담은 쪽지가 도착했어요',
            subtitle: '당신의 크리에이터에게 따뜻한 응원을 전하세요',
            cta: '내 우체통 만들기',
            demo: '데모 체험하기',
        },
        features: {
            title: '왜 도노트인가요?',
            simple: {
                title: '쪽지처럼 간편하게',
                desc: '복잡한 절차 없이 쪽지를 보내듯 간편하게 응원하세요',
            },
            warm: {
                title: '편지처럼 따뜻하게',
                desc: '포스트잇에 담긴 진심 어린 메시지로 마음을 전하세요',
            },
            viral: {
                title: '위젯으로 바이럴하게',
                desc: 'GitHub, 블로그 어디서든 후원 위젯으로 연결하세요',
            },
        },
    },

    // 후원
    donation: {
        title: '응원 메시지 보내기',
        amount: '금액',
        message: '메시지',
        messagePlaceholder: '따뜻한 응원 메시지를 남겨주세요...',
        nickname: '닉네임',
        nicknamePlaceholder: '익명',
        email: '이메일 (선택)',
        emailPlaceholder: '영수증을 받을 이메일',
        tip: {
            title: '도노트에 팁 주기',
            desc: '도노트 운영을 응원해주세요',
        },
        pay: '결제하기',
        success: '후원이 완료되었습니다!',
        thankYou: '감사합니다',
    },

    // 대시보드
    dashboard: {
        welcome: '환영합니다',
        home: '홈',
        messages: '메시지',
        widget: '위젯',
        settings: '설정',
        stats: {
            totalDonations: '총 후원금',
            thisMonth: '이번 달',
            donationCount: '후원 수',
            avgAmount: '평균 금액',
        },
    },

    // 설정
    settings: {
        profile: '프로필 설정',
        displayName: '표시 이름',
        handle: '핸들',
        bio: '소개',
        bank: '정산 정보',
        bankName: '은행명',
        accountNumber: '계좌번호',
        accountHolder: '예금주',
        notification: '알림 설정',
        emailNotification: '이메일 알림',
        save: '저장하기',
    },

    // 에러
    errors: {
        notFound: '페이지를 찾을 수 없습니다',
        unauthorized: '로그인이 필요합니다',
        forbidden: '접근 권한이 없습니다',
        serverError: '서버 오류가 발생했습니다',
        networkError: '네트워크 연결을 확인해주세요',
    },
};

export type TranslationKey = typeof ko;
export default ko;
