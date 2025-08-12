// 파일 상단에 필요한 것들을 import 합니다.
import React, { useState } from "react";
import "./App.css";
import Welcome from "./components/Welcome";
import Profile from "./components/Profile";
import Anniversary from "./components/Anniversary";
import Doljanchi from "./components/Doljanchi";
import PhotoGallery from "./components/PhotoGallery";
import TodayFortune from "./components/TodayFortune";
import FeedingGame from "./components/FeedingGame"; // ◀◀◀ 새로 만든 게임 컴포넌트 import

// ... (기존 ImageKit.io 및 dainPhotos 설정 코드는 그대로 둡니다)

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

// App 함수를 아래와 같이 수정합니다.
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGame, setShowGame] = useState(false); // ◀◀◀ 게임 화면 표시 여부 상태 추가

  const isMobile = () => window.innerWidth <= 768;

  const handleEnterSite = () => {
    setShowWelcome(false);
  };

  // 게임 화면을 보여주는 함수
  const handleShowGame = () => {
    setShowGame(true);
  };

  // 메인 화면으로 돌아오는 함수
  const handleBackToMain = () => {
    setShowGame(false);
  };

  // 만약 게임 화면이 보여야 한다면 게임 컴포넌트만 렌더링합니다.
  if (showGame) {
    return <FeedingGame onBack={handleBackToMain} />;
  }

  return (
    <>
      {showWelcome && isMobile() && (
        <Welcome partyDate={dainInfo.dolPartyDate} onEnter={handleEnterSite} />
      )}

      <div className="container">
        <h1>♡ 최다인 월드 ♡</h1>

        <Profile birthday={dainInfo.birthday} />
        <Anniversary birthday={dainInfo.birthday} />
        <Doljanchi partyDate={dainInfo.dolPartyDate} />

        {/* ◀◀◀ 여기에 게임하기 버튼 섹션을 추가합니다. */}
        <div
          className="card"
          style={{ marginTop: "40px", backgroundColor: "#fff0f5" }}
        >
          <h2>✨ 다인이 맘마주기 게임 ✨</h2>
          <p>다인이에게 맛있는 맘마를 주세요!</p>
          <button className="fortune-btn" onClick={handleShowGame}>
            게임 시작하기
          </button>
        </div>

        <PhotoGallery photos={dainPhotos} />
        <TodayFortune photos={dainPhotos} />
      </div>
    </>
  );
}

export default App;
