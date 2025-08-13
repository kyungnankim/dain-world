// src/App.jsx
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

const dainInfo = {
  birthday: "2024-09-23",
  dolPartyDate: "2025-09-13",
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState("main");

  const isMobile = () => window.innerWidth <= 768;

  const showGame = () => setCurrentView("game");
  const showVideo = () => setCurrentView("video");
  const showMonthlyPhotos = () => setCurrentView("monthly");
  const showMain = () => setCurrentView("main");

  const renderCurrentView = () => {
    switch (currentView) {
      case "game":
        return <FeedingGame onBack={showMain} />;
      case "video":
        return <VideoGallery onBack={showMain} />;
      case "monthly":
        return <MonthlyPhotos onBack={showMain} />;
      case "main":
      default:
        return (
          <>
            {showWelcome && isMobile() && (
              <Welcome
                partyDate={dainInfo.dolPartyDate}
                onEnter={() => setShowWelcome(false)}
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
              {/* 최신 사진 모아보기 API 불러오기 */}
            </div>
          </>
        );
    }
  };

  return (
    <>
      {renderCurrentView()}
      <FloatingButtons
        onGoToMain={showMain}
        onVideoClick={showVideo}
        onMonthlyPhotosClick={showMonthlyPhotos}
      />
    </>
  );
}

export default App;
