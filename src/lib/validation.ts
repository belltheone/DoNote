// Input validation schemas using Zod
import { z } from 'zod';

// 후원 폼 검증
export const donationSchema = z.object({
    amount: z.number().min(1000, '최소 금액은 1,000원입니다').max(1000000, '최대 금액은 1,000,000원입니다'),
    message: z.string().min(1, '메시지를 입력해주세요').max(500, '메시지는 500자 이내로 작성해주세요'),
    donor_name: z.string().min(1, '닉네임을 입력해주세요').max(50, '닉네임은 50자 이내로 작성해주세요'),
    sticker: z.string().optional(),
});

// 크리에이터 프로필 검증
export const creatorProfileSchema = z.object({
    handle: z.string()
        .min(3, '핸들은 최소 3자 이상이어야 합니다')
        .max(20, '핸들은 20자 이내로 작성해주세요')
        .regex(/^[a-z0-9_]+$/, '핸들은 영문 소문자, 숫자, 언더스코어만 사용 가능합니다'),
    display_name: z.string().min(1).max(50),
    bio: z.string().max(200).optional(),
    avatar: z.string().optional(),
    goal_title: z.string().max(100).optional(),
    goal_target: z.number().min(0).optional(),
});

// 타입 export
export type DonationInput = z.infer<typeof donationSchema>;
export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;
