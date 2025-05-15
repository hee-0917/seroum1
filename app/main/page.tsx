"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Instagram, Youtube } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import DraggablePopup from "../components/DraggablePopup"

export default function MainPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState<{
    imageUrl: string;
    isActive: boolean;
    title: string;
  } | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mouseStart = useRef({ x: 0, y: 0 });

  // 팝업 설정 로드
  useEffect(() => {
    const fetchPopupConfig = async () => {
      try {
        console.log('Fetching popup config...')
        const response = await fetch('/api/admin/main-popup')
        const data = await response.json()
        console.log('Received popup data:', data)
        
        if (data && data.imageUrl && data.isActive) {
          console.log('Setting popup config and showing popup')
          setPopupConfig(data)
          setShowPopup(true)
        } else {
          console.log('Popup conditions not met:', {
            hasData: !!data,
            hasImageUrl: !!data?.imageUrl,
            isActive: data?.isActive
          })
        }
      } catch (error) {
        console.error('팝업 설정 로드 실패:', error)
      }
    }

    fetchPopupConfig()
  }, [])

  // 드래그 이벤트 핸들러
  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    dragStart.current = { x: popupPos.x, y: popupPos.y };
    mouseStart.current = { x: e.clientX, y: e.clientY };
    document.body.style.userSelect = "none";
  };
  const onDrag = (e: MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - mouseStart.current.x;
    const dy = e.clientY - mouseStart.current.y;
    setPopupPos({ x: dragStart.current.x + dx, y: dragStart.current.y + dy });
  };
  const onDragEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", onDragEnd);
    } else {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", onDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", onDragEnd);
    };
  }, [dragging]);

  // Hero 섹션 이미지 슬라이드 상태 및 로직 추가
  const images = [
    { src: "/beautiful-face-hero.png", alt: "프리미엄 미용 이미지" },
    { src: "/iv-logo.jpg", alt: "IV 로고" },
    { src: "/PAGE1674.png", alt: "PAGE1674" },
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500); // 3.5초마다 전환
    return () => clearInterval(timer);
  }, []);

  console.log('Current popup state:', { showPopup, popupConfig })

  return (
    <div className="flex flex-col min-h-screen">
      {popupConfig?.imageUrl && showPopup && (
        <DraggablePopup
          isOpen={true}
          onClose={() => setShowPopup(false)}
          imageUrl={popupConfig.imageUrl}
          imageAlt={popupConfig.title}
        />
      )}
      {/* Side Buttons */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col">
          <div className="bg-primary text-primary-foreground p-4 flex flex-col items-center justify-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span className="text-xs writing-mode-vertical transform rotate-0 whitespace-nowrap">RESERVATION</span>
          </div>
          <div className="bg-gray-900 text-white p-4 flex flex-col items-center space-y-6">
            <Link href="https://www.instagram.com/sekanghospital/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="https://www.youtube.com/@SEKANG_HOSPITAL" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <Youtube className="h-5 w-5" />
            </Link>
            <Link href="https://pf.kakao.com/_xaGuxaj" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="12" rx="12" ry="12" fill="#391B1B"/>
                <text x="12" y="15" textAnchor="middle" fill="white" fontWeight="bold" fontSize="8" fontFamily="Arial">TALK</text>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative h-[85vh]">
          {/* 페이드 전환 이미지 */}
          <div className="relative h-[85vh] rounded-lg overflow-hidden">
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={img.src}
                alt={img.alt}
                fill
                className={`object-cover absolute inset-0 transition-opacity duration-1000 z-10 ${
                  idx === current ? "opacity-100" : "opacity-0"
                }${img.src === "/iv-logo.jpg" ? " md:-translate-y-10 -translate-y-5" : ""}`}
                priority={idx === 0}
              />
            ))}
          </div>
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-20 z-15"></div>
          {/* 고정 문구 */}
          <div className="absolute inset-0 flex flex-col justify-end pb-16 px-4 md:px-10 lg:px-20 pointer-events-none z-20">
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-script">SEROUM</h1>
              <p className="text-white text-lg md:text-xl mb-8">건강한 아름다움을 위한 프리미엄 수액 & 비만 솔루션</p>
              <p className="text-gray-200 text-xs">해당 이미지는 AI로 생성되었습니다.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">SEROUM 클리닉 소개</h2>
              <p className="text-gray-600 leading-relaxed">
                SEROUM 클리닉은 수액센터와 비만센터를 운영하며 개인별 맞춤 처방으로<br />
                건강과 아름다움을 위한 최적의 솔루션을 제공합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">수액센터</h3>
                <p className="text-gray-600">
                  개인 맞춤형 수액 처방으로 영양 공급, 피로 회복, 면역력 증진 등 다양한 건강 솔루션을 제공합니다.
                </p>
                <Link
                  href="#"
                  className="inline-block mt-6 text-amber-700 font-medium hover:text-amber-800 transition-colors"
                >
                  자세히 보기 →
                </Link>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">비만센터</h3>
                <p className="text-gray-600">
                  체계적인 비만 관리 프로그램과 맞춤형 비만수액으로 건강한 체중 감량과 체형 관리를 도와드립니다.
                </p>
                <Link
                  href="#"
                  className="inline-block mt-6 text-amber-700 font-medium hover:text-amber-800 transition-colors"
                >
                  자세히 보기 →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEROUM FLUID PROGRAM Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-blue-600 text-lg mb-2">SEROUM FLUID PROGRAM</p>
              <h2 className="text-4xl font-bold mb-10 text-primary">세강 수액 프로그램</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_04.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_05.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_06.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_07.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_08.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_09.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_10.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_11.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_12.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_13.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_14.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_15.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/seroum_fluid_land_16.jpg"
                  alt="세로움 수액 프로그램"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEROUM SLIMBODY PROGRAM Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-blue-600 text-lg mb-2">SEROUM SLIMBODY PROGRAM</p>
              <h2 className="text-4xl font-bold mb-10 text-primary">비만 프로그램</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg overflow-hidden border-2 border-black">
                <Image
                  src="/slim1.png"
                  alt="세로움 비만 프로그램"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-black">
                <Image
                  src="/slim2.png"
                  alt="세로움 비만 프로그램"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-black">
                <Image
                  src="/slim3.png"
                  alt="세로움 비만 프로그램"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-black">
                <Image
                  src="/slim4.png"
                  alt="세로움 비만 프로그램"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-black">
                <Image
                  src="/slim5.png"
                  alt="세로움 비만 프로그램"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-black">
                <Image
                  src="/slim6.png"
                  alt="세로움 비만 프로그램"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">찾아오시는 길</h2>
              <p className="text-gray-600 leading-relaxed">
                세로움 클리닉은 편리한 위치에 있으며, 쾌적한 환경에서 최상의 서비스를 제공합니다.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
                {/* 지도 이미지 대신 구글 지도 임베드 */}
                <iframe
                  src="https://maps.google.com/maps?q=대구%20달서구%20구마로%20220%205층&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="세로움 클리닉 위치"
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">주소</h3>
                  <p className="text-gray-600">대구 달서구 구마로 220 5층</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">연락처</h3>
                  <p className="text-gray-600">053-620-6175</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">진료시간</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">평일</div>
                    <div className="text-gray-600">9:00 - 18:00</div>
                    <div className="text-gray-600">토요일</div>
                    <div className="text-gray-600">9:00 - 13:00</div>
                    <div className="text-gray-600">일요일/공휴일</div>
                    <div className="text-gray-600">휴진</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">오시는 방법</h3>
                  <p className="text-gray-600">
                    지하철 1호선 서부정류장역 하차 1번 출구로 나와서 본리네거라 방향 도보로 200m거리
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-primary text-white pt-8 pb-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-start space-x-6">
              <Image
                src="/sekang-hospital-logo.png"
                alt="세강병원 SEKANG HOSPITAL"
                width={120}
                height={40}
                className="h-12 w-auto mt-2"
              />
              <div>
                <p className="text-white/90 text-sm leading-relaxed">
                  건강한 아름다움을 위한
                </p>
                <p className="text-white/90 text-base font-bold mt-1 whitespace-nowrap">
                  SEROUM <span className="font-normal">프리미엄 수액 & 비만 클리닉</span>
                </p>
                <div className="flex space-x-2 mt-3">
                  <Link href="#" className="text-white/80 hover:text-yellow-300">
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-white/80 hover:text-yellow-300">
                    <Youtube className="h-5 w-5" />
                  </Link>
                </div>
                <div className="mt-3">
                  <Link href="#" className="text-white/80 hover:text-yellow-300 text-xs">개인정보처리방침</Link>
                  <span className="mx-2 text-white/80">|</span>
                  <Link href="#" className="text-white/80 hover:text-yellow-300 text-xs">이용약관</Link>
                </div>
              </div>
            </div>
            <div className="text-white/90 text-lg md:text-xl font-semibold space-y-2 md:text-right md:mt-0 mt-4">
              <div className="flex items-center"><span className="text-sm md:text-base font-normal mr-2">수액센터</span> <span className="font-bold text-2xl md:text-3xl">053.620.6170</span></div>
              <div className="flex items-center"><span className="text-sm md:text-base font-normal mr-2">비만센터</span> <span className="font-bold text-2xl md:text-3xl">053.620.6175</span></div>
            </div>
          </div>
          <div className="border-t border-[#7B5B36] mt-4 pt-2 text-[10px] text-white/80 text-center">
            <p>(의)일민의료재단 세강병원 | 대표: 김징균 | 사업자등록번호: 145-82-00143</p>
            <p className="mt-1">주소: 대구 달서구 구마로 220 5층 | 대표전화: 053-620-6175</p>
            <p className="mt-2">© {new Date().getFullYear()} SEKANG HOSPITAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 