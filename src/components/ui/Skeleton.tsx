// Skeleton UI 컴포넌트
// 로딩 상태를 위한 플레이스홀더

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

// 기본 Skeleton
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
                className
            )}
        />
    );
}

// 텍스트 Skeleton
export function SkeletonText({ className }: SkeletonProps) {
    return <Skeleton className={cn("h-4 w-full", className)} />;
}

// 원형 Skeleton (아바타용)
export function SkeletonCircle({ className }: SkeletonProps) {
    return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
}

// 카드 Skeleton
export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn("p-6 bg-white dark:bg-gray-800 rounded-xl", className)}>
            <div className="flex items-center gap-4 mb-4">
                <SkeletonCircle />
                <div className="flex-1 space-y-2">
                    <SkeletonText className="w-1/3" />
                    <SkeletonText className="w-1/2" />
                </div>
            </div>
            <div className="space-y-2">
                <SkeletonText />
                <SkeletonText className="w-4/5" />
                <SkeletonText className="w-3/5" />
            </div>
        </div>
    );
}

// 대시보드 통계 카드 Skeleton
export function SkeletonStatCard({ className }: SkeletonProps) {
    return (
        <div className={cn("p-6 bg-white dark:bg-gray-800 rounded-xl", className)}>
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <SkeletonText className="w-20 h-3" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
        </div>
    );
}

// 테이블 행 Skeleton
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
    return (
        <tr className="border-b border-gray-100 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="py-4 px-4">
                    <SkeletonText className={i === 0 ? "w-1/2" : "w-3/4"} />
                </td>
            ))}
        </tr>
    );
}

// 블로그 포스트 Skeleton
export function SkeletonBlogPost({ className }: SkeletonProps) {
    return (
        <div className={cn("flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden", className)}>
            <Skeleton className="md:w-48 h-40 md:h-auto" />
            <div className="flex-1 p-6 space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <SkeletonText className="w-20" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <SkeletonText className="w-full" />
                <SkeletonText className="w-2/3" />
            </div>
        </div>
    );
}

// FAQ 아이템 Skeleton
export function SkeletonFAQItem({ className }: SkeletonProps) {
    return (
        <div className={cn("py-5 border-b border-gray-200 dark:border-gray-700", className)}>
            <div className="flex justify-between items-center">
                <SkeletonText className="w-2/3" />
                <Skeleton className="h-5 w-5" />
            </div>
        </div>
    );
}

// 로딩 스피너
export function LoadingSpinner({ className }: SkeletonProps) {
    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B6B] border-t-transparent" />
        </div>
    );
}

// 페이지 로딩
export function PageLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] dark:bg-gray-900">
            <div className="text-center">
                <LoadingSpinner className="mb-4" />
                <p className="text-[#666] dark:text-gray-400">로딩 중...</p>
            </div>
        </div>
    );
}

// 대시보드 전체 Skeleton
export function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-8">
            {/* 환영 메시지 */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </div>

            {/* 메인 그리드 */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SkeletonCard />
                </div>
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
}

// 통계 카드 Skeleton (alias)
export const StatCardSkeleton = SkeletonStatCard;

// 차트 Skeleton
export function ChartSkeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("p-6 bg-white dark:bg-gray-800 rounded-xl", className)}>
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg" />
        </div>
    );
}
