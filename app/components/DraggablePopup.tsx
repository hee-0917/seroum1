"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface DraggablePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}

export default function DraggablePopup({ isOpen, onClose, imageUrl, imageAlt }: DraggablePopupProps) {
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mouseStart = useRef({ x: 0, y: 0 });

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      {/* 오버레이 클릭 시 닫기 */}
      <div
        className="fixed inset-0 z-[90]"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-xs sm:max-w-md z-[101]"
        style={{ transform: `translate(${popupPos.x}px, ${popupPos.y}px)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div
          className="w-full h-8 cursor-move bg-gradient-to-r from-primary/10 to-primary/20 flex items-center px-4 text-xs text-gray-500 select-none"
          onMouseDown={onDragStart}
          style={{ userSelect: "none" }}
        >
          이벤트 안내
        </div>
        <button
          className="absolute top-2 right-2 z-10 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
          aria-label="팝업 닫기"
        >
          ×
        </button>
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={400}
          height={400}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
} 