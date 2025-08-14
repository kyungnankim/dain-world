// App.jsx - 상태 동기화 강화 버전
import React, { useState, useEffect, useCallback } from "react";
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
import { getAllPhotos } from "./utils/cloudinary";

function App() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 사진을 불러오는 함수 (강화된 버전)
  const fetchCloudinaryPhotos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 Cloudinary에서 사진 불러오기 시작...");
      const photos = await getAllPhotos();

      setAllPhotos(photos);
      console.log("✅ 사진 로드 성공:", photos.length, "장");
      console.log("📋 로드된 사진 데이터:", photos);
    } catch (error) {
      console.error("❌ Cloudinary 사진 로드 실패:", error);
      setError(error.message);
      setAllPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isMobile = () => window.innerWidth <= 768;

  // 앱 시작시 사진 로드
  useEffect(() => {
    if (!isMobile()) {
      fetchCloudinaryPhotos();
    }
  }, [fetchCloudinaryPhotos]);

  const dainInfo = {
    birthday: "2024-09-23",
    dolPartyDate: "2025-09-13",
  };

  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState("main");

  const handleEnterSite = () => {
    setShowWelcome(false);
    fetchCloudinaryPhotos();
  };

  const showGame = () => setCurrentView("game");
  const showVideo = () => setCurrentView("video");
  const showMonthlyPhotos = () => setCurrentView("monthly");
  const showMain = () => setCurrentView("main");

  // ✅ 사진 삭제 핸들러 (강화된 버전)
  const handlePhotoDelete = (photoIdsToDelete) => {
    console.log("🗑️ 사진 삭제 요청:", photoIdsToDelete);
    setAllPhotos((prevPhotos) => {
      const filteredPhotos = prevPhotos.filter(
        (p) => !photoIdsToDelete.includes(p.id)
      );
      console.log(`📊 삭제 후 남은 사진: ${filteredPhotos.length}장`);
      return filteredPhotos;
    });
  };

  // App.jsx

  // ✅ 사진 추가 핸들러 (수정된 버전)
  const handlePhotoAdd = (newPhoto) => {
    console.log("📷 새 사진 추가 요청:", newPhoto);

    // 즉시 상태에 추가하여 UI에 반영
    setAllPhotos((prevPhotos) => {
      // 중복 추가 방지
      if (prevPhotos.find((p) => p.id === newPhoto.id)) {
        return prevPhotos;
      }
      const updatedPhotos = [newPhoto, ...prevPhotos];
      console.log(`📊 추가 후 총 사진: ${updatedPhotos.length}장`);
      return updatedPhotos;
    });
  };
  // ✅ 사진 목록 새로고침 (디버깅 강화)
  const refreshPhotos = async () => {
    console.log("🔄 수동 새로고침 시작...");
    try {
      await fetchCloudinaryPhotos();
      console.log("✅ 수동 새로고침 완료");
    } catch (error) {
      console.error("❌ 수동 새로고침 실패:", error);
    }
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
            onDeletePhotos={handlePhotoDelete}
            onAddPhoto={handlePhotoAdd}
            onRefresh={refreshPhotos}
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

              <div
                className="card"
                style={{ marginTop: "40px", backgroundColor: "#fff0f5" }}
              >
                <h2>✨ 다인이 맘마주기 게임 ✨</h2>
                <button className="fortune-btn" onClick={showGame}>
                  게임 시작하기
                </button>
              </div>

              <PhotoGallery photos={allPhotos} />
              <TodayFortune photos={allPhotos} />

              {/* ✅ 디버깅 정보 추가 */}
              <div
                style={{
                  textAlign: "center",
                  padding: "10px",
                  fontSize: "12px",
                  color: "#666",
                  borderTop: "1px solid #eee",
                  marginTop: "40px",
                }}
              >
                🔗 Cloudinary Storage • {allPhotos.length}장의 사진
                {isLoading && <span> • 🔄 로딩 중...</span>}
                {error && <span style={{ color: "red" }}> • ❌ {error}</span>}
              </div>

              {/* ✅ 수동 새로고침 버튼 추가 (개발/디버깅용) */}
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button
                  onClick={refreshPhotos}
                  disabled={isLoading}
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    backgroundColor: isLoading ? "#ccc" : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "🔄 새로고침 중..." : "🔄 사진 새로고침"}
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      {!showWelcome || !isMobile() ? (
        <>
          {renderCurrentView()}
          <FloatingButtons
            activeView={currentView}
            onGoToMain={showMain}
            onVideoClick={showVideo}
            onMonthlyPhotosClick={showMonthlyPhotos}
          />
        </>
      ) : (
        renderCurrentView()
      )}
    </>
  );
}

export default App;
