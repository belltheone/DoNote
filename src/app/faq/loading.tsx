// FAQ 로딩 상태
import { SkeletonFAQItem } from "@/components/ui/Skeleton";

export default function FAQLoading() {
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

            {/* FAQ 리스트 Skeleton */}
            <div className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* 카테고리 탭 Skeleton */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        ))}
                    </div>

                    {/* FAQ 아이템 Skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <SkeletonFAQItem />
                        <SkeletonFAQItem />
                        <SkeletonFAQItem />
                        <SkeletonFAQItem />
                    </div>
                </div>
            </div>
        </div>
    );
}
