// src/App.jsx
import React, { useMemo, useState, useEffect } from "react";
import "./App.css"; // 스타일 파일 가져오기

// 컴포넌트들 가져오기
import Profile from "./components/Profile";
import Anniversary from "./components/Anniversary";
import Doljanchi from "./components/Doljanchi";
import PhotoGallery from "./components/PhotoGallery";
import TodayFortune from "./components/TodayFortune";

// 화면이 모바일인지 확인하는 간단한 커스텀 훅
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

// 떠다니는 이미지 효과를 위한 컴포넌트
const FloatingImages = ({ photos, count = 15, isMobile }) => {
  const floatingItems = useMemo(() => {
    if (!photos || photos.length === 0) return [];

    return Array.from({ length: count }).map((_, index) => {
      const photo = photos[Math.floor(Math.random() * photos.length)];

      // 모바일일 경우 이미지 크기를 작게 조절
      const minSize = isMobile ? 30 : 50;
      const maxSize = isMobile ? 80 : 120;

      const style = {
        left: `${Math.random() * 95}vw`,
        top: `${Math.random() * 95}vh`,
        width: `${Math.random() * (maxSize - minSize) + minSize}px`,
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
  }, [photos, count, isMobile]);

  return <div className="floating-image-container">{floatingItems}</div>;
};

// ------------------- ▼▼▼ 여기를 수정하세요 ▼▼▼ -------------------

// 1. public/images 폴더에 있는 jpg 사진의 총 개수를 적어주세요.
const totalJpgPhotos = 150;
// 2. public/img 폴더에 있는 png 사진의 총 개수를 적어주세요.
const totalPngPhotos = 8;

// 갤러리/운세용 JPG 사진 목록 생성 (/images/ 폴더)
const jpgPhotos = [];
for (let i = 1; i <= totalJpgPhotos; i++) {
  jpgPhotos.push({
    url: `/images/dain_${i}.jpg`,
    alt: `다인이 사진 ${i}`,
  });
}

// 배경에 떠다니는 PNG 사진 목록 생성 (/img/ 폴더)
const pngPhotos = [];
for (let i = 1; i <= totalPngPhotos; i++) {
  pngPhotos.push({
    url: `/img/dain_${i}.png`,
    alt: `떠다니는 다인이 사진 ${i}`,
  });
}

const dainInfo = {
  birthday: "2024-09-23",
  dolPartyDate: "2025-09-13",
};

// ------------------- ▲▲▲ 수정 영역 끝 ▲▲▲ -------------------

function App() {
  const isMobile = useIsMobile();
  // 모바일일 경우 사진 개수를 7개로, 데스크톱일 경우 15개로 설정
  const floatingImageCount = isMobile ? 7 : 15;

  return (
    <>
      {/* 배경 효과에는 png 사진 목록과 모바일 여부, 사진 개수를 전달합니다. */}
      <FloatingImages
        photos={pngPhotos}
        count={floatingImageCount}
        isMobile={isMobile}
      />

      <div className="container">
        <h1>♡ 최다인 월드 ♡</h1>

        <Profile birthday={dainInfo.birthday} />
        <Anniversary birthday={dainInfo.birthday} />
        <Doljanchi partyDate={dainInfo.dolPartyDate} />

        {/* 사진첩에는 jpg 사진 목록을 전달합니다. */}
        <PhotoGallery photos={jpgPhotos} />

        {/* 오늘의 운세에는 jpg 사진 개수를 전달합니다. */}
        <TodayFortune totalPhotos={totalJpgPhotos} />
      </div>
    </>
  );
}

export default App;
