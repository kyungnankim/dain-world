// src/components/FloatingButtons.jsx
import React, { useState, useEffect } from "react";

const FloatingButtons = ({
  onGoToMain,
  onVideoClick,
  onMonthlyPhotosClick,
  activeView,
}) => {
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
      const scrollTop = event.target.scrollTop || window.pageYOffset;
      setShowScrollTop(scrollTop > 100);
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

  return (
    <div className="floating-buttons">
      <button
        className="floating-btn go-main-btn"
        onClick={onGoToMain}
        title="메인으로"
      >
        🏠
      </button>
      <button
        className="floating-btn monthly-photos-btn"
        onClick={onMonthlyPhotosClick}
        title="월별 사진 갤러리"
      >
        📅
      </button>
      <button
        className="floating-btn video-btn"
        onClick={onVideoClick}
        title="동영상 갤러리"
      >
        🎬
      </button>
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
