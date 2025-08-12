import React, { useState } from "react";
import "./App.css";
import Welcome from "./components/Welcome";
import Profile from "./components/Profile";
import Anniversary from "./components/Anniversary";
import Doljanchi from "./components/Doljanchi";
import PhotoGallery from "./components/PhotoGallery";
import TodayFortune from "./components/TodayFortune";

// ImageKit.io 설정
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/duixwrddg";

const totalPhotos = 150;
const dainPhotos = [];

// ImageKit.io 변환 파라미터를 사용해 이미지 최적화
for (let i = 1; i <= totalPhotos; i++) {
  dainPhotos.push({
    // 기존 URL (호환성 유지)
    url: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg`,
    // 썸네일용 (갤러리 리스트에서 사용) - 300x300, 품질 60, WebP 포맷
    thumbnailUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg?tr=w-300,h-300,c-at_max,q-60,f-webp`,
    // 상세보기용 (모달에서 사용) - 600x600, 품질 70, WebP 포맷
    fullUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg?tr=w-600,h-600,c-at_max,q-70,f-webp`,
    // 운세용 (작은 이미지) - 150x150, 품질 50, WebP 포맷
    fortuneUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_${i}.jpg?tr=w-150,h-150,c-at_max,q-50,f-webp`,
    // 배경용 (흐릿한 효과) - 100x100, 품질 30, WebP 포맷
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

  // 모바일 체크 함수
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  // 환영 화면 닫기
  const handleEnterSite = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {/* 모바일에서만 환영 화면 표시 */}
      {showWelcome && isMobile() && (
        <Welcome partyDate={dainInfo.dolPartyDate} onEnter={handleEnterSite} />
      )}

      <div className="container">
        <h1>♡ 최다인 월드 ♡</h1>

        <Profile birthday={dainInfo.birthday} />
        <Anniversary birthday={dainInfo.birthday} />
        <Doljanchi partyDate={dainInfo.dolPartyDate} />
        <PhotoGallery photos={dainPhotos} />
        <TodayFortune photos={dainPhotos} />
      </div>
    </>
  );
}

export default App;
