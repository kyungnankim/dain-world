// App.jsx - 개선된 전화번호 선택 기능
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

// 전화번호 선택 모달 컴포넌트
const PhoneContactModal = ({ isOpen, onClose, contacts }) => {
  if (!isOpen) return null;

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>📞 연락처 선택</h3>
        <p style={{ color: "#666", marginBottom: "20px", textAlign: "center" }}>
          통화하실 연락처를 선택해주세요
        </p>

        <div className="contact-list">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="contact-item"
              onClick={() => handleCall(contact.number)}
            >
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-number">{contact.number}</div>
                {contact.description && (
                  <div className="contact-description">
                    {contact.description}
                  </div>
                )}
              </div>
              <div className="call-icon">📞</div>
            </div>
          ))}
        </div>

        <div className="modal-actions" style={{ marginTop: "25px" }}>
          <button className="fortune-btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

// 하단 네비게이션 컴포넌트
const BottomNavigation = ({
  onCallClick,
  onDirectionsClick,
  onGalleryClick,
  onShareClick,
}) => {
  return (
    <div className="bottom-navigation">
      {/* 전화 버튼 */}
      <div className="nav-item" onClick={onCallClick}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#e91e63">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
        <span className="nav-text">전화</span>
      </div>

      {/* 길찾기 버튼 */}
      <div className="nav-item" onClick={onDirectionsClick}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#e91e63">
          <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.39.39-1.02 0-1.41zM12 17.17L6.83 12 12 6.83 17.17 12 12 17.17z" />
        </svg>
        <span className="nav-text">길찾기</span>
      </div>

      {/* 갤러리 버튼 */}
      <div className="nav-item" onClick={onGalleryClick}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#e91e63">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <span className="nav-text">갤러리</span>
      </div>

      {/* 공유 버튼 */}
      <div className="nav-item" onClick={onShareClick}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#e91e63">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
        </svg>
        <span className="nav-text">공유</span>
      </div>
    </div>
  );
};

function App() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // 연락처 정보
  const contacts = [
    {
      name: "헬퍼",
      number: "010-7503-6190",
      description: "행사 도우미",
    },
    {
      name: "최영민",
      number: "010-9937-2374",
      description: "아빠",
    },
    {
      name: "김민경",
      number: "010-5751-7457",
      description: "엄마",
    },
  ];

  // 사진을 불러오는 함수
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

  // 사진 삭제 핸들러
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

  // 사진 추가 핸들러
  const handlePhotoAdd = (newPhoto) => {
    console.log("📷 새 사진 추가 요청:", newPhoto);

    setAllPhotos((prevPhotos) => {
      if (prevPhotos.find((p) => p.id === newPhoto.id)) {
        return prevPhotos;
      }
      const updatedPhotos = [newPhoto, ...prevPhotos];
      console.log(`📊 추가 후 총 사진: ${updatedPhotos.length}장`);
      return updatedPhotos;
    });
  };

  // 사진 목록 새로고침
  const refreshPhotos = async () => {
    console.log("🔄 수동 새로고침 시작...");
    try {
      await fetchCloudinaryPhotos();
      console.log("✅ 수동 새로고침 완료");
    } catch (error) {
      console.error("❌ 수동 새로고침 실패:", error);
    }
  };

  // 하단 네비게이션 핸들러들
  const handleCallClick = () => {
    setShowPhoneModal(true);
  };

  const handleDirectionsClick = () => {
    // 길찾기 앱 선택
    const destination = "메이필드 호텔 서울";
    const lat = 37.5615;
    const lng = 126.8055;

    // 모바일에서는 앱 우선, 웹에서는 웹사이트로
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // 카카오맵 앱 시도
      window.location.href = `kakaonavi://navigate?ep=${lat},${lng}&by=CAR`;

      // 2초 후 앱 실행 실패시 웹으로 이동
      setTimeout(() => {
        window.open(
          `https://map.kakao.com/link/to/${encodeURIComponent(
            destination
          )},${lat},${lng}`,
          "_blank"
        );
      }, 2000);
    } else {
      // PC에서는 바로 웹으로
      window.open(
        `https://map.kakao.com/link/to/${encodeURIComponent(
          destination
        )},${lat},${lng}`,
        "_blank"
      );
    }
  };

  const handleGalleryClick = () => {
    // 월별 사진 갤러리로 이동
    showMonthlyPhotos();
  };

  const handleShareClick = () => {
    // 웹 공유 API 사용 또는 URL 복사
    const shareData = {
      title: "♡ 최다인 월드 ♡",
      text: "다인이의 첫돌 잔치에 초대합니다! 🎂👶✨",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("공유 성공"))
        .catch((error) => {
          console.log("공유 실패:", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert(
          "링크가 클립보드에 복사되었습니다! 다른 앱에서 붙여넣기 하실 수 있어요 😊"
        );
      })
      .catch(() => {
        // 클립보드 API 실패시 수동 복사 안내
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("링크가 복사되었습니다! 다른 앱에서 붙여넣기 하실 수 있어요 😊");
      });
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
                style={{
                  marginTop: "40px",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #fce4ec 100%)",
                }}
              >
                <h2>✨ 다인이 맘마주기 게임 ✨</h2>
                <button className="fortune-btn" onClick={showGame}>
                  게임 시작하기
                </button>
              </div>

              <PhotoGallery photos={allPhotos} />
              <TodayFortune photos={allPhotos} />
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

          {/* 기존 플로팅 버튼들 */}
          <FloatingButtons
            activeView={currentView}
            onGoToMain={showMain}
            onVideoClick={showVideo}
            onMonthlyPhotosClick={showMonthlyPhotos}
          />

          {/* 하단 네비게이션 바 */}
          <BottomNavigation
            onCallClick={handleCallClick}
            onDirectionsClick={handleDirectionsClick}
            onGalleryClick={handleGalleryClick}
            onShareClick={handleShareClick}
          />

          {/* 전화번호 선택 모달 */}
          <PhoneContactModal
            isOpen={showPhoneModal}
            onClose={() => setShowPhoneModal(false)}
            contacts={contacts}
          />
        </>
      ) : (
        renderCurrentView()
      )}
    </>
  );
}

export default App;
