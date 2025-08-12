import React from "react";
import "./App.css";
import Profile from "./components/Profile";
import Anniversary from "./components/Anniversary";
import Doljanchi from "./components/Doljanchi";
import PhotoGallery from "./components/PhotoGallery";
import TodayFortune from "./components/TodayFortune";

// 1. ImageKit.io 정보 설정
// 사용자께서 제공해주신 URL-endpoint로 반영했습니다.
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/duixwrddg";

const totalPhotos = 150;
const dainPhotos = [];

// 2. ImageKit.io URL 형식에 맞게 이미지 주소 생성

for (let i = 1; i <= totalPhotos; i++) {
  dainPhotos.push({
    // 모든 사진의 주소를 '성공하는 주소'로 강제 변경해서 테스트
    url: `https://ik.imagekit.io/duixwrddg/default-dain-world/default.png`,
    alt: `다인이 사진 ${i}`,
  });
}
const dainInfo = {
  birthday: "2024-09-23",
  dolPartyDate: "2025-09-13",
};

function App() {
  return (
    <>
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
