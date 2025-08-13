// src/components/MonthlyPhotos.jsx
import React, { useState, useEffect } from "react";
import PhotoUpload from "./PhotoUpload"; // PhotoUpload 컴포넌트를 임포트합니다.

const MonthlyPhotos = ({ onBack, photos = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMonth, setUploadMonth] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthPhotos, setMonthPhotos] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]); // 모든 사진(업로드 포함)을 관리하는 상태

  // 월별 정보
  const months = [
    { month: 1, name: "1월", emoji: "❄️", color: "#87CEEB" },
    { month: 2, name: "2월", emoji: "💝", color: "#FFB6C1" },
    { month: 3, name: "3월", emoji: "🌸", color: "#98FB98" },
    { month: 4, name: "4월", emoji: "🌷", color: "#DDA0DD" },
    { month: 5, name: "5월", emoji: "🌹", color: "#F0E68C" },
    { month: 6, name: "6월", emoji: "☀️", color: "#FFE4B5" },
    { month: 7, name: "7월", emoji: "🏖️", color: "#40E0D0" },
    { month: 8, name: "8월", emoji: "🌻", color: "#FFD700" },
    { month: 9, name: "9월", emoji: "🍂", color: "#DEB887" },
    { month: 10, name: "10월", emoji: "🎃", color: "#FF6347" },
    { month: 11, name: "11월", emoji: "🍁", color: "#CD853F" },
    { month: 12, name: "12월", emoji: "🎄", color: "#90EE90" },
  ];

  // 컴포넌트가 처음 마운트될 때, 초기 사진들에 월 정보를 할당합니다.
  useEffect(() => {
    const processedPhotos = photos.map((photo, index) => ({
      ...photo,
      month: (index % 12) + 1,
    }));
    setAllPhotos(processedPhotos);
  }, [photos]);

  // 월별 사진들을 가져오는 함수
  const getPhotosForMonth = (monthNum) => {
    return allPhotos.filter((p) => p.month === monthNum);
  };

  // 월 선택 처리
  const handleMonthSelect = (monthNum) => {
    if (selectedMonth === monthNum) {
      setSelectedMonth(null);
      setMonthPhotos([]);
    } else {
      setSelectedMonth(monthNum);
      setMonthPhotos(getPhotosForMonth(monthNum));
    }
  };

  // ==========================================================
  // 1. 사진 삭제 핸들러 추가
  // ==========================================================
  const handleDeleteExistingPhotos = (monthToDelete) => {
    // 1. 전체 사진 목록에서 해당 월의 사진들을 제거
    setAllPhotos((prevPhotos) =>
      prevPhotos.filter((p) => p.month !== monthToDelete)
    );

    // 2. 현재 보고 있는 월의 사진 목록이라면, 즉시 비워줌
    if (selectedMonth === monthToDelete) {
      setMonthPhotos([]);
    }
  };

  // ==========================================================
  // 2. 사진 업로드 핸들러 수정
  // ==========================================================
  const handlePhotoUploaded = (newPhoto) => {
    // 1. 전체 사진 목록에 새 사진을 추가 (상태 업데이트는 비동기)
    setAllPhotos((prevPhotos) => [...prevPhotos, newPhoto]);

    // 2. 현재 보고 있는 월의 사진 목록에 새 사진을 바로 추가하여 UI에 즉시 반영
    if (selectedMonth === newPhoto.month) {
      setMonthPhotos((prevMonthPhotos) => [...prevMonthPhotos, newPhoto]);
    }
  };

  const openModal = (photo) => setSelectedImage(photo);
  const closeModal = () => setSelectedImage(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage]);

  // 사진 업로드 화면 렌더링
  if (showUpload) {
    const monthInfo = months.find((m) => m.month === uploadMonth);
    return (
      // ==========================================================
      // 3. PhotoUpload 컴포넌트에 새로운 props 전달
      // ==========================================================
      <PhotoUpload
        month={uploadMonth}
        monthName={monthInfo?.name}
        onBack={() => {
          // 업로드 완료 후, 갤러리 화면으로 돌아올 때 최신 사진 목록을 다시 불러옴
          if (selectedMonth === uploadMonth) {
            setMonthPhotos(getPhotosForMonth(uploadMonth));
          }
          setShowUpload(false);
          setUploadMonth(null);
        }}
        onPhotoUploaded={handlePhotoUploaded}
        // 아래 2개의 prop을 추가합니다.
        existingPhotos={getPhotosForMonth(uploadMonth)}
        onDeleteExistingPhotos={handleDeleteExistingPhotos}
      />
    );
  }

  // 메인 갤러리 화면 렌더링 (이하 코드는 변경 없음)
  return (
    <div className="monthly-photos-container">
      <div className="monthly-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <div className="monthly-title">
          <span className="month-emoji-large">📸</span>
          <h1>월별 사진 갤러리</h1>
        </div>
        <div />
      </div>

      <div className="monthly-content">
        <div className="gallery-description">
          <p
            style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}
          >
            다인이의 성장 과정을 월별로 만나보세요 💕
            <br />
            <small style={{ color: "#999" }}>
              월별 카드를 클릭하면 해당 월의 사진들이 아래에 나타나요!
            </small>
          </p>
        </div>

        <div className="compact-months-grid">
          {months.map((monthInfo) => {
            const monthPhotoCount = getPhotosForMonth(monthInfo.month).length;
            const isSelected = selectedMonth === monthInfo.month;
            return (
              <div
                key={monthInfo.month}
                className={`compact-month-card ${isSelected ? "selected" : ""}`}
                style={{ backgroundColor: monthInfo.color }}
                onClick={() => handleMonthSelect(monthInfo.month)}
              >
                <div className="compact-month-content">
                  <div className="compact-month-emoji">{monthInfo.emoji}</div>
                  <div className="compact-month-name">{monthInfo.name}</div>
                  <div className="compact-photo-count">
                    {monthPhotoCount > 0 ? `${monthPhotoCount}장` : "없음"}
                  </div>
                </div>
                {isSelected && <div className="selected-indicator">✓</div>}
              </div>
            );
          })}
        </div>

        {selectedMonth && (
          <div className="selected-month-photos">
            <div className="selected-month-header">
              <div className="selected-month-info">
                <span className="selected-month-emoji">
                  {months.find((m) => m.month === selectedMonth)?.emoji}
                </span>
                <h3>
                  {months.find((m) => m.month === selectedMonth)?.name} 다인이
                  사진
                </h3>
                <span className="selected-photo-count">
                  총 {getPhotosForMonth(selectedMonth).length}장
                </span>
              </div>
              <button
                className="upload-btn-compact"
                onClick={() => {
                  setUploadMonth(selectedMonth);
                  setShowUpload(true);
                }}
              >
                📷 사진 추가
              </button>
            </div>

            {getPhotosForMonth(selectedMonth).length > 0 ? (
              <div className="selected-month-grid">
                {monthPhotos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    className="selected-photo-item"
                    onClick={() => openModal(photo)}
                  >
                    <img
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.alt}
                      className="selected-photo-thumbnail"
                      loading="lazy"
                    />
                    {photo.uploadDate && (
                      <div className="selected-photo-date">
                        {new Date(photo.uploadDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-selected-photos">
                <span className="no-photos-emoji-large">
                  {months.find((m) => m.month === selectedMonth)?.emoji}
                </span>
                <h4>
                  {months.find((m) => m.month === selectedMonth)?.name}에는 아직
                  사진이 없어요
                </h4>
                <p>첫 번째 사진을 업로드해보세요!</p>
                <button
                  className="fortune-btn"
                  onClick={() => {
                    setUploadMonth(selectedMonth);
                    setShowUpload(true);
                  }}
                >
                  📷 첫 사진 추가하기
                </button>
              </div>
            )}
          </div>
        )}

        {!selectedMonth && (
          <div className="no-month-selected">
            <div className="selection-guide">
              <span className="guide-emoji">👆</span>
              <h3>월별 카드를 선택해주세요</h3>
              <p>
                위의 월별 카드 중 하나를 클릭하면
                <br />그 달의 소중한 사진들을 볼 수 있어요!
              </p>
            </div>
            <div className="gallery-stats-compact">
              <div className="stats-compact">
                <div className="stat-item-compact">
                  <span className="stat-number-compact">
                    {allPhotos.length}
                  </span>
                  <span className="stat-label-compact">전체 사진</span>
                </div>
                <div className="stat-item-compact">
                  <span className="stat-number-compact">12</span>
                  <span className="stat-label-compact">개월</span>
                </div>
                <div className="stat-item-compact">
                  <span className="stat-number-compact">∞</span>
                  <span className="stat-label-compact">추억</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="photo-modal" onClick={closeModal}>
          <div
            className="photo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="photo-close-btn" onClick={closeModal}>
              ✕
            </button>
            <img
              src={selectedImage.fullUrl || selectedImage.url}
              alt={selectedImage.alt}
              className="modal-photo"
            />
            {selectedImage.uploadDate && (
              <div className="photo-modal-info">
                <p>
                  업로드:{" "}
                  {new Date(selectedImage.uploadDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyPhotos;
