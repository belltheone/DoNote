"use client";
// 페이지 전환 애니메이션 래퍼
// Framer Motion을 사용한 부드러운 페이지 전환

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// 페이지 전환 애니메이션 variants
const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: "easeIn",
        },
    },
};

// 슬라이드 업 효과
export const slideUpVariants: Variants = {
    initial: {
        opacity: 0,
        y: 60,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
        },
    },
};

// 스케일 효과
export const scaleVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.3,
        },
    },
};

// 스태거 자식 요소 애니메이션
export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "slideUp" | "scale";
}

export function PageTransition({
    children,
    className = "",
    variant = "default",
}: PageTransitionProps) {
    const variantsMap: Record<string, Variants> = {
        default: pageVariants,
        slideUp: slideUpVariants,
        scale: scaleVariants,
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variantsMap[variant]}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// 마이크로 인터랙션 (버튼, 링크용)
export const buttonTap = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
};

export const cardHover = {
    whileHover: {
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    transition: { type: "spring", stiffness: 300, damping: 20 },
};

