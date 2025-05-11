"use client"
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* 최상단 유저 메뉴 */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="container mx-auto px-4 py-1 flex justify-end items-center space-x-4 text-xs text-gray-600">
          <Link href="/login" className="hover:text-amber-700">로그인</Link>
          <span className="h-3 w-px bg-gray-300 mx-1"></span>
          <Link href="/mypage" className="hover:text-amber-700">마이페이지</Link>
          <span className="h-3 w-px bg-gray-300 mx-1"></span>
          <Link href="/admin" className="hover:text-amber-700">관리자모드</Link>
        </div>
      </div>
      {/* 모바일 유저 메뉴 */}
      <div className="md:hidden border-b border-gray-100">
        <div className="container mx-auto px-4 py-1 flex justify-end items-center space-x-3 text-xs text-gray-600">
          <Link href="/login" className="hover:text-amber-700">로그인</Link>
          <Link href="/mypage" className="hover:text-amber-700">마이페이지</Link>
          <Link href="/admin" className="hover:text-amber-700">관리자모드</Link>
        </div>
      </div>
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/sekang-hospital-logo.png"
              alt="세강병원 SEKANG HOSPITAL"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
        </div>
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="text-gray-800 hover:text-amber-700 font-medium">
            SEROUM소개
          </Link>
          <Link href="#" className="text-gray-800 hover:text-amber-700 font-medium">
            수액센터
          </Link>
          <Link href="#" className="text-gray-800 hover:text-amber-700 font-medium">
            비만센터
          </Link>
          <Link href="#" className="text-gray-800 hover:text-amber-700 font-medium">
            고객후기
          </Link>
          <Link href="#" className="text-gray-800 hover:text-amber-700 font-medium">
            게시판
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-gray-900">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-gray-700 hover:text-gray-900 hidden md:block">
            <ShoppingBag className="h-5 w-5" />
          </button>
          <button
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {/* 모바일 유저 메뉴 */}
              <Link
                href="/login"
                className="text-gray-800 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                href="/mypage"
                className="text-gray-800 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                마이페이지
              </Link>
              <Link
                href="/admin"
                className="text-gray-800 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                관리자모드
              </Link>
              <Link
                href="/about"
                className="text-gray-800 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                SEROUM소개
              </Link>
              <Link
                href="#"
                className="text-gray-800 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                수액센터
              </Link>
              <Link
                href="#"
                className="text-gray-800 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                비만센터
              </Link>
              <Link
                href="#"
                className="text-gray-800 hover:text-amber-700 font-medium py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                고객후기
              </Link>
              <Link
                href="#"
                className="text-gray-800 hover:text-amber-700 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                게시판
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 