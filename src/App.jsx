// src/App.jsx - 숫자 폴더명으로 API 호출
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

const dainInfo = {
  birthday: "2024-09-23",
  dolPartyDate: "2025-09-13",
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState("main");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("loading"); // loading, success, failed

  const isMobile = () => window.innerWidth <= 768;

  // 모든 월별 사진 불러오기 (숫자 폴더명 사용)
  const loadAllPhotos = async () => {
    try {
      setLoading(true);
      setApiStatus("loading");
      console.log("🔍 API로 사진 로드 시도 (숫자 폴더명)...");

      // 먼저 API 서버가 작동하는지 확인
      const authResponse = await fetch("/api/getImageKitAuth");

      if (!authResponse.ok) {
        throw new Error(`Auth API 실패: ${authResponse.status}`);
      }

      const authData = await authResponse.json();
      console.log("✅ ImageKit 인증 성공:", {
        hasToken: !!authData.token,
        hasPublicKey: !!authData.publicKey,
        urlEndpoint: authData.urlEndpoint,
      });

      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const allPhotos = [];

      for (const month of months) {
        try {
          console.log(`📂 ${month}번 폴더에서 사진 로드 중...`);

          // 숫자 폴더명으로 API 호출
          const response = await fetch(`/api/getMonthlyPhotos?folder=${month}`);

          if (response.ok) {
            const monthPhotos = await response.json();
            console.log(`✅ ${month}번 폴더: ${monthPhotos.length}장 로드`);

            const photosWithMonth = monthPhotos.map((photo, index) => ({
              ...photo,
              month: month,
              id: `api-${month}-${Date.now()}-${index}`,
              name: photo.name || photo.alt || `${month}월 다인이`,
            }));
            allPhotos.push(...photosWithMonth);
          } else {
            console.log(
              `⚠️ ${month}번 폴더: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`❌ ${month}번 폴더 로드 실패:`, error.message);
        }
      }

      if (allPhotos.length > 0) {
        console.log(`🎉 API 성공: 총 ${allPhotos.length}장 로드`);
        setPhotos(allPhotos);
        setApiStatus("success");
      } else {
        throw new Error("API에서 사진을 가져오지 못함");
      }
    } catch (error) {
      console.error("❌ API 전체 실패:", error.message);
      console.log("📭 API 실패 - 사진 없음");
      setPhotos([]);
      setApiStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사진 로드
  useEffect(() => {
    loadAllPhotos();
  }, []);

  const showGame = () => setCurrentView("game");
  const showVideo = () => setCurrentView("video");
  const showMonthlyPhotos = () => setCurrentView("monthly");
  const showMain = () => setCurrentView("main");

  // 사진 추가 핸들러
  const handleAddPhoto = (newPhoto) => {
    setPhotos((prev) => [...prev, newPhoto]);
    console.log("새 사진 추가됨:", newPhoto);
  };

  // 사진 삭제 핸들러
  const handleDeletePhotos = (photoIdsToDelete) => {
    setPhotos((prev) =>
      prev.filter((photo) => !photoIdsToDelete.includes(photo.id))
    );
    console.log("삭제된 사진 IDs:", photoIdsToDelete);
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
            photos={photos}
            onAddPhoto={handleAddPhoto}
            onDeletePhotos={handleDeletePhotos}
          />
        );
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

              {/* 먹이기 게임 */}
              <div
                className="card"
                style={{ marginTop: "40px", backgroundColor: "#fff0f5" }}
              >
                <h2>✨ 다인이 맘마주기 게임 ✨</h2>
                <p>다인이에게 맛있는 맛있는 맘마를 주세요!</p>
                <button className="fortune-btn" onClick={showGame}>
                  게임 시작하기
                </button>
              </div>

              {/* 사진 갤러리 */}
              {loading ? (
                <div className="card">
                  <h2>📸 다인이의 성장 앨범</h2>
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>사진을 불러오는 중... 📷</p>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "10px",
                      }}
                    >
                      API 서버에서 ImageKit 이미지를 가져오고 있습니다
                    </div>
                  </div>
                </div>
              ) : (
                <PhotoGallery photos={photos} />
              )}

              {/* 오늘의 운세 */}
              <TodayFortune photos={photos} />

              {/* API 상태 표시 */}
              <div
                className="card"
                style={{
                  marginTop: "20px",
                  fontSize: "12px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                {apiStatus === "success" && (
                  <p>
                    ✅ <strong>API 연결 성공:</strong> {photos.length}장의 실제
                    ImageKit 사진 로드됨
                  </p>
                )}
                {apiStatus === "failed" && (
                  <div>
                    <p>
                      ⚠️ <strong>API 연결 실패:</strong> 사진을 불러올 수
                      없습니다
                    </p>
                    <p style={{ fontSize: "11px", marginTop: "5px" }}>
                      API 사용하려면: <code>vercel dev</code> 명령어로 서버 실행
                    </p>
                  </div>
                )}
                {apiStatus === "loading" && (
                  <p>
                    🔄 <strong>API 연결 중...</strong>
                  </p>
                )}
              </div>
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
