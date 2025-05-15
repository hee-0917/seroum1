"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Instagram, Youtube } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function LandingPage() {
  const sections = [
    {
      title: "수액센터",
      image: "/ChatGPT Image 2025년 4월 29일 오전 11_17_42.png",
      description: "맞춤형 수액 처방으로 건강한 아름다움을 찾아드립니다",
      link: "/main"
    },
    {
      title: "비만센터",
      image: "/slimbody1.png",
      description: "체계적인 비만 관리로 건강한 체형을 만들어드립니다",
      link: "/main"
    },
    {
      title: "탈모센터",
      image: "/modern-hair-clinic.png",
      description: "전문적인 탈모 관리로 건강한 두피를 되찾아드립니다",
      link: "/main"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[25vh] flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/iv-logo.jpg"
            alt="SEROUM 배경"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        
        {/* 로고 및 텍스트 */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2">SEROUM</h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              건강한 아름다움을 위한 프리미엄 클리닉
            </p>
          </motion.div>
        </div>
      </section>

      {/* 섹션 그리드 */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Link href={section.link} className="block group">
                  <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-30" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-3xl font-bold mb-4">{section.title}</h3>
                      <p className="text-lg opacity-90">{section.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
