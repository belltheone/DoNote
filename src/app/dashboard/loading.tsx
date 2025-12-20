// 대시보드 로딩 상태
import { SkeletonStatCard, SkeletonCard } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="p-8 space-y-8">
            {/* 통계 카드 로딩 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </div>

            {/* 최근 후원 로딩 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}
