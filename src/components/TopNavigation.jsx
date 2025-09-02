// src/components/TopNavigation.jsx
import React from "react";

const TopNavigation = ({
  activeView,
  onGoToMain,
  onVideoClick,
  onGalleryClick,
  onGameClick,
}) => {
  return (
    <div className="top-navigation">
      {/* activeView에 따라 '뒤로가기' 버튼 또는 '돌잔치' 로고를 표시 */}
      {activeView !== "main" ? (
        <div className="top-nav-item" onClick={onGoToMain}>
          <div className="top-nav-text">뒤로가기</div>
        </div>
      ) : (
        <div className="top-nav-item logo-item"></div>
      )}

      <div
        className={`top-nav-item ${activeView === "main" ? "active" : ""}`}
        onClick={onGoToMain}
      >
        <div className="top-nav-text">메인</div>
      </div>

      <div
        className={`top-nav-item ${activeView === "game" ? "active" : ""}`}
        onClick={onGameClick}
      >
        <div className="top-nav-text">게임</div>
      </div>

      <div
        className={`top-nav-item ${activeView === "gallery" ? "active" : ""}`}
        onClick={onGalleryClick}
      >
        <div className="top-nav-text">갤러리</div>
      </div>

      <div
        className={`top-nav-item ${activeView === "video" ? "active" : ""}`}
        onClick={onVideoClick}
      >
        <div className="top-nav-text">동영상</div>
      </div>
    </div>
  );
};

export default TopNavigation;
