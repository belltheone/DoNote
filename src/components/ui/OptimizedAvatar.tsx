// 최적화된 아바타 컴포넌트
// next/image 활용 및 이모지 fallback 지원

import Image from "next/image";
import { useState } from "react";

// Props 타입
interface OptimizedAvatarProps {
    src?: string;
    alt: string;
    fallback?: string;  // 이모지 fallback
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

// 사이즈 맵
const sizeMap = {
    sm: { px: 32, class: "w-8 h-8 text-lg" },
    md: { px: 40, class: "w-10 h-10 text-xl" },
    lg: { px: 64, class: "w-16 h-16 text-3xl" },
    xl: { px: 96, class: "w-24 h-24 text-5xl" },
};

// 최적화된 아바타 컴포넌트
export function OptimizedAvatar({
    src,
    alt,
    fallback = "👤",
    size = "md",
    className = "",
}: OptimizedAvatarProps) {
    const [hasError, setHasError] = useState(false);
    const { px, class: sizeClass } = sizeMap[size];

    // 이미지가 없거나 에러가 발생하면 fallback 표시
    const showFallback = !src || hasError || src.length <= 2;  // 이모지는 보통 2자 이하

    // 이모지 또는 짧은 문자열인지 체크
    const isEmoji = src && src.length <= 2;

    if (showFallback || isEmoji) {
        return (
            <div
                className={`${sizeClass} rounded-full bg-gradient-to-br from-[#FFD95A] to-[#FF6B6B] flex items-center justify-center ${className}`}
            >
                <span>{isEmoji ? src : fallback}</span>
            </div>
        );
    }

    return (
        <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={px}
                height={px}
                className="object-cover w-full h-full"
                onError={() => setHasError(true)}
                priority={size === "xl"}
            />
        </div>
    );
}

export default OptimizedAvatar;
