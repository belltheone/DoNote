"use client";
// 랜딩페이지 - 도노트 메인 페이지 (고도화 버전)
// 인터랙티브 스토리텔링 + 실시간 후원 티커

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
    <div ref={containerRef} className="min-h-screen bg-[#F9F9F9]">
      {/* 공통 헤더 */}
      <Header />

      {/* 실시간 후원 티커 */}
      <div className="fixed top-20 left-0 right-0 z-40 overflow-hidden bg-[#FFFACD]/80 backdrop-blur-sm py-2">
        <motion.div
          className="flex items-center justify-center gap-2 text-sm"
          key={currentDonation}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <span className="text-lg">🍩</span>
          <span className="text-[#666]">
            방금 <strong className="text-[#333]">{liveDonations[currentDonation].donor}</strong>님이{" "}
            <strong className="text-[#FF6B6B]">{liveDonations[currentDonation].creator}</strong>님에게{" "}
            도넛 {liveDonations[currentDonation].amount / 1000}개를 선물했어요!
          </span>
        </motion.div>
      </div>

      {/* 히어로 섹션 - 3D 편지봉투 */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 overflow-hidden">
        {/* 배경 데코 - 떨어지는 쪽지들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-16 h-16 rounded shadow-md opacity-30 ${['bg-[#FFFACD]', 'bg-[#FFE4E1]', 'bg-[#E6F3FF]', 'bg-[#E8F5E9]'][i % 4]
                }`}
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${10 + (i % 3) * 30}%`,
                transform: `rotate(${-10 + i * 5}deg)`
              }}
              animate={{
                y: [0, 15, 0],
                rotate: [-10 + i * 5, -5 + i * 5, -10 + i * 5]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* 3D 편지봉투 */}
          <motion.div
            className="relative w-80 h-56 mx-auto mb-12"
            style={{ y: envelopeY, rotate: envelopeRotate, scale: envelopeScale }}
          >
            {/* 봉투 본체 */}
            <div className="absolute inset-0 bg-[#FFF8E7] rounded-xl shadow-2xl border-2 border-[#E8D5B7]">
              {/* 봉투 안쪽 (뚜껑 열리면 보임) */}
              <motion.div
                className="absolute inset-4 bg-white rounded-lg p-4 shadow-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: isEnvelopeOpen ? 1 : 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <motion.span
                    className="text-4xl mb-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    💌
                  </motion.span>
                  <p className="text-sm text-[#666]">마음을 담은 쪽지가<br />도착했습니다</p>
                </div>
              </motion.div>
            </div>

            {/* 봉투 뚜껑 (삼각형) */}
            <motion.div
              className="absolute -top-8 left-0 right-0 h-24 bg-[#F5DEB3] origin-bottom"
              style={{
                clipPath: "polygon(0 100%, 50% 20%, 100% 100%)",
              }}
              animate={{
                rotateX: isEnvelopeOpen ? 180 : 0,
                y: isEnvelopeOpen ? -30 : 0,
              }}
              transition={{ duration: 0.8, delay: 1 }}
            />

            {/* 실링 왁스 */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">🍩</span>
            </motion.div>

            {/* 튀어나오는 도넛과 쪽지들 */}
            {isEnvelopeOpen && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-3xl"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: -80 + i * 40,
                      y: -100 - Math.random() * 50,
                      scale: [0, 1.2, 1, 0.5],
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: 2,
                      delay: 1.5 + i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    {['🍩', '💌', '☕', '💜', '✨'][i]}
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          {/* 타이틀 */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-[#333]"
            variants={fadeInUp}
          >
            당신의 글이<br />
            누군가에게는 <span className="text-[#FF6B6B]">영감</span>이 되었습니다
          </motion.h1>

          {/* 서브 타이틀 */}
          <motion.p
            className="text-lg text-[#666] max-w-xl mx-auto mb-10"
            variants={fadeInUp}
          >
            돈이 아닌 온기를 보냅니다.<br />
            회원가입 없이 10초 만에 따뜻한 쪽지와 함께 후원하세요.
          </motion.p>

          {/* CTA 버튼들 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Link
              href="/auth"
              className="px-8 py-4 bg-[#FFD95A] rounded-xl text-[#333] font-semibold text-lg shadow-md hover:bg-[#FFCE3A] hover:-translate-y-1 transition-all"
            >
              🍩 내 우체통 만들기
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-[#666] font-semibold text-lg hover:border-[#FFD95A] hover:bg-[#FFFACD] transition-all flex items-center justify-center gap-2"
            >
              <span>데모 체험하기</span>
              <span>→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* 스크롤 인디케이터 */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center text-[#999]">
            <span className="text-sm mb-2">스크롤하여 더 알아보기</span>
            <span>↓</span>
          </div>
        </motion.div>
      </section>

      {/* Problem & Solution 섹션 */}
      <section className="py-24 px-6 bg-white">
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
      <section className="py-24 px-6 bg-[#F9F9F9]">
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
                <h3 className="text-xl font-bold mb-2 text-[#333]">{feature.title}</h3>
                <p className="text-[#666] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 크리에이터 갤러리 */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333]">이미 많은 크리에이터가 함께해요</h2>
            <p className="text-lg text-[#666]">개발자, 디자이너, 작가들의 커스텀 위젯</p>
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
                <p className="text-sm text-[#666]">{creator.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 섹션 */}
      <section className="py-24 px-6 bg-[#FFFACD]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333]">
              크리에이터 수수료 <span className="text-[#FF6B6B]">0%</span>
            </h2>
            <p className="text-lg text-[#666] mb-8">
              PG 수수료만 내세요. 플랫폼 수수료는 없습니다.<br />
              대신 후원자가 &quot;도노트에게 커피 한 잔 더&quot; 옵션을 선택하면,<br />
              저희에게도 작은 응원이 됩니다 ☕
            </p>

            <div className="inline-block bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-[#999] mb-1">플랫폼 수수료</p>
                  <p className="text-4xl font-bold text-[#FF6B6B]">0%</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-sm text-[#999] mb-1">PG 수수료</p>
                  <p className="text-4xl font-bold text-[#333]">~3%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="relative p-12 bg-[#FFF8E7] rounded-2xl shadow-xl text-center border-2 border-[#E8D5B7]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute -top-3 left-10 w-20 h-5 bg-[#FFFACD]/80 rounded transform -rotate-3 shadow-sm"></div>
            <div className="absolute -top-3 right-10 w-20 h-5 bg-[#FFE4E1]/80 rounded transform rotate-3 shadow-sm"></div>

            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              🍩
            </motion.div>

            <h2 className="text-3xl font-bold mb-4 text-[#333]">
              지금 내 우체통을 만들어보세요
            </h2>
            <p className="text-lg text-[#666] mb-8">
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
