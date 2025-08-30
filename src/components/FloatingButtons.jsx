// src/components/FloatingButtons.jsx
import React, { useState, useEffect } from "react";

const FloatingButtons = ({ activeView }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let scrollTarget;
    switch (activeView) {
      case "monthly":
        scrollTarget = document.querySelector(".monthly-photos-container");
        break;
      case "video":
        scrollTarget = document.querySelector(".video-gallery-container");
        break;
      default:
        scrollTarget = window;
    }

    if (!scrollTarget) return;

    const handleScroll = (event) => {
      // window와 element의 scrollTop 접근 방식이 다르므로 통일
      const scrollTop = scrollTarget.scrollTop ?? window.pageYOffset;
      setShowScrollTop(scrollTop > 200);
    };

    scrollTarget.addEventListener("scroll", handleScroll);

    return () => scrollTarget.removeEventListener("scroll", handleScroll);
  }, [activeView]);

  const handleScrollToTop = () => {
    let scrollTarget;
    switch (activeView) {
      case "monthly":
        scrollTarget = document.querySelector(".monthly-photos-container");
        break;
      case "video":
        scrollTarget = document.querySelector(".video-gallery-container");
        break;
      default:
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    if (scrollTarget) {
      scrollTarget.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!showScrollTop) return null;

  return (
    <div className="floating-buttons">
      <button
        className="scroll-top-btn"
        onClick={handleScrollToTop}
        title="맨 위로"
      >
        {/* 예쁜 상향 화살표 SVG 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: "20px", height: "20px" }}
        >
          <path d="M12 19V6" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButtons;
