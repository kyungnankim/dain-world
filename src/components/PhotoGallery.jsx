// src/components/PhotoGallery.jsx
import React, { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function PhotoGallery({ photos }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = useCallback((photo) => {
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

  React.useEffect(() => {
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage, handleKeyDown]);

  return (
    <>
      <h2>📸 다인이의 성장 앨범</h2>
      <div className="card">
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
          {photos.map((photo, index) => (
            <SwiperSlide key={index}>
              <div
                className="gallery-item"
                onClick={() => openModal(photo)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={photo.alt}
                  className="gallery-image"
                  loading="lazy"
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
              </div>
            </SwiperSlide>
          ))}
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
              alt={selectedImage.alt}
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
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;
