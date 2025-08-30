// src/components/MonthlyPhotos.jsx
import React, { useState, useEffect } from "react";
import PhotoUpload from "./PhotoUpload";
import { getMonthlyPhotos } from "../utils/cloudinary";

const MonthlyPhotos = ({
  onBack,
  photos = [],
  onDeletePhotos,
  onAddPhoto,
  onRefresh,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMonth, setUploadMonth] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [monthlyPhotosCache, setMonthlyPhotosCache] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("MonthlyPhotos - 받은 사진 개수:", photos.length);
    console.log("MonthlyPhotos - 사진 데이터:", photos);
  }, [photos]);

  // 월별 정보
  const months = [
    { month: 1, name: "1개월", color: "#87CEEB" },
    { month: 2, name: "2개월", color: "#FFB6C1" },
    { month: 3, name: "3개월", color: "#98FB98" },
    { month: 4, name: "4개월", color: "#DDA0DD" },
    { month: 5, name: "5개월", color: "#F0E68C" },
    { month: 6, name: "6개월", color: "#FFE4B5" },
    { month: 7, name: "7개월", color: "#40E0D0" },
    { month: 8, name: "8개월", color: "#FFD700" },
    { month: 9, name: "9개월", color: "#DEB887" },
    { month: 10, name: "10개월", color: "#FF6347" },
    { month: 11, name: "11개월", color: "#CD853F" },
    { month: 12, name: "12개월", color: "#90EE90" },
  ];

  const getPhotosForMonth = (monthNum) => {
    const propsPhotos = photos.filter((p) => p.month === monthNum);
    const cachedPhotos = monthlyPhotosCache[monthNum] || [];
    const allPhotos = [...propsPhotos];
    cachedPhotos.forEach((cached) => {
      if (!allPhotos.find((p) => p.id === cached.id)) {
        allPhotos.push(cached);
      }
    });
    allPhotos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(`${monthNum}월 사진 개수:`, allPhotos.length);
    return allPhotos;
  };

  const loadMonthlyPhotos = async (monthNum) => {
    if (monthlyPhotosCache[monthNum]) {
      console.log(`${monthNum}월 캐시된 데이터 사용`);
      return monthlyPhotosCache[monthNum];
    }
    try {
      setLoading(true);
      console.log(`${monthNum}월 사진을 Cloudinary에서 직접 로드...`);
      const monthPhotos = await getMonthlyPhotos(monthNum);
      setMonthlyPhotosCache((prev) => ({
        ...prev,
        [monthNum]: monthPhotos,
      }));
      console.log(`${monthNum}월: ${monthPhotos.length}장 로드 완료`);
      return monthPhotos;
    } catch (error) {
      console.error(`${monthNum}월 사진 로드 실패:`, error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleMonthSelect = async (monthNum) => {
    console.log(`${monthNum}월 선택됨`);
    if (selectedMonth === monthNum) {
      setSelectedMonth(null);
      return;
    }
    setSelectedMonth(monthNum);
    await loadMonthlyPhotos(monthNum);
  };

  const openModal = (photo) => {
    console.log("모달 열기:", photo);
    setSelectedImage(photo);
  };

  const closeModal = () => setSelectedImage(null);

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

  const handlePhotoUploaded = async (newPhoto) => {
    console.log("새 사진 업로드됨:", newPhoto);
    onAddPhoto(newPhoto);
    setMonthlyPhotosCache((prev) => {
      const updatedCache = { ...prev };
      delete updatedCache[newPhoto.month];
      console.log(` ${newPhoto.month}월 캐시를 비웠습니다.`);
      return updatedCache;
    });
    setShowUpload(false);
    if (selectedMonth === newPhoto.month) {
      console.log(`${newPhoto.month}월 사진 목록을 새로고침합니다.`);
      setTimeout(() => {
        loadMonthlyPhotos(newPhoto.month);
      }, 500);
    }
  };

  const handlePhotosDeleted = (deletedIds) => {
    console.log("사진 삭제됨:", deletedIds);
    onDeletePhotos(deletedIds);
    setMonthlyPhotosCache((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((month) => {
        updated[month] = updated[month].filter(
          (p) => !deletedIds.includes(p.id)
        );
      });
      return updated;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage]);

  if (showUpload) {
    const monthInfo = months.find((m) => m.month === uploadMonth);
    return (
      <PhotoUpload
        month={uploadMonth}
        monthName={monthInfo?.name}
        onBack={() => setShowUpload(false)}
        onPhotoUploaded={handlePhotoUploaded}
        existingPhotos={getPhotosForMonth(uploadMonth)}
        onDeleteSelectedPhotos={handlePhotosDeleted}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <div className="monthly-photos-container">
      <div className="monthly-header">
        {/* 돌아가기 버튼 제거됨 */}
        <div className="monthly-title">
          <span className="month-emoji-large">📅</span>
          <h1>개월별 사진 갤러리</h1>
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
                className={`compact-month-card ${
                  isSelected ? "selected" : ""
                } ${
                  loading && selectedMonth === monthInfo.month ? "loading" : ""
                }`}
                style={{ backgroundColor: monthInfo.color }}
                onClick={() => handleMonthSelect(monthInfo.month)}
              >
                <div className="compact-month-content">
                  <div className="compact-month-name">{monthInfo.name}</div>
                  <div
                    className={`compact-photo-count ${
                      monthPhotoCount > 0 ? "has-photos" : "no-photos"
                    }`}
                  >
                    {monthPhotoCount}장
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedMonth && (
          <div className="selected-month-photos">
            <div className="selected-month-header">
              <div className="selected-month-info">
                <h3>
                  {months.find((m) => m.month === selectedMonth)?.name} 다인이
                  사진
                </h3>
                <button
                  className="upload-btn-compact"
                  onClick={() => {
                    setUploadMonth(selectedMonth);
                    setShowUpload(true);
                  }}
                >
                  사진추가
                </button>
              </div>
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
                    >
                      {hasError ? (
                        <div className="photo-error-placeholder">
                          <div className="photo-error-icon">📷</div>
                          <div className="photo-error-text">로드 실패</div>
                        </div>
                      ) : (
                        <img
                          src={imageUrl}
                          alt={photo.alt || photo.name}
                          className="selected-photo-thumbnail"
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(photo.id)}
                          onError={() => handleImageError(photo.id, imageUrl)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-selected-photos">
                <div className="no-photos-emoji-large">📷</div>
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

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content photo-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.fullUrl || selectedImage.url}
              alt={selectedImage.alt || selectedImage.name}
              className="modal-photo"
              onError={(e) => {
                console.error("모달 이미지 로드 실패:", selectedImage);
                e.target.src = selectedImage.url;
              }}
            />
            <button onClick={closeModal} className="modal-close-btn">
              ×
            </button>

            <div className="modal-photo-info">
              <div className="modal-photo-month">{selectedImage.month}월</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyPhotos;
