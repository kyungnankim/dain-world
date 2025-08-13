// src/components/FloatingButtons.jsx
import React, { useState, useEffect } from "react";

const FloatingButtons = ({
  onGoToMain, // 메인으로 가는 함수를 위한 prop 추가
  onVideoClick,
  onMonthlyPhotosClick,
  onScrollTop,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 스크롤 위치에 따라 '맨 위로' 버튼 표시/숨김
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      // 페이지가 조금만 내려가도 버튼이 보이도록 300에서 100으로 수정
      setShowScrollTop(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (onScrollTop) onScrollTop();
  };

  return (
    <div className="floating-buttons">
      {/* 메인으로 이동 버튼 (신규 추가, 최상단) */}
      <button
        className="floating-btn go-main-btn"
        onClick={onGoToMain}
        title="메인으로"
      >
        🏠
      </button>

      {/* 월별 사진 갤러리 버튼 */}
      <button
        className="floating-btn monthly-photos-btn"
        onClick={onMonthlyPhotosClick}
        title="월별 사진 갤러리"
      >
        📅
      </button>

      {/* 동영상 갤러리 버튼 */}
      <button
        className="floating-btn video-btn"
        onClick={onVideoClick}
        title="동영상 갤러리"
      >
        🎬
      </button>

      {/* 스크롤 탑 버튼 */}
      {showScrollTop && (
        <button
          className="floating-btn scroll-top-btn"
          onClick={handleScrollToTop}
          title="맨 위로"
        >
          ⬆️
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
