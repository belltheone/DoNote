"use client";
// 랜딩페이지 - 도노트 메인 페이지 (고도화 버전)
// 인터랙티브 스토리텔링 + 실시간 후원 티커

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnvelopeHero } from "@/components/landing/EnvelopeHero";

// 더미 실시간 후원 데이터
const liveDonations = [
  { donor: "익명의 팬", creator: "개발하는 민수", amount: 5000 },
  { donor: "코딩초보", creator: "디자인하는 수지", amount: 3000 },
  { donor: "열정맨", creator: "글쓰는 철수", amount: 10000 },
  { donor: "후원왕", creator: "영상만드는 영희", amount: 5000 },
];

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // 패럴랙스 효과
  const envelopeY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const envelopeRotate = useTransform(scrollYProgress, [0, 0.2], [0, -5]);
  const envelopeScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // 실시간 티커 상태
  const [currentDonation, setCurrentDonation] = useState(0);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  // 실시간 티커 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDonation(prev => (prev + 1) % liveDonations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 봉투 열기 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => setIsEnvelopeOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      {/* 공통 헤더 */}
      <Header />

      {/* 실시간 후원 티커 - 헤더 아래 고정 */}
      <div className="sticky top-[72px] z-30 overflow-hidden bg-[#FFFACD]/90 dark:bg-yellow-900/30 backdrop-blur-sm py-2 border-b border-[#FFD95A]/30">
        <motion.div
          className="flex items-center justify-center gap-2 text-sm"
          key={currentDonation}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <span className="text-lg">🍩</span>
          <span className="text-[#666] dark:text-gray-300">
            방금 <strong className="text-[#333] dark:text-white">{liveDonations[currentDonation].donor}</strong>님이{" "}
            <strong className="text-[#FF6B6B]">{liveDonations[currentDonation].creator}</strong>님에게{" "}
            도넛 {liveDonations[currentDonation].amount / 1000}개를 선물했어요!
          </span>
        </motion.div>
      </div>

      {/* 히어로 섹션 - 3D 편지봉투 */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-16 overflow-hidden paper-bg dark:bg-gray-900">
        {/* 배경 데코 - 떨어지는 포스트잇 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-12 h-12 shadow-md opacity-40 ${['bg-[#FFFACD]', 'bg-[#FFE4E1]', 'bg-[#E6F3FF]'][i % 3]}`}
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, 20, 0],
                rotate: [Math.random() * -10, Math.random() * 10, Math.random() * -10]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/50 rotate-3" />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="mb-12 scale-110 md:scale-125">
            <EnvelopeHero />
          </div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-[#333] dark:text-white font-hand"
            variants={fadeInUp}
          >
            당신의 글이<br />
            누군가에게는 <span className="text-[#FF6B6B] underline-hand">영감</span>이 되었습니다
          </motion.h1>

          <motion.p
            className="text-xl text-[#666] dark:text-gray-400 max-w-xl mx-auto mb-12 font-sans leading-relaxed"
            variants={fadeInUp}
          >
            돈이 아닌 온기를 보냅니다.<br />
            10초 만에 <b>따뜻한 쪽지</b>와 함께 마음을 전하세요.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={fadeInUp}
          >
            {/* 마스킹 테이프 스타일 버튼 */}
            <Link
              href="/auth"
              className="relative group"
            >
              <div className="absolute inset-0 bg-[#FFD95A] rotate-1 group-hover:rotate-2 transition-transform rounded-sm shadow-md"
                style={{ clipPath: 'polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%)' }} />
              <div className="relative px-10 py-4 bg-[#FFD95A] text-[#333] text-xl font-hand font-bold flex items-center gap-2 hover:-translate-y-1 transition-transform border-2 border-dashed border-[#dcb028]/30">
                <span>🍩 내 우체통 만들기</span>
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-2 backdrop-blur-sm" style={{ clipPath: 'polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)' }} />
            </Link>

            <Link
              href="/donate/demo"
              className="px-8 py-3 text-[#666] font-medium text-lg border-b-2 border-gray-300 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors"
            >
              데모 체험하기 →
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-gray-400 dark:text-gray-500 font-hand text-xl">Scroll Down</span>
        </motion.div>
      </section>

      {/* Problem & Solution 섹션 */}
      <section className="py-24 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <motion.div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-100 rounded-xl p-6 relative">
                <div className="absolute -top-3 left-4 px-3 py-1 bg-gray-400 text-white text-xs rounded-full">
                  Before
                </div>
                <div className="space-y-3 mt-4">
                  <p className="text-[#666] text-sm">후원 계좌:</p>
                  <div className="bg-white p-3 rounded border font-mono text-sm text-[#999]">
                    3333-04-1234567 카카오뱅크...
                  </div>
                  <p className="text-xs text-[#999]">복사하기도 귀찮고, 왜 이렇게 복잡하죠?</p>
                </div>
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#FFFACD] rounded-xl p-6 relative shadow-lg">
                <div className="absolute -top-3 left-4 px-3 py-1 bg-[#FF6B6B] text-white text-xs rounded-full">
                  After ✨
                </div>
                <div className="space-y-3 mt-4">
                  <p className="text-[#666] text-sm">도노트 위젯 클릭 한 번으로:</p>
                  <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-dashed border-[#FFD95A] flex items-center gap-3">
                    <span className="text-2xl">🍩</span>
                    <div>
                      <div className="text-xs text-[#999]">To. 개발자민수</div>
                      <div className="font-bold text-[#333]">커피 한 잔 ☕</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#FF6B6B]">💌 감성적인 편지지로 마음을 전달!</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-24 px-6 bg-[#F9F9F9] dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333] dark:text-white">왜 도노트인가요?</h2>
            <p className="text-lg text-[#666] dark:text-gray-400">간단하지만 따뜻한 세 가지 이유</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "📝",
                title: "쪽지처럼 간편하게",
                description: "회원가입 없이 닉네임만 적으면 끝. 토스페이로 3초 결제.",
                color: "bg-[#FFFACD]"
              },
              {
                emoji: "💌",
                title: "편지처럼 따뜻하게",
                description: "단순 송금이 아닌 정성 담긴 메시지. 크리에이터의 하루가 특별해져요.",
                color: "bg-[#FFE4E1]"
              },
              {
                emoji: "🎫",
                title: "위젯으로 바이럴하게",
                description: "블로그, 깃허브, SNS 어디든. 예쁜 티켓 배지로 후원 유도.",
                color: "bg-[#E6F3FF]"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`relative p-8 ${feature.color} rounded-xl shadow-md hover:-translate-y-2 transition-all cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ transform: `rotate(${index === 1 ? 0 : (index === 0 ? -2 : 2)}deg)` }}
                whileHover={{ rotate: 0 }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/70 rounded shadow-sm"></div>
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-bold mb-2 text-[#333] dark:text-white">{feature.title}</h3>
                <p className="text-[#666] dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 크리에이터 갤러리 */}
      <section className="py-24 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333] dark:text-white">이미 많은 크리에이터가 함께해요</h2>
            <p className="text-lg text-[#666] dark:text-gray-400">개발자, 디자이너, 작가들의 커스텀 위젯</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "개발자 민수", widget: "🍩 커피 한 잔", color: "bg-[#FFD95A]" },
              { name: "디자이너 수지", widget: "🎨 아이패드 충전", color: "bg-[#FF6B6B]" },
              { name: "작가 철수", widget: "📚 책 한 권", color: "bg-[#333]" },
              { name: "영상 영희", widget: "🎬 편집비 후원", color: "bg-white" },
            ].map((creator, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`${creator.color} rounded-xl p-4 shadow-md mb-3 ${creator.color === 'bg-[#333]' ? 'text-white' : 'text-[#333]'} ${creator.color === 'bg-white' ? 'border border-gray-200' : ''}`}>
                  <span className="font-medium text-sm">{creator.widget}</span>
                </div>
                <p className="text-sm text-[#666] dark:text-gray-400">{creator.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 섹션 */}
      <section className="py-24 px-6 bg-[#FFFACD] dark:bg-yellow-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333] dark:text-white">
              도노트 수수료 <span className="text-[#FF6B6B]">5%</span>
            </h2>
            <p className="text-lg text-[#666] dark:text-gray-300 mb-8">
              투명한 수수료 정책으로 운영됩니다.<br />
              <span className="text-2xl font-bold text-[#333] dark:text-white">후원금의 95%가 크리에이터에게 전달됩니다.</span> 💸
            </p>

            <div className="inline-block bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-[#999] dark:text-gray-500 mb-2">플랫폼 수수료</p>
                <p className="text-6xl font-bold text-[#FF6B6B] mb-4">5%</p>
                <p className="text-green-500 font-bold text-xl">
                  크리에이터 수령: 95%
                </p>
              </div>
            </div>

            <p className="text-sm text-[#999] dark:text-gray-500 mt-6">
              * 별도 PG 수수료(약 3%)가 추가로 발생할 수 있습니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="relative p-12 bg-[#FFF8E7] dark:bg-gray-800 rounded-2xl shadow-xl text-center border-2 border-[#E8D5B7] dark:border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute -top-3 left-10 w-20 h-5 bg-[#FFFACD]/80 dark:bg-yellow-900/50 rounded transform -rotate-3 shadow-sm"></div>
            <div className="absolute -top-3 right-10 w-20 h-5 bg-[#FFE4E1]/80 dark:bg-red-900/50 rounded transform rotate-3 shadow-sm"></div>

            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              🍩
            </motion.div>

            <h2 className="text-3xl font-bold mb-4 text-[#333] dark:text-white">
              지금 내 우체통을 만들어보세요
            </h2>
            <p className="text-lg text-[#666] dark:text-gray-400 mb-8">
              3초면 시작할 수 있어요. 소셜 로그인만 하면 끝!
            </p>

            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg hover:bg-[#FF5252] transition-all shadow-md"
            >
              <span>무료로 시작하기</span>
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 공통 푸터 */}
      <Footer />
    </div>
  );
}
