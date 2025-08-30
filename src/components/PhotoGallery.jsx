// PhotoGallery.jsx - 삭제 기능 추가 버전
import React, { useState, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function PhotoGallery({ photos = [], onDeletePhotos }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const CORRECT_PASSWORD = "0923"; // 삭제 비밀번호

  useEffect(() => {
    console.log("PhotoGallery - 받은 사진 개수:", photos.length);
  }, [photos]);

  const openModal = useCallback(
    (photo) => {
      if (deleteMode) return; // 삭제 모드에서는 모달 열지 않음
      setSelectedImage(photo);
    },
    [deleteMode]
  );

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedForDeletion(new Set());
  };

  const togglePhotoSelection = (photoId) => {
    setSelectedForDeletion((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleDeleteRequest = () => {
    if (selectedForDeletion.size === 0) return;
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === CORRECT_PASSWORD) {
      onDeletePhotos?.(Array.from(selectedForDeletion));
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setSelectedForDeletion(new Set());
      setDeleteMode(false);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2>다인이의 성장 앨범</h2>

          {/* 삭제 기능이 prop으로 전달된 경우에만 표시 */}
          {onDeletePhotos && (
            <div>
              <button
                className="fortune-btn"
                onClick={toggleDeleteMode}
                style={{
                  backgroundColor: deleteMode ? "#dc3545" : "#6c757d",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
              >
                {deleteMode ? "취소" : "사진 삭제"}
              </button>

              {deleteMode && selectedForDeletion.size > 0 && (
                <button
                  className="fortune-btn"
                  onClick={handleDeleteRequest}
                  style={{
                    backgroundColor: "#dc3545",
                    fontSize: "12px",
                    padding: "8px 12px",
                    marginLeft: "5px",
                  }}
                >
                  선택 삭제 ({selectedForDeletion.size})
                </button>
              )}
            </div>
          )}
        </div>

        {deleteMode && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, color: "#856404" }}>
              ⚠️ 삭제할 사진을 선택하세요. 삭제된 사진은 복구할 수 없습니다.
            </p>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          {deleteMode
            ? "삭제할 사진을 선택하세요"
            : "사진을 터치하면 크게 볼 수 있어요!"}
        </p>

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView="auto"
          navigation
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
            const isSelected = selectedForDeletion.has(photo.id);

            return (
              <SwiperSlide key={photo.id || index}>
                <div
                  className="gallery-item"
                  onClick={() =>
                    deleteMode
                      ? togglePhotoSelection(photo.id)
                      : !hasError && openModal(photo)
                  }
                  style={{
                    cursor: hasError ? "default" : "pointer",
                    position: "relative",
                    border:
                      deleteMode && isSelected ? "3px solid #dc3545" : "none",
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
                        transition: "transform 0.3s ease, filter 0.3s ease",
                        opacity: deleteMode && isSelected ? 0.7 : 1,
                      }}
                    />
                  )}

                  {/* 삭제 모드 선택 표시 */}
                  {deleteMode && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        backgroundColor: isSelected
                          ? "#dc3545"
                          : "rgba(255,255,255,0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #dc3545",
                      }}
                    >
                      {isSelected && (
                        <span style={{ color: "white", fontSize: "16px" }}>
                          ✓
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
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
                cursor: "pointer",
                fontSize: "22px",
                color: "#333",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 비밀번호 입력 모달 */}
      {showPasswordPrompt && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <h3>삭제 확인</h3>
            <p>선택한 사진을 영구적으로 삭제하려면 비밀번호를 입력하세요.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <div>
              <button
                className="fortune-btn"
                onClick={handlePasswordSubmit}
                style={{ marginRight: "10px" }}
              >
                확인
              </button>
              <button
                className="fortune-btn"
                onClick={() => setShowPasswordPrompt(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;
