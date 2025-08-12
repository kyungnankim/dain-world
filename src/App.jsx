import React, { useMemo } from "react";
import "./App.css";
import Profile from "./components/Profile";
import Anniversary from "./components/Anniversary";
import Doljanchi from "./components/Doljanchi";
import PhotoGallery from "./components/PhotoGallery";
import TodayFortune from "./components/TodayFortune";

// ✨ 떠다니는 이미지 효과를 위한 새 컴포넌트
/*
const FloatingImages = ({ photos, count = 8 }) => {
  // useMemo를 사용해 이미지 목록이 불필요하게 다시 생성되는 것을 방지합니다.
  const floatingItems = useMemo(() => {
    if (!photos || photos.length === 0) {
      return [];
    }

    // count 만큼의 배열을 만들어서 각 아이템에 랜덤 스타일을 적용합니다.
    return Array.from({ length: count }).map((_, index) => {
      // 전체 사진 중에서 랜덤으로 하나를 선택합니다.
      const photo = photos[Math.floor(Math.random() * photos.length)];
      const style = {
        // 화면의 랜덤한 위치에 배치 (vw: 화면 너비, vh: 화면 높이)
        left: `${Math.random() * 95}vw`,
        top: `${Math.random() * 95}vh`,
        // 이미지 크기도 랜덤으로 조절
        width: `${Math.random() * (120 - 50) + 50}px`,
        // 애니메이션 시간과 시작 지연을 랜덤으로 줘서 자연스럽게 만듭니다.
        animationDuration: `${Math.random() * (30 - 15) + 15}s`,
        animationDelay: `${Math.random() * 10}s`,
      };

      return (
        <img
          key={index}
          src={photo.url}
          alt="떠다니는 다인이 사진"
          className="floating-image"
          style={style}
        />
      );
    });
  }, [photos, count]);

  return <div className="floating-image-container">{floatingItems}</div>;
};
*/

const totalPhotos = 150;

const dainPhotos = [];
for (let i = 1; i <= totalPhotos; i++) {
  dainPhotos.push({
    url: `/images/dain_${i}.jpg`,
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
      {/*--  <FloatingImages photos={dainPhotos} /> */}
      <div className="container">
        <h1>♡ 최다인 월드 ♡</h1>

        <Profile birthday={dainInfo.birthday} />
        <Anniversary birthday={dainInfo.birthday} />
        <Doljanchi partyDate={dainInfo.dolPartyDate} />
        <PhotoGallery photos={dainPhotos} />
        <TodayFortune totalPhotos={totalPhotos} />
      </div>
    </>
  );
}

export default App;
