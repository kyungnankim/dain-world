// App.jsx - 전화 기능 수정
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Anniversary from "./components/Anniversary";
import Doljanchi from "./components/Doljanchi";
import PhotoGallery from "./components/PhotoGallery";
import TodayFortune from "./components/TodayFortune";
import FeedingGame from "./components/FeedingGame";
import FloatingButtons from "./components/FloatingButtons";
import TopNavigation from "./components/TopNavigation";
import VideoGallery from "./components/VideoGallery";
import MonthlyPhotos from "./components/MonthlyPhotos";
import { getAllPhotos } from "./utils/cloudinary";

// 전화번호 선택 모달 컴포넌트 - 직접 전화 걸기로 수정
const PhoneContactModal = ({ isOpen, onClose, contacts }) => {
  if (!isOpen) return null;

  const handleCall = (phoneNumber) => {
    // 바로 전화 걸기 - 추가 확인 단계 없이
    try {
      window.location.href = `tel:${phoneNumber}`;
    } catch (error) {
      // 대체 방법
      window.open(`tel:${phoneNumber}`, "_self");
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>📞 연락처 선택</h3>
        <p className="contact-modal-description">
          전화를 걸 연락처를 선택해주세요
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

        <div className="modal-actions">
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
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#FF8F00">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
        <span className="nav-text">전화</span>
      </div>

      {/* 길찾기 버튼 */}
      <div className="nav-item" onClick={onDirectionsClick}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#FF8F00">
          <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.39.39-1.02 0-1.41zM12 17.17L6.83 12 12 6.83 17.17 12 12 17.17z" />
        </svg>
        <span className="nav-text">길찾기</span>
      </div>

      {/* 갤러리 버튼 */}
      <div className="nav-item" onClick={onGalleryClick}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#FF8F00">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <span className="nav-text">갤러리</span>
      </div>

      {/* 공유 버튼 */}
      <div className="nav-item" onClick={onShareClick}>
        <svg className="nav-icon" viewBox="0 0 24 24" fill="#FF8F00">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
        </svg>
        <span className="nav-text">공유</span>
      </div>
    </div>
  );
};

// 메인 애플리케이션 컴포넌트
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allPhotos, setAllPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // 연락처 정보
  const contacts = [
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

  // 사진을 불러오는 함수 (로딩 상태 제거)
  const fetchCloudinaryPhotos = useCallback(async () => {
    setError(null);

    try {
      console.log("Cloudinary에서 사진 불러오기 시작...");
      const photos = await getAllPhotos();

      setAllPhotos(photos);
      console.log("사진 로드 성공:", photos.length, "장");
    } catch (error) {
      console.error("Cloudinary 사진 로드 실패:", error);
      setError(error.message);
      setAllPhotos([]);
    }
  }, []);

  // 앱 시작시 사진 로드
  useEffect(() => {
    fetchCloudinaryPhotos();
  }, [fetchCloudinaryPhotos]);

  const dainInfo = {
    birthday: "2024-09-23",
    dolPartyDate: "2025-09-13",
  };

  // 사진 삭제 핸들러
  const handlePhotoDelete = (photoIdsToDelete) => {
    console.log("사진 삭제 요청:", photoIdsToDelete);
    setAllPhotos((prevPhotos) => {
      const filteredPhotos = prevPhotos.filter(
        (p) => !photoIdsToDelete.includes(p.id)
      );
      console.log(`삭제 후 남은 사진: ${filteredPhotos.length}장`);
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
      console.log(`추가 후 총 사진: ${updatedPhotos.length}장`);
      return updatedPhotos;
    });
  };

  // 사진 목록 새로고침
  const refreshPhotos = async () => {
    console.log("수동 새로고침 시작...");
    try {
      await fetchCloudinaryPhotos();
      console.log("수동 새로고침 완료");
    } catch (error) {
      console.error("❌ 수동 새로고침 실패:", error);
    }
  };

  // 상단 네비게이션 핸들러들
  const handleGoToMain = () => {
    navigate("/");
  };

  const handleVideoClick = () => {
    navigate("/video");
  };

  const handleGalleryClick = () => {
    navigate("/gallery");
  };

  const handleGameClick = () => {
    navigate("/game");
  };

  // 하단 네비게이션 핸들러들
  const handleCallClick = () => {
    setShowPhoneModal(true);
  };

  const handleDirectionsClick = () => {
    const destination = "메이필드 호텔 낙원";
    const lat = 37.5704;
    const lng = 126.9869;

    const isMobileDevice =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobileDevice) {
      window.location.href = `kakaonavi://navigate?ep=${lat},${lng}&by=CAR`;

      setTimeout(() => {
        window.open(
          `https://map.kakao.com/link/to/${encodeURIComponent(
            destination
          )},${lat},${lng}`,
          "_blank"
        );
      }, 2000);
    } else {
      window.open(
        `https://map.kakao.com/link/to/${encodeURIComponent(
          destination
        )},${lat},${lng}`,
        "_blank"
      );
    }
  };

  const handleShareClick = () => {
    const shareData = {
      title: "♡ 최다인 월드 ♡",
      text: "다인이의 첫돌 잔치에 초대합니다! ",
      url: window.location.origin,
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
      .writeText(window.location.origin)
      .then(() => {
        alert(
          "링크가 클립보드에 복사되었습니다! 다른 앱에서 붙여넣기 하실 수 있어요"
        );
      })
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.origin;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("링크가 복사되었습니다! 다른 앱에서 붙여넣기 하실 수 있어요");
      });
  };

  // 현재 경로에 따른 activeView 결정
  const getActiveView = () => {
    if (location.pathname === "/game") return "game";
    if (location.pathname === "/video") return "video";
    if (location.pathname === "/gallery") return "gallery";
    return "main";
  };

  const currentView = getActiveView();

  return (
    <>
      {/* 상단 네비게이션 - 항상 렌더링 */}
      <TopNavigation
        activeView={currentView}
        onGoToMain={handleGoToMain}
        onVideoClick={handleVideoClick}
        onGalleryClick={handleGalleryClick}
        onGameClick={handleGameClick}
      />

      <Routes>
        {/* 메인 페이지 */}
        <Route
          path="/"
          element={
            <>
              {/* 메인 페이지 컨텐츠 - 항상 렌더링 */}
              <div className="container page-content-with-nav">
                <Doljanchi partyDate={dainInfo.dolPartyDate} />

                <div className="card game-promotion-card">
                  <h2>✨ 다인이 맘마주기 게임 ✨</h2>
                  <button
                    className="fortune-btn"
                    onClick={() => navigate("/game")}
                  >
                    게임 시작하기
                  </button>
                </div>

                <PhotoGallery
                  photos={allPhotos}
                  onDeletePhotos={handlePhotoDelete}
                />
                <TodayFortune photos={allPhotos} />
              </div>
            </>
          }
        />

        {/* 게임 페이지 */}
        <Route
          path="/game"
          element={<FeedingGame onBack={() => navigate("/")} />}
        />

        {/* 비디오 갤러리 페이지 */}
        <Route
          path="/video"
          element={<VideoGallery onBack={() => navigate("/")} />}
        />

        {/* 월별 사진 갤러리 페이지 */}
        <Route
          path="/gallery"
          element={
            <MonthlyPhotos
              onBack={() => navigate("/")}
              photos={allPhotos}
              onDeletePhotos={handlePhotoDelete}
              onAddPhoto={handlePhotoAdd}
              onRefresh={refreshPhotos}
            />
          }
        />
      </Routes>

      {/* 플로팅 버튼 - 항상 렌더링 */}
      <FloatingButtons activeView={currentView} />

      {/* 하단 네비게이션 바 - 항상 렌더링 */}
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
  );
};

// 메인 App 컴포넌트 (Router로 감싸기)
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
