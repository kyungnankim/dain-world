// App.jsx - 최종 수정본
import React, { useState } from "react";
import "./App.css";
import Welcome from "./components/Welcome";
import Profile from "./components/Profile";
import Anniversary from "./components/Anniversary";
import Doljanchi from "./components/Doljanchi";
import PhotoGallery from "./components/PhotoGallery";
import TodayFortune from "./components/TodayFortune";
import FeedingGame from "./components/FeedingGame";
import FloatingButtons from "./components/FloatingButtons";
import VideoGallery from "./components/VideoGallery";
import MonthlyPhotos from "./components/MonthlyPhotos";

// ImageKit.io 및 dainPhotos 설정
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/duixwrddg";
const totalPhotos = 150;
const dainPhotos = [];
for (let i = 1; i <= totalPhotos; i++) {
  dainPhotos.push({
    url: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg`,
    thumbnailUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg?tr=w-300,h-300,c-at_max,q-60,f-webp`,
    fullUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg?tr=w-600,h-600,c-at_max,q-70,f-webp`,
    fortuneUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg?tr=w-150,h-150,c-at_max,q-50,f-webp`,
    bgUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg?tr=w-100,h-100,c-at_max,q-30,f-webp,bl-3`,
    alt: `다인이 사진 ${i}`,
  });
}

const dainInfo = {
  birthday: "2024-09-23",
  dolPartyDate: "2025-09-13",
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState("main"); // 'main', 'game', 'video', 'monthly'

  const isMobile = () => window.innerWidth <= 768;

  const handleEnterSite = () => {
    setShowWelcome(false);
  };

  // --- 네비게이션 함수들 (빠진 부분 추가) ---
  const showGame = () => setCurrentView("game");
  const showVideo = () => setCurrentView("video");
  const showMonthlyPhotos = () => setCurrentView("monthly");
  const showMain = () => setCurrentView("main");

  // 현재 뷰에 따른 렌더링
  const renderCurrentView = () => {
    switch (currentView) {
      case "game":
        return <FeedingGame onBack={showMain} />;

      case "video":
        return <VideoGallery onBack={showMain} />;

      case "monthly":
        return <MonthlyPhotos onBack={showMain} photos={dainPhotos} />;

      case "main":
      default:
        return (
          <>
            {showWelcome && isMobile() && (
              <Welcome
                partyDate={dainInfo.dolPartyDate}
                onEnter={handleEnterSite}
              />
            )}
            <div className="container">
              <h1>♡ 최다인 월드 ♡</h1>
              <Profile birthday={dainInfo.birthday} />
              <Anniversary birthday={dainInfo.birthday} />
              <Doljanchi partyDate={dainInfo.dolPartyDate} />
              <div
                className="card"
                style={{ marginTop: "40px", backgroundColor: "#fff0f5" }}
              >
                <h2>✨ 다인이 맘마주기 게임 ✨</h2>
                <p>다인이에게 맛있는 맘마를 주세요!</p>
                <button className="fortune-btn" onClick={showGame}>
                  게임 시작하기
                </button>
              </div>
              <PhotoGallery photos={dainPhotos} />
              <TodayFortune photos={dainPhotos} />
            </div>
          </>
        );
    }
  };

  // --- 최종 return 문 (빠진 부분 추가) ---
  return (
    <>
      {/* 화면 전환이 일어나는 부분 */}
      {renderCurrentView()}

      {/* FloatingButtons를 여기에 두면 어떤 화면에서도 항상 보입니다. */}
      <FloatingButtons
        onGoToMain={showMain}
        onVideoClick={showVideo}
        onMonthlyPhotosClick={showMonthlyPhotos}
      />
    </>
  );
}

export default App;
