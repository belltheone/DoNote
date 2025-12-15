"use client";
// 랜딩페이지 - 도노트 메인 페이지 (Digital Analog 디자인)
// "친구의 책상에 응원의 포스트잇을 붙이는 경험"

import { motion } from "framer-motion";
import Link from "next/link";

// 애니메이션 설정
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            {/* 로고: 도넛 + 쪽지 컨셉 */}
            <span className="text-2xl">🍩</span>
            <span className="text-xl font-bold text-[#333]">도노트</span>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/demo"
              className="px-4 py-2 text-[#666] hover:text-[#333] transition-colors"
            >
              데모 보기
            </Link>
            <Link
              href="#start"
              className="px-6 py-2 bg-[#FFD95A] rounded-lg text-[#333] font-medium hover:bg-[#FFCE3A] transition-all shadow-sm"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* 배경 데코 - 포스트잇들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 bg-[#FFFACD] rounded shadow-md transform rotate-6 opacity-40"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-[#FFE4E1] rounded shadow-md transform -rotate-3 opacity-40"></div>
          <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-[#E6F3FF] rounded shadow-md transform rotate-2 opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-[#E8F5E9] rounded shadow-md transform -rotate-6 opacity-40"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-3xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* 배지 */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-[#666] mb-6 shadow-sm border border-gray-100"
            variants={fadeInUp}
          >
            <span>✉️</span>
            <span>한국 크리에이터를 위한 따뜻한 후원 플랫폼</span>
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-[#333]"
            variants={fadeInUp}
          >
            마음을 적는<br />
            <span className="text-[#FF6B6B]">가장 가벼운 후원</span>
          </motion.h1>

          {/* 서브 타이틀 */}
          <motion.p
            className="text-lg text-[#666] max-w-xl mx-auto mb-10"
            variants={fadeInUp}
          >
            회원가입 없이 10초 만에 크리에이터를 응원하세요.
            <br />
            친구의 책상에 포스트잇을 붙이듯, 따뜻한 쪽지와 함께.
          </motion.p>

          {/* CTA 버튼들 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Link
              href="#start"
              className="px-8 py-4 bg-[#FFD95A] rounded-xl text-[#333] font-semibold text-lg shadow-md hover:bg-[#FFCE3A] hover:-translate-y-1 transition-all"
            >
              ✍️ 크리에이터로 시작하기
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-[#666] font-semibold text-lg hover:border-[#FFD95A] hover:bg-[#FFFACD] transition-all flex items-center justify-center gap-2"
            >
              <span>데모 체험하기</span>
              <span>→</span>
            </Link>
          </motion.div>

          {/* 통계 - 우표 스타일 */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-6"
            variants={fadeInUp}
          >
            {[
              { value: "10초", label: "평균 후원 시간", emoji: "⏱️" },
              { value: "0원", label: "가입비용", emoji: "🆓" },
              { value: "5%", label: "최저 수수료", emoji: "💰" },
            ].map((stat, index) => (
              <div
                key={index}
                className="px-6 py-4 bg-white rounded-lg border-2 border-dashed border-gray-200 text-center shadow-sm"
              >
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className="text-2xl font-bold text-[#FF6B6B]">{stat.value}</div>
                <div className="text-xs text-[#999] mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 스크롤 인디케이터 */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center text-[#999]">
            <span className="text-sm mb-2">더 알아보기</span>
            <span>↓</span>
          </div>
        </motion.div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-24 px-6 bg-white" id="features">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333]">왜 도노트인가요?</h2>
            <p className="text-lg text-[#666]">간단하지만 따뜻한 세 가지 이유</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "📝",
                title: "쪽지처럼 간편하게",
                description: "회원가입 없이 닉네임만 적으면 끝. 응원 메시지와 함께 마음을 전달하세요.",
                color: "bg-[#FFFACD]"
              },
              {
                emoji: "💌",
                title: "편지처럼 따뜻하게",
                description: "단순 송금이 아닌 정성 담긴 쪽지. 받는 사람의 하루를 특별하게 만들어요.",
                color: "bg-[#FFE4E1]"
              },
              {
                emoji: "🏪",
                title: "동네 가게처럼 편하게",
                description: "토스, 카카오페이, 네이버페이. 익숙한 결제 수단으로 3초 만에 결제 완료.",
                color: "bg-[#E6F3FF]"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`group relative p-8 ${feature.color} rounded-lg shadow-md hover:-translate-y-2 transition-all cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ transform: `rotate(${index === 1 ? 0 : (index === 0 ? -2 : 2)}deg)` }}
                whileHover={{ rotate: 0 }}
              >
                {/* 테이프 효과 */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/70 rounded shadow-sm"></div>

                {/* 아이콘 */}
                <div className="text-4xl mb-4">{feature.emoji}</div>

                {/* 제목 */}
                <h3 className="text-xl font-bold mb-2 text-[#333]">{feature.title}</h3>

                {/* 설명 */}
                <p className="text-[#666] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="py-24 px-6 bg-[#F9F9F9]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333]">3분이면 충분해요</h2>
            <p className="text-lg text-[#666]">시작하는 방법은 정말 간단합니다</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* 연결선 */}
            <div className="hidden md:block absolute top-16 left-[25%] right-[25%] h-0.5 bg-[#FFD95A] opacity-50"></div>

            {[
              {
                step: "01",
                title: "프로필 만들기",
                description: "이름, 한 줄 소개, 목표만 적으면 나만의 후원 페이지 완성",
                emoji: "✨"
              },
              {
                step: "02",
                title: "링크 공유하기",
                description: "블로그, 깃허브, SNS 어디에든 티켓 배지를 달아주세요",
                emoji: "🎫"
              },
              {
                step: "03",
                title: "쪽지 받기",
                description: "따뜻한 응원 메시지와 함께 커피값을 받아보세요",
                emoji: "☕"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* 단계 번호 - 우표 스타일 */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-dashed border-[#FFD95A] mb-6 shadow-sm">
                  <span className="text-lg font-bold text-[#FF6B6B]">{item.step}</span>
                  <span className="absolute -top-1 -right-1 text-xl">{item.emoji}</span>
                </div>

                {/* 제목 */}
                <h3 className="text-lg font-bold mb-2 text-[#333]">{item.title}</h3>

                {/* 설명 */}
                <p className="text-[#666] text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 위젯 미리보기 섹션 */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333]">예쁜 티켓을 달아보세요</h2>
            <p className="text-lg text-[#666] mb-12">블로그나 깃허브에 붙이는 입장권처럼</p>
          </motion.div>

          {/* 배지 프리뷰 - 티켓 스타일 */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* 스타일 1: 티켓형 */}
            <div className="relative px-8 py-4 bg-white rounded-lg border-2 border-dashed border-[#FFD95A] shadow-md">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#F9F9F9] rounded-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[#F9F9F9] rounded-full"></div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍩</span>
                <div className="text-left">
                  <div className="text-xs text-[#999]">To. Creator</div>
                  <div className="font-bold text-[#333]">도노트 보내기</div>
                </div>
              </div>
            </div>

            {/* 스타일 2: 포스트잇형 */}
            <div className="relative px-6 py-4 bg-[#FFFACD] rounded shadow-md transform rotate-2 hover:rotate-0 transition-transform">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-white/70 rounded"></div>
              <div className="flex items-center gap-2">
                <span>☕</span>
                <span className="font-medium text-[#333]">커피 한 잔 사주기</span>
              </div>
            </div>

            {/* 스타일 3: 미니멀 */}
            <div className="px-6 py-3 bg-[#FF6B6B] rounded-full text-white font-medium shadow-md hover:bg-[#FF5252] transition-colors">
              💌 쪽지 보내기
            </div>
          </motion.div>

          <motion.p
            className="text-[#999] mt-8 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Markdown, HTML 코드로 어디든 삽입 가능
          </motion.p>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-[#FFFACD]" id="start">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="relative p-12 bg-white rounded-xl shadow-lg text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* 테이프 장식 */}
            <div className="absolute -top-3 left-10 w-20 h-5 bg-[#FFFACD]/80 rounded transform -rotate-3 shadow-sm"></div>
            <div className="absolute -top-3 right-10 w-20 h-5 bg-[#FFE4E1]/80 rounded transform rotate-3 shadow-sm"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333]">
              지금 시작해보세요
            </h2>
            <p className="text-lg text-[#666] mb-8">
              무료로 시작하고, 첫 6개월은 수수료 0%!
            </p>

            {/* 이메일 입력 폼 */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 text-[#333] placeholder-[#999] focus:outline-none focus:border-[#FFD95A] transition-colors"
              />
              <button className="px-8 py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-colors whitespace-nowrap shadow-md">
                무료로 시작
              </button>
            </div>

            <p className="text-xs text-[#999] mt-6">
              가입 시 <Link href="#" className="text-[#FF6B6B] hover:underline">이용약관</Link> 및{" "}
              <Link href="#" className="text-[#FF6B6B] hover:underline">개인정보처리방침</Link>에 동의하게 됩니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* 로고 */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍩</span>
              <span className="text-xl font-bold text-[#333]">도노트</span>
            </div>

            {/* 링크 */}
            <div className="flex gap-6 text-[#666] text-sm">
              <Link href="#" className="hover:text-[#333] transition-colors">서비스 소개</Link>
              <Link href="#" className="hover:text-[#333] transition-colors">이용약관</Link>
              <Link href="#" className="hover:text-[#333] transition-colors">개인정보처리방침</Link>
              <Link href="#" className="hover:text-[#333] transition-colors">문의하기</Link>
            </div>
          </div>

          {/* 저작권 */}
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-[#999] text-sm">
            © 2024 Donote. All rights reserved. Made with 💌 in Korea
          </div>
        </div>
      </footer>
    </div>
  );
}
