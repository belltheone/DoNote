-- Demo 크리에이터 추가 (테스트용)
-- Supabase SQL Editor에서 실행하세요

-- 1. 먼저 기존 demo 크리에이터가 있는지 확인
SELECT * FROM public.creators WHERE handle = 'demo';

-- 2. demo 크리에이터 추가 (user_id 없이)
-- 참고: 실제 사용 시에는 user_id가 필요하지만, 테스트용으로는 NULL 허용 필요
INSERT INTO public.creators (handle, display_name, avatar, bio, goal_title, goal_target)
VALUES (
    'demo',                          -- handle (@demo)
    '개발하는 민수',                  -- 표시 이름
    '👨‍💻',                           -- 아바타 이모지
    '프론트엔드 개발자 | 오픈소스 기여자 | 기술 블로거',  -- 소개글
    '맥북 할부금 갚기',               -- 목표 제목
    500000                           -- 목표 금액
);

-- 3. 추가된 크리에이터 확인
SELECT id, handle, display_name, avatar FROM public.creators WHERE handle = 'demo';
