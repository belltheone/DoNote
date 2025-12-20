// 커스텀 404 페이지
// 페이지를 찾을 수 없을 때 표시

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] dark:bg-gray-900 px-6">
            <div className="text-center max-w-md">
                {/* 이모지 아이콘 */}
                <div className="text-8xl mb-6">📭</div>
                
                {/* 에러 코드 */}
                <h1 className="text-6xl font-bold text-[#FF6B6B] mb-4">404</h1>
                
                {/* 메시지 */}
                <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-4">
                    페이지를 찾을 수 없어요
                </h2>
                <p className="text-[#666] dark:text-gray-400 mb-8">
                    찾으시는 페이지가 삭제되었거나, 주소가 변경되었을 수 있어요.
                </p>

                {/* 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#e55555] transition-colors"
                    >
                        홈으로 돌아가기
                    </Link>
                    <Link
                        href="/faq"
                        className="px-6 py-3 bg-white dark:bg-gray-800 text-[#333] dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        도움말 보기
                    </Link>
                </div>
            </div>
        </div>
    );
}
