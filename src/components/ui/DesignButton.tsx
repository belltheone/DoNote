"use client";
// 디자인 시스템 버튼 컴포넌트
// 크기, 상태, 애니메이션을 통합한 새로운 버튼 시스템

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// 버튼 사이즈 타입
type ButtonSize = "sm" | "md" | "lg";

// 버튼 변형 타입
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

// 버튼 Props 인터페이스
interface DesignButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: ReactNode;
    size?: ButtonSize;
    variant?: ButtonVariant;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

// 사이즈별 스타일
const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm h-8 min-h-[32px]",
    md: "px-6 py-3 text-base h-10 min-h-[40px]",
    lg: "px-8 py-4 text-lg h-12 min-h-[48px]",
};

// 변형별 스타일
const variantStyles: Record<ButtonVariant, string> = {
    primary: `
        bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-400)]
        text-white
        shadow-md hover:shadow-lg
        hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-500)]
    `,
    secondary: `
        bg-gradient-to-r from-[var(--color-secondary-500)] to-[var(--color-secondary-400)]
        text-[var(--text-primary)]
        shadow-md hover:shadow-lg
        hover:from-[var(--color-secondary-600)] hover:to-[var(--color-secondary-500)]
    `,
    outline: `
        bg-transparent
        border-2 border-[var(--color-primary-500)]
        text-[var(--color-primary-500)]
        hover:bg-[var(--color-primary-50)]
    `,
    ghost: `
        bg-transparent
        text-[var(--text-secondary)]
        hover:bg-[var(--color-neutral-100)]
        hover:text-[var(--text-primary)]
    `,
};

// 애니메이션 설정
const buttonAnimations = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15, ease: [0, 0, 0.2, 1] as const },
};

export function DesignButton({
    children,
    size = "md",
    variant = "primary",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = "",
    disabled,
    ...props
}: DesignButtonProps) {
    const isDisabled = disabled || isLoading;

    return (
        <motion.button
            className={`
                inline-flex items-center justify-center gap-2
                font-medium rounded-xl
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                ${sizeStyles[size]}
                ${variantStyles[variant]}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
            disabled={isDisabled}
            {...buttonAnimations}
            {...props}
        >
            {/* 로딩 스피너 */}
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}

            {/* 왼쪽 아이콘 */}
            {!isLoading && leftIcon && (
                <span className="flex-shrink-0">{leftIcon}</span>
            )}

            {/* 버튼 텍스트 */}
            <span>{children}</span>

            {/* 오른쪽 아이콘 */}
            {rightIcon && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </motion.button>
    );
}

// IconButton 컴포넌트 (아이콘만 있는 버튼)
interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    icon: ReactNode;
    size?: ButtonSize;
    variant?: ButtonVariant;
    "aria-label": string;
}

const iconSizeStyles: Record<ButtonSize, string> = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
};

export function IconButton({
    icon,
    size = "md",
    variant = "ghost",
    className = "",
    ...props
}: IconButtonProps) {
    return (
        <motion.button
            className={`
                inline-flex items-center justify-center
                rounded-xl
                transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${iconSizeStyles[size]}
                ${variantStyles[variant]}
                ${className}
            `}
            {...buttonAnimations}
            {...props}
        >
            {icon}
        </motion.button>
    );
}
