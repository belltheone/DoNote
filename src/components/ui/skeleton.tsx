// 스켈레톤 UI 컴포넌트
// 로딩 상태 표시용

import { cn } from "@/lib/utils";

// 기본 스켈레톤
export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
                className
            )}
            {...props}
        />
    );
}

// 후원 카드 스켈레톤
export function DonationCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-6 w-16" />
            </div>
        </div>
    );
}

// 통계 카드 스켈레톤
export function StatCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
        </div>
    );
}

// 테이블 행 스켈레톤
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <tr className="border-t border-gray-100 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

// 프로필 스켈레톤
export function ProfileSkeleton() {
    return (
        <div className="text-center">
            <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
        </div>
    );
}

// 차트 스켈레톤
export function ChartSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex items-end gap-2 h-48">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1"
                        style={{ height: `${Math.random() * 100 + 20}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

// 페이지 로더
export function PageLoader() {
    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">🍩</div>
                <p className="text-[#666] dark:text-gray-400">로딩 중...</p>
            </div>
        </div>
    );
}

// 리스트 아이템 스켈레톤
export function SkeletonListItem() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-4/5" />
            </div>
            <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
    );
}

// 대시보드 전체 스켈레톤
export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* 환영 메시지 */}
            <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-xl p-6">
                <Skeleton className="h-7 w-3/5 bg-white/30 mb-2" />
                <Skeleton className="h-5 w-2/5 bg-white/30" />
            </div>

            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            {/* 메인 컨텐츠 */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* 최근 쪽지 */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                    <SkeletonListItem />
                    <SkeletonListItem />
                    <SkeletonListItem />
                </div>

                {/* 사이드바 */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                        <Skeleton className="h-5 w-24 mx-auto mb-2" />
                        <Skeleton className="h-4 w-16 mx-auto" />
                    </div>
                    <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-xl p-6">
                        <Skeleton className="h-5 w-24 bg-white/30 mb-2" />
                        <Skeleton className="h-4 w-4/5 bg-white/30 mb-4" />
                        <Skeleton className="h-10 w-full rounded-lg bg-white/30" />
                    </div>
                </div>
            </div>
        </div>
    );
}
