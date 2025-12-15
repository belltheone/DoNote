"use client";
// 랜딩페이지 - 도노트 메인 페이지
// 히어로 섹션, 특징 소개, 사용 방법, Footer로 구성

import { motion } from "framer-motion";
import Link from "next/link";

// 애니메이션 설정
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card !rounded-none !border-x-0 !border-t-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            도노트
          </Link>
          <div className="flex gap-4">
            <Link
              href="/demo"
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              데모 보기
            </Link>
            <Link
              href="#start"
              className="px-6 py-2 gradient-bg rounded-full text-white font-medium hover:opacity-90 transition-opacity"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* 배지 */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm text-gray-300 mb-8"
            variants={fadeInUp}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            한국 크리에이터를 위한 마이크로 후원 플랫폼
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            variants={fadeInUp}
          >
            마음을 적는<br />
            <span className="gradient-text">가장 가벼운 후원</span>
          </motion.h1>

          {/* 서브 타이틀 */}
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            variants={fadeInUp}
          >
            회원가입 없이 10초 만에 크리에이터를 응원하세요.
            <br />
            토스, 카카오페이, 네이버페이로 간편하게.
          </motion.p>

          {/* CTA 버튼들 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Link
              href="#start"
              className="group relative px-8 py-4 gradient-bg rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span className="relative z-10">크리에이터로 시작하기</span>
              <div className="absolute inset-0 gradient-bg rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 glass-card text-white font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <span>데모 체험하기</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* 통계 */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            variants={fadeInUp}
          >
            {[
              { value: "10초", label: "평균 후원 시간" },
              { value: "0원", label: "가입비용" },
              { value: "5%", label: "최저 수수료" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 스크롤 인디케이터 */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-32 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">왜 도노트인가요?</h2>
            <p className="text-xl text-gray-400">간단하지만 강력한 세 가지 이유</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "10초 후원",
                description: "회원가입 없이 닉네임만 적으면 끝. 응원 메시지와 함께 마음을 전달하세요.",
                gradient: "from-purple-500 to-violet-500"
              },
              {
                icon: "💌",
                title: "마음을 담은 쪽지",
                description: "단순 송금이 아닌 감성적인 메시지. 받는 사람의 하루를 특별하게 만들어요.",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: "🇰🇷",
                title: "한국 결제 최적화",
                description: "토스, 카카오페이, 네이버페이. 익숙한 결제 수단으로 3초 만에 결제 완료.",
                gradient: "from-orange-500 to-amber-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-8 glass-card hover:bg-white/10 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* 아이콘 */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>

                {/* 제목 */}
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>

                {/* 설명 */}
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">3분이면 충분해요</h2>
            <p className="text-xl text-gray-400">시작하는 방법은 정말 간단합니다</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* 연결선 (데스크톱에서만) */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-30"></div>

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
                description: "블로그, 깃허브, SNS 어디에든 배지를 달아주세요",
                emoji: "🔗"
              },
              {
                step: "03",
                title: "후원 받기",
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
                {/* 단계 번호 */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#1e1e26] to-[#16161d] border border-white/10 mb-6">
                  <span className="text-2xl font-bold gradient-text">{item.step}</span>
                  <span className="absolute -top-2 -right-2 text-2xl">{item.emoji}</span>
                </div>

                {/* 제목 */}
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>

                {/* 설명 */}
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 배지 미리보기 섹션 */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">힙한 배지를 달아보세요</h2>
            <p className="text-xl text-gray-400 mb-12">블로그 디자인 소품처럼 예쁜 위젯</p>
          </motion.div>

          {/* 배지 프리뷰 */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* 스타일 1: 그라데이션 */}
            <div className="px-6 py-3 gradient-bg rounded-full text-white font-medium flex items-center gap-2 shadow-lg animate-pulse-glow">
              <span>☕</span>
              <span>커피 한 잔 사주기</span>
            </div>

            {/* 스타일 2: 글래스 */}
            <div className="px-6 py-3 glass-card text-white font-medium flex items-center gap-2">
              <span>💜</span>
              <span>도노트로 응원하기</span>
            </div>

            {/* 스타일 3: 미니멀 */}
            <div className="px-6 py-3 bg-white text-gray-900 rounded-full font-medium flex items-center gap-2 shadow-lg">
              <span>✨</span>
              <span>Sponsor me on Donote</span>
            </div>
          </motion.div>

          <motion.p
            className="text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Markdown, HTML 코드로 어디든 삽입 가능
          </motion.p>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-32 px-6" id="start">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative p-12 md:p-16 rounded-3xl overflow-hidden text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* 배경 그라데이션 */}
            <div className="absolute inset-0 gradient-bg opacity-20"></div>
            <div className="absolute inset-0 bg-[#16161d]/80 backdrop-blur-xl"></div>

            {/* 보더 그라데이션 */}
            <div className="absolute inset-0 rounded-3xl border border-white/10"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                지금 시작해보세요
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                무료로 시작하고, 첫 6개월은 수수료 0%!
              </p>

              {/* 이메일 입력 폼 */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button className="px-8 py-4 gradient-bg rounded-full text-white font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                  무료로 시작
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                가입 시 <Link href="#" className="text-purple-400 hover:underline">이용약관</Link> 및{" "}
                <Link href="#" className="text-purple-400 hover:underline">개인정보처리방침</Link>에 동의하게 됩니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* 로고 */}
            <div className="text-2xl font-bold gradient-text">도노트</div>

            {/* 링크 */}
            <div className="flex gap-8 text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">서비스 소개</Link>
              <Link href="#" className="hover:text-white transition-colors">이용약관</Link>
              <Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link>
              <Link href="#" className="hover:text-white transition-colors">문의하기</Link>
            </div>

            {/* 소셜 */}
            <div className="flex gap-4">
              {["github", "twitter", "instagram"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* 저작권 */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
            © 2024 Donote. All rights reserved. Made with 💜 in Korea
          </div>
        </div>
      </footer>
    </div>
  );
}
