// App.jsx
import React, { useState, useEffect } from "react";
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

// ImageKit.io 설정
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/duixwrddg";
const IMAGEKIT_PUBLIC_KEY = "public_PO9wgsuTkYFHxrx7EBEzfgciU48=";

// ImageKit에서 폴더별 파일 목록을 가져오는 함수
const fetchPhotosFromImageKit = async () => {
  try {
    const allPhotos = [];
    console.log("ImageKit에서 사진 데이터를 가져오는 중...");

    // 1월부터 12월까지 각 폴더에서 이미지 가져오기
    for (let month = 1; month <= 12; month++) {
      try {
        const folderPath = `/dain-world/${month}월/`;
        console.log(`${month}월 폴더 조회 중:`, folderPath);

        // ImageKit API를 사용하여 파일 목록 조회
        const response = await fetch(
          `https://api.imagekit.io/v1/files?path=${encodeURIComponent(
            folderPath
          )}`,
          {
            headers: {
              Authorization: `Basic ${btoa(IMAGEKIT_PUBLIC_KEY + ":")}`,
            },
          }
        );

        if (response.ok) {
          const files = await response.json();
          console.log(`${month}월 폴더 파일 개수:`, files.length);

          // 이미지 파일만 필터링하고 포맷 변환
          const monthPhotos = files
            .filter(
              (file) =>
                file.type === "file" &&
                /\.(jpg|jpeg|png|webp)$/i.test(file.name)
            )
            .map((file) => ({
              id: file.fileId,
              month: month,
              url: file.url,
              thumbnailUrl: `${file.url}?tr=w-300,h-300,c-at_max,q-60,f-webp`,
              fullUrl: `${file.url}?tr=w-600,h-600,c-at_max,q-70,f-webp`,
              fortuneUrl: `${file.url}?tr=w-150,h-150,c-at_max,q-50,f-webp`,
              alt: file.name,
              name: file.name,
              createdAt: file.createdAt,
            }));

          allPhotos.push(...monthPhotos);
          console.log(`${month}월 이미지 추가됨:`, monthPhotos.length, "장");
        } else {
          console.warn(
            `${month}월 폴더 조회 실패:`,
            response.status,
            response.statusText
          );
        }
      } catch (monthError) {
        console.error(`${month}월 폴더 처리 중 오류:`, monthError);
      }
    }

    console.log("총 로드된 사진 개수:", allPhotos.length);
    return allPhotos;
  } catch (error) {
    console.error("ImageKit에서 사진을 가져오는 중 오류 발생:", error);

    // 에러 발생시 임시 더미 데이터 반환 (테스트용)
    return [
      {
        id: "dummy-1",
        month: 1,
        url: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_1.jpg`,
        thumbnailUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_1.jpg?tr=w-300,h-300,c-at_max,q-60,f-webp`,
        fullUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_1.jpg?tr=w-600,h-600,c-at_max,q-70,f-webp`,
        fortuneUrl: `${IMAGEKIT_URL_ENDPOINT}/dain-world/dain_1.jpg?tr=w-150,h-150,c-at_max,q-50,f-webp`,
        alt: "dummy photo",
        name: "dain_1.jpg",
        createdAt: new Date().toISOString(),
      },
    ];
  }
};

const dainInfo = {
  birthday: "2024-09-23",
  dolPartyDate: "2025-09-13",
};

function App() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState("main");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트시 ImageKit에서 사진 로드
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("사진 로딩 시작...");
        const photos = await fetchPhotosFromImageKit();
        console.log("로드된 사진들:", photos);
        setAllPhotos(photos);

        if (photos.length === 0) {
          setError("사진이 없거나 로드에 실패했습니다.");
        }
      } catch (error) {
        console.error("사진 로드 실패:", error);
        setError("사진을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const isMobile = () => window.innerWidth <= 768;
  const handleEnterSite = () => setShowWelcome(false);

  const showGame = () => setCurrentView("game");
  const showVideo = () => setCurrentView("video");
  const showMonthlyPhotos = () => setCurrentView("monthly");
  const showMain = () => setCurrentView("main");

  // 사진 추가 함수
  const handlePhotoAdd = (newPhoto) => {
    console.log("새 사진 추가:", newPhoto);
    setAllPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
  };

  // 사진 삭제 함수
  const handlePhotoDelete = (photoIdsToDelete) => {
    console.log("사진 삭제:", photoIdsToDelete);
    setAllPhotos((prevPhotos) =>
      prevPhotos.filter((p) => !photoIdsToDelete.includes(p.id))
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "game":
        return <FeedingGame onBack={showMain} />;
      case "video":
        return <VideoGallery onBack={showMain} />;
      case "monthly":
        return (
          <MonthlyPhotos
            onBack={showMain}
            photos={allPhotos}
            onAddPhoto={handlePhotoAdd}
            onDeletePhotos={handlePhotoDelete}
          />
        );
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

              {/* 로딩 및 에러 상태 표시 */}
              {isLoading && (
                <div
                  className="card"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <p>사진을 불러오는 중...</p>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid #f3f3f3",
                      borderTop: "2px solid #ff69b4",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "10px auto",
                    }}
                  ></div>
                </div>
              )}

              {error && (
                <div
                  className="card"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    backgroundColor: "#ffebee",
                    color: "#c62828",
                  }}
                >
                  <p>⚠️ {error}</p>
                  <button
                    className="fortune-btn"
                    onClick={() => window.location.reload()}
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {/* 사진 개수 표시 */}
              {!isLoading && !error && (
                <div
                  className="card"
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    backgroundColor: "#f0f8ff",
                    marginBottom: "20px",
                  }}
                >
                  <p>
                    📸 총 <strong>{allPhotos.length}</strong>장의 사진이
                    로드되었습니다!
                  </p>
                </div>
              )}

              <div
                className="card"
                style={{ marginTop: "20px", backgroundColor: "#fff0f5" }}
              >
                <h2>✨ 다인이 맘마주기 게임 ✨</h2>
                <p>다인이에게 맛있는 맘마를 주세요!</p>
                <button className="fortune-btn" onClick={showGame}>
                  게임 시작하기
                </button>
              </div>

              {/* 사진이 있을 때만 PhotoGallery와 TodayFortune 표시 */}
              {allPhotos.length > 0 ? (
                <>
                  <PhotoGallery photos={allPhotos} />
                  <TodayFortune photos={allPhotos} />
                </>
              ) : (
                !isLoading && (
                  <div
                    className="card"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    <h3>📷 아직 사진이 없어요</h3>
                    <p>월별 사진 갤러리에서 첫 번째 사진을 추가해보세요!</p>
                    <button className="fortune-btn" onClick={showMonthlyPhotos}>
                      사진 추가하러 가기
                    </button>
                  </div>
                )
              )}
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
