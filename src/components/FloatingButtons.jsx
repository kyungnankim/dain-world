// src/components/FloatingButtons.jsx - 스크롤 버튼만
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
      const scrollTop = event.target.scrollTop || window.pageYOffset;
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
        ⬆️
      </button>
    </div>
  );
};

export default FloatingButtons;
