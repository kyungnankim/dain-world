// src/components/MonthlyPhotos.jsx
import React, { useState, useEffect } from "react";
import PhotoUpload from "./PhotoUpload";

const MonthlyPhotos = ({ onBack, photos = [], onDeletePhotos, onAddPhoto }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMonth, setUploadMonth] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    console.log("MonthlyPhotos - 받은 사진 개수:", photos.length);
    console.log("MonthlyPhotos - 사진 데이터:", photos);
  }, [photos]);

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

  // 월별 사진들을 props로 받은 photos에서 직접 가져옵니다.
  const getPhotosForMonth = (monthNum) => {
    const monthPhotos = photos.filter((p) => p.month === monthNum);
    console.log(`${monthNum}월 사진 개수:`, monthPhotos.length);
    return monthPhotos;
  };

  // 전체 통계 계산
  const getTotalStats = () => {
    const totalPhotos = photos.length;
    const monthsWithPhotos = months.filter(
      (m) => getPhotosForMonth(m.month).length > 0
    ).length;
    const averagePerMonth =
      monthsWithPhotos > 0 ? Math.round(totalPhotos / monthsWithPhotos) : 0;

    return { totalPhotos, monthsWithPhotos, averagePerMonth };
  };

  const handleMonthSelect = (monthNum) => {
    console.log(`${monthNum}월 선택됨`);
    setSelectedMonth((prevMonth) => (prevMonth === monthNum ? null : monthNum));
  };

  const openModal = (photo) => {
    console.log("모달 열기:", photo);
    setSelectedImage(photo);
  };

  const closeModal = () => setSelectedImage(null);

  // 이미지 에러 처리
  const handleImageError = (photoId, imageUrl) => {
    console.error("이미지 로드 실패:", imageUrl);
    setImageErrors((prev) => new Set([...prev, photoId]));
  };

  const handleImageLoad = (photoId) => {
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  };

  // 'Esc' 키로 모달을 닫는 기능을 추가합니다.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage]);

  // 사진 업로드 화면을 보여줄 때
  if (showUpload) {
    const monthInfo = months.find((m) => m.month === uploadMonth);
    return (
      <PhotoUpload
        month={uploadMonth}
        monthName={monthInfo?.name}
        onBack={() => setShowUpload(false)}
        onPhotoUploaded={onAddPhoto}
        existingPhotos={getPhotosForMonth(uploadMonth)}
        onDeleteSelectedPhotos={onDeletePhotos}
      />
    );
  }

  const stats = getTotalStats();

  // 기본 월별 갤러리 화면
  return (
    <div className="monthly-photos-container">
      <div className="monthly-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <div className="monthly-title">
          <span className="month-emoji-large">📅</span>
          <h1>월별 사진 갤러리</h1>
          <span className="month-emoji-large">📸</span>
        </div>
        <div />
      </div>

      {/* 전체 통계 표시 */}
      <div
        className="card"
        style={{
          margin: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>📊 사진 현황</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <div>
            <strong style={{ color: "#ff69b4" }}>{stats.totalPhotos}</strong>
            <br />
            <small>총 사진</small>
          </div>
          <div>
            <strong style={{ color: "#4CAF50" }}>
              {stats.monthsWithPhotos}
            </strong>
            <br />
            <small>사진 있는 달</small>
          </div>
          <div>
            <strong style={{ color: "#2196F3" }}>
              {stats.averagePerMonth}
            </strong>
            <br />
            <small>평균/월</small>
          </div>
        </div>
      </div>

      <div className="monthly-content">
        <div className="compact-months-grid">
          {months.map((monthInfo) => {
            const monthPhotoCount = getPhotosForMonth(monthInfo.month).length;
            const isSelected = selectedMonth === monthInfo.month;
            return (
              <div
                key={monthInfo.month}
                className={`compact-month-card ${isSelected ? "selected" : ""}`}
                style={{
                  backgroundColor: monthInfo.color,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  border: isSelected
                    ? "3px solid #ff69b4"
                    : "2px solid transparent",
                }}
                onClick={() => handleMonthSelect(monthInfo.month)}
              >
                <div className="compact-month-content">
                  <div
                    className="compact-month-emoji"
                    style={{ fontSize: "24px" }}
                  >
                    {monthInfo.emoji}
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {monthInfo.name}
                  </div>
                  <div
                    className="compact-photo-count"
                    style={{
                      fontSize: "12px",
                      color: monthPhotoCount > 0 ? "#333" : "#999",
                      fontWeight: monthPhotoCount > 0 ? "bold" : "normal",
                    }}
                  >
                    {monthPhotoCount}장
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
                {getPhotosForMonth(selectedMonth).map((photo) => {
                  const hasError = imageErrors.has(photo.id);
                  const imageUrl = photo.thumbnailUrl || photo.url;

                  return (
                    <div
                      key={photo.id}
                      className="selected-photo-item"
                      onClick={() => !hasError && openModal(photo)}
                      style={{
                        cursor: hasError ? "default" : "pointer",
                        position: "relative",
                      }}
                    >
                      {hasError ? (
                        <div
                          style={{
                            width: "100%",
                            height: "120px",
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            border: "2px dashed #ddd",
                          }}
                        >
                          <div style={{ textAlign: "center", color: "#999" }}>
                            <div
                              style={{ fontSize: "20px", marginBottom: "5px" }}
                            >
                              📷
                            </div>
                            <div style={{ fontSize: "10px" }}>로드 실패</div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={imageUrl}
                          alt={photo.alt || photo.name}
                          className="selected-photo-thumbnail"
                          loading="lazy"
                          onLoad={() => handleImageLoad(photo.id)}
                          onError={() => handleImageError(photo.id, imageUrl)}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        />
                      )}

                      {/* 사진 이름 표시 */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "2px 5px",
                          fontSize: "10px",
                          borderRadius: "0 0 8px 8px",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {photo.name || "unnamed"}
                      </div>
                    </div>
                  );
                })}
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
      </div>

      {/* 모달 */}
      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
            }}
          >
            <img
              src={selectedImage.fullUrl || selectedImage.url}
              alt={selectedImage.alt || selectedImage.name}
              onError={(e) => {
                console.error("모달 이미지 로드 실패:", selectedImage);
                e.target.src = selectedImage.url;
              }}
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "600px",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>

            {/* 사진 상세 정보 */}
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "10px 20px",
                borderRadius: "20px",
                textAlign: "center",
                minWidth: "200px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                {selectedImage.month}월 • {selectedImage.name || "다인이 사진"}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {selectedImage.createdAt &&
                  new Date(selectedImage.createdAt).toLocaleDateString("ko-KR")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyPhotos;
