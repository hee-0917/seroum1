import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="py-28 min-h-screen flex items-center relative overflow-hidden">
      {/* 배경 이미지 */}
      <Image 
        src="/iv-logo2.jpg" 
        alt="SEROUM 배경" 
        fill 
        className="object-cover w-full h-full absolute inset-0 opacity-25 pointer-events-none select-none" 
        priority
      />
      <div className="container mx-auto px-4 flex flex-col items-center justify-center relative z-10">
        {/* 텍스트 영역 */}
        <div className="w-full max-w-2xl text-left">
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#A67C52] mb-6 tracking-tight drop-shadow-sm">BRAND STORY</h2>
          <h3 className="text-3xl md:text-4xl font-semibold text-primary mb-10">세로움 SEROUM</h3>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-bold indent-8">
            <span className="text-[#A67C52] font-bold">‘세로움’</span>은 40년간 임상경험을 바탕으로 기존 의학의 범위를 더욱 넓혀, 건강에 대한 새로운 패러다임을 제시하기 위한 <span className="text-primary font-bold whitespace-nowrap">맞춤형 건강브랜드</span>입니다.
          </p>
        </div>
      </div>
    </section>
  );
} 