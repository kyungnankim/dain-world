// src/components/PhotoGallery.jsx
import React, { useState, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function PhotoGallery({ photos = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    console.log("PhotoGallery - 받은 사진 개수:", photos.length);
    console.log("PhotoGallery - 사진 데이터:", photos);
  }, [photos]);

  const openModal = useCallback((photo) => {
    console.log("모달 열기:", photo);
    setSelectedImage(photo);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage, handleKeyDown]);

  // 이미지 로드 에러 처리
  const handleImageError = useCallback((photoId, imageUrl) => {
    console.error("이미지 로드 실패:", imageUrl);
    setImageErrors((prev) => new Set([...prev, photoId]));
  }, []);

  const handleImageLoad = useCallback((photoId) => {
    console.log("이미지 로드 성공:", photoId);
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  }, []);

  if (!photos || photos.length === 0) {
    return (
      <div className="card">
        <h2>📸 다인이의 성장 앨범</h2>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>아직 사진이 없어요 📷</p>
          <p>월별 사진 갤러리에서 사진을 추가해주세요!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2>📸 다인이의 성장 앨범</h2>
        <div
          style={{
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          총 <strong>{photos.length}</strong>장의 사진
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView="auto"
          navigation
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          style={{ padding: "20px 0", height: "300px" }}
        >
          {photos.map((photo, index) => {
            const hasError = imageErrors.has(photo.id);
            const imageUrl = photo.thumbnailUrl || photo.url;

            return (
              <SwiperSlide key={photo.id || index}>
                <div
                  className="gallery-item"
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
                        height: "250px",
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        border: "2px dashed #ddd",
                      }}
                    >
                      <div style={{ textAlign: "center", color: "#999" }}>
                        <div style={{ fontSize: "30px", marginBottom: "10px" }}>
                          📷
                        </div>
                        <div>이미지 로드 실패</div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imageUrl}
                      alt={
                        photo.alt || photo.name || `다인이 사진 ${index + 1}`
                      }
                      className="gallery-image"
                      loading="lazy"
                      onLoad={() => handleImageLoad(photo.id)}
                      onError={() => handleImageError(photo.id, imageUrl)}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        transition: "transform 0.3s ease, filter 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.filter = "brightness(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.filter = "brightness(1)";
                      }}
                    />
                  )}

                  {/* 월 표시 배지 
                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "5px",
                      backgroundColor: "rgba(255, 105, 180, 0.8)",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {photo.month}월
                  </div>
                  */}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          📱 사진을 터치하면 크게 볼 수 있어요!
        </p>
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
                e.target.src = selectedImage.url; // fallback to original URL
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

            {/* 사진 정보 표시 */}
            <div
              style={{
                position: "absolute",
                bottom: "-50px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              {selectedImage.month}월 • {selectedImage.name || "다인이 사진"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;
