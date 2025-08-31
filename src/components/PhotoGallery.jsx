// PhotoGallery.jsx - 삭제 기능 완전 제거, 보기 전용
import React, { useState, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function PhotoGallery({ photos = [] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    console.log("PhotoGallery - 받은 사진 개수:", photos.length);
  }, [photos]);

  const openModal = useCallback((photo, index) => {
    setSelectedImageIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImageIndex, handleKeyDown]);

  const handleImageError = useCallback((photoId, imageUrl) => {
    console.error("이미지 로드 실패:", imageUrl);
    setImageErrors((prev) => new Set([...prev, photoId]));
  }, []);

  const handleImageLoad = useCallback((photoId) => {
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });
  }, []);

  if (!photos || photos.length === 0) {
    return (
      <div className="card">
        <h2>다인이의 성장 앨범</h2>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>아직 사진이 없어요.</p>
          <p>월별 사진 갤러리에서 사진을 추가해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2>다인이의 성장 앨범</h2>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          사진을 터치하면 크게 볼 수 있어요! 좌우로 스와이프하여 넘겨보세요.
        </p>

        {/* 네비게이션 화살표 제거, 스와이프만 가능 */}
        <Swiper
          spaceBetween={10}
          slidesPerView="auto"
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            480: { slidesPerView: 3, spaceBetween: 15 },
            768: { slidesPerView: 4, spaceBetween: 20 },
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
                  onClick={() => !hasError && openModal(photo, index)}
                  style={{
                    cursor: hasError ? "default" : "pointer",
                    position: "relative",
                    borderRadius: "10px",
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
                        transition: "transform 0.3s ease",
                      }}
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* 모달에서는 네비게이션 유지 */}
      {selectedImageIndex !== null && (
        <div
          className="photo-modal-overlay"
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="photo-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: "95vw",
              maxHeight: "95vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "20px",
                color: "#555",
                zIndex: 10001,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.color = "#000";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#555";
              }}
            >
              ×
            </button>

            {/* 모달에서는 네비게이션과 스와이프 모두 가능 */}
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: ".photo-modal-next",
                prevEl: ".photo-modal-prev",
              }}
              pagination={{
                clickable: true,
                el: ".photo-modal-pagination",
              }}
              initialSlide={selectedImageIndex}
              style={{
                width: "100%",
                height: "80vh",
                maxHeight: "600px",
              }}
            >
              {photos.map((photo, index) => {
                const imageUrl = photo.fullUrl || photo.url;
                return (
                  <SwiperSlide key={photo.id || index}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={
                          photo.alt || photo.name || `다인이 사진 ${index + 1}`
                        }
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: "10px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                        }}
                        onError={(e) => {
                          console.error("모달 이미지 로드 실패:", photo);
                          e.target.src = photo.thumbnailUrl || photo.url;
                        }}
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* 모달 네비게이션 버튼들 */}
            <div
              className="photo-modal-prev"
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "50px",
                height: "50px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10001,
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                border: "none",
              }}
            >
              ‹
            </div>

            <div
              className="photo-modal-next"
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "50px",
                height: "50px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10001,
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                border: "none",
              }}
            >
              ›
            </div>

            {/* Pagination */}
            <div
              className="photo-modal-pagination"
              style={{
                position: "absolute",
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10001,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;
