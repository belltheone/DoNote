// 블로그 로딩 상태
import { SkeletonBlogPost } from "@/components/ui/Skeleton";

export default function BlogLoading() {
    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
            {/* 히어로 Skeleton */}
            <div className="bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFFAF0] dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
                        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                    </div>
                </div>
            </div>

            {/* 포스트 리스트 Skeleton */}
            <div className="py-12 px-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <SkeletonBlogPost />
                    <SkeletonBlogPost />
                    <SkeletonBlogPost />
                </div>
            </div>
        </div>
    );
}
