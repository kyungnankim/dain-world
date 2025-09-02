// src/components/MonthlyPhotos.jsx - 삭제 기능 추가 및 단조로운 색상
import React, { useState, useEffect } from "react";
import PhotoUpload from "./PhotoUpload";
import { getMonthlyPhotos, deletePhotos } from "../utils/cloudinary";

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
  const [monthPhotoCounts, setMonthPhotoCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [countsLoading, setCountsLoading] = useState(true);

  // 삭제 기능 상태들
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const CORRECT_PASSWORD = "0923"; // 삭제 비밀번호

  useEffect(() => {
    console.log("MonthlyPhotos - 받은 사진 개수:", photos.length);
    console.log("MonthlyPhotos - 사진 데이터:", photos);
  }, [photos]);

  // 월별 정보 - 단조로운 회색톤 색상
  const months = [
    { month: 1, name: "1개월", color: "#f8f9fa" },
    { month: 2, name: "2개월", color: "#e9ecef" },
    { month: 3, name: "3개월", color: "#dee2e6" },
    { month: 4, name: "4개월", color: "#ced4da" },
    { month: 5, name: "5개월", color: "#adb5bd" },
    { month: 6, name: "6개월", color: "#9ba1a6" },
    { month: 7, name: "7개월", color: "#868e96" },
    { month: 8, name: "8개월", color: "#748991" },
    { month: 9, name: "9개월", color: "#6c757d" },
    { month: 10, name: "10개월", color: "#5a6268" },
    { month: 11, name: "11개월", color: "#495057" },
    { month: 12, name: "12개월", color: "#343a40" },
  ];

  // 컴포넌트 마운트 시 모든 월의 사진 개수를 미리 로드
  useEffect(() => {
    const loadAllMonthCounts = async () => {
      setCountsLoading(true);
      console.log("모든 월의 사진 개수 로딩 시작...");

      const counts = {};

      // 먼저 props로 받은 사진들에서 월별 개수 계산
      photos.forEach((photo) => {
        if (photo.month) {
          counts[photo.month] = (counts[photo.month] || 0) + 1;
        }
      });

      // 각 월별로 Cloudinary에서 추가 사진 개수 확인
      const monthPromises = months.map(async (monthInfo) => {
        try {
          const monthPhotos = await getMonthlyPhotos(monthInfo.month);
          // props 사진과 중복 제거
          const propsPhotosForMonth = photos.filter(
            (p) => p.month === monthInfo.month
          );
          const uniqueMonthPhotos = monthPhotos.filter(
            (cloudPhoto) =>
              !propsPhotosForMonth.find(
                (propPhoto) => propPhoto.id === cloudPhoto.id
              )
          );

          const totalCount =
            (counts[monthInfo.month] || 0) + uniqueMonthPhotos.length;
          counts[monthInfo.month] = totalCount;

          // 캐시에도 저장
          if (monthPhotos.length > 0) {
            setMonthlyPhotosCache((prev) => ({
              ...prev,
              [monthInfo.month]: monthPhotos,
            }));
          }

          console.log(`${monthInfo.month}월: ${totalCount}장`);
          return { month: monthInfo.month, count: totalCount };
        } catch (error) {
          console.error(`${monthInfo.month}월 사진 개수 로드 실패:`, error);
          counts[monthInfo.month] = counts[monthInfo.month] || 0;
          return {
            month: monthInfo.month,
            count: counts[monthInfo.month] || 0,
          };
        }
      });

      try {
        await Promise.all(monthPromises);
        setMonthPhotoCounts(counts);
        console.log("모든 월 사진 개수 로딩 완료:", counts);
      } catch (error) {
        console.error("월별 사진 개수 로딩 중 오류:", error);
      } finally {
        setCountsLoading(false);
      }
    };

    loadAllMonthCounts();
  }, [photos]);

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
      setDeleteMode(false);
      setSelectedForDeletion(new Set());
      return;
    }
    setSelectedMonth(monthNum);
    setDeleteMode(false);
    setSelectedForDeletion(new Set());
    await loadMonthlyPhotos(monthNum);
  };

  const openModal = (photo) => {
    if (deleteMode) return; // 삭제 모드에서는 모달 열지 않음
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

    // 해당 월의 캐시와 개수 업데이트
    setMonthlyPhotosCache((prev) => {
      const updatedCache = { ...prev };
      delete updatedCache[newPhoto.month];
      console.log(`${newPhoto.month}월 캐시를 비웠습니다.`);
      return updatedCache;
    });

    // 사진 개수 업데이트
    setMonthPhotoCounts((prev) => ({
      ...prev,
      [newPhoto.month]: (prev[newPhoto.month] || 0) + 1,
    }));

    setShowUpload(false);
    if (selectedMonth === newPhoto.month) {
      console.log(`${newPhoto.month}월 사진 목록을 새로고침합니다.`);
      setTimeout(() => {
        loadMonthlyPhotos(newPhoto.month);
      }, 500);
    }
  };

  // 삭제 관련 함수들
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
    if (selectedForDeletion.size === 0) {
      alert("삭제할 사진을 선택해주세요.");
      return;
    }
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = async () => {
    if (passwordInput === CORRECT_PASSWORD) {
      try {
        console.log("삭제할 사진 ID들:", Array.from(selectedForDeletion));

        const result = await deletePhotos(Array.from(selectedForDeletion));

        if (result.success) {
          // 삭제된 사진들을 상태에서 제거
          const deletedIds =
            result.deletedIds || Array.from(selectedForDeletion);

          // 부모 컴포넌트에도 알림
          if (onDeletePhotos) {
            onDeletePhotos(deletedIds);
          }

          // 캐시에서도 삭제된 사진 제거
          setMonthlyPhotosCache((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((month) => {
              updated[month] = updated[month].filter(
                (p) => !deletedIds.includes(p.id)
              );
            });
            return updated;
          });

          // 선택된 월의 사진 개수 업데이트
          if (selectedMonth) {
            const deletedFromThisMonth = deletedIds.filter((id) =>
              getPhotosForMonth(selectedMonth).some((p) => p.id === id)
            ).length;

            setMonthPhotoCounts((prev) => ({
              ...prev,
              [selectedMonth]: Math.max(
                0,
                (prev[selectedMonth] || 0) - deletedFromThisMonth
              ),
            }));
          }

          setShowPasswordPrompt(false);
          setPasswordInput("");
          setSelectedForDeletion(new Set());
          setDeleteMode(false);

          const message = result.partialSuccess
            ? `${result.deletedCount}/${result.totalRequested}장이 삭제되었습니다.`
            : `${result.deletedCount}장이 성공적으로 삭제되었습니다.`;

          alert(message);

          // 새로고침
          if (onRefresh) {
            setTimeout(onRefresh, 500);
          }

          // 현재 월 새로고침
          if (selectedMonth) {
            setTimeout(() => {
              loadMonthlyPhotos(selectedMonth);
            }, 500);
          }
        } else {
          throw new Error(result.error || "삭제 실패");
        }
      } catch (error) {
        console.error("사진 삭제 중 오류:", error);
        alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
      }
    } else {
      alert("비밀번호가 틀렸습니다.");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showPasswordPrompt) {
          setShowPasswordPrompt(false);
          setPasswordInput("");
        } else {
          closeModal();
        }
      }
    };
    if (selectedImage || showPasswordPrompt) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage, showPasswordPrompt]);

  if (showUpload) {
    const monthInfo = months.find((m) => m.month === uploadMonth);
    return (
      <PhotoUpload
        month={uploadMonth}
        monthName={monthInfo?.name}
        onBack={() => setShowUpload(false)}
        onPhotoUploaded={handlePhotoUploaded}
        existingPhotos={getPhotosForMonth(uploadMonth)}
        onDeleteSelectedPhotos={onDeletePhotos}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <div className="monthly-photos-container">
      <div className="monthly-header">
        <div className="monthly-title">
          <span className="month-emoji-large">개월별 사진 갤러리</span>
        </div>
      </div>

      <div className="monthly-content">
        <div className="compact-months-grid">
          {months.map((monthInfo) => {
            // 실제 사진 개수 표시
            const monthPhotoCount = countsLoading
              ? "..."
              : monthPhotoCounts[monthInfo.month] || 0;
            const isSelected = selectedMonth === monthInfo.month;
            const isCurrentlyLoading =
              loading && selectedMonth === monthInfo.month;

            return (
              <div
                key={monthInfo.month}
                className={`compact-month-card ${
                  isSelected ? "selected" : ""
                } ${isCurrentlyLoading ? "loading" : ""}`}
                style={{
                  backgroundColor: monthInfo.color,
                  color: monthInfo.month > 6 ? "white" : "#333", // 어두운 색상일 때 흰색 텍스트
                }}
                onClick={() => handleMonthSelect(monthInfo.month)}
              >
                <div className="compact-month-content">
                  <div className="compact-month-name">{monthInfo.name}</div>
                  <div
                    className={`compact-photo-count ${
                      monthPhotoCount > 0 && !countsLoading
                        ? "has-photos"
                        : "no-photos"
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
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    className="upload-btn-compact"
                    onClick={() => {
                      setUploadMonth(selectedMonth);
                      setShowUpload(true);
                    }}
                  >
                    사진추가
                  </button>

                  {getPhotosForMonth(selectedMonth).length > 0 && (
                    <>
                      <button
                        className="upload-btn-compact"
                        onClick={toggleDeleteMode}
                        style={{
                          backgroundColor: deleteMode ? "#dc3545" : "#6c757d",
                          color: "white",
                        }}
                      >
                        {deleteMode ? "취소" : "사진삭제"}
                      </button>

                      {deleteMode && selectedForDeletion.size > 0 && (
                        <button
                          className="upload-btn-compact"
                          onClick={handleDeleteRequest}
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                          }}
                        >
                          선택삭제 ({selectedForDeletion.size})
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {deleteMode && (
              <div
                style={{
                  backgroundColor: "#fff3cd",
                  border: "1px solid #ffeaa7",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, color: "#856404" }}>
                  ⚠️ 삭제할 사진을 선택하세요. 삭제된 사진은 복구할 수 없습니다.
                </p>
              </div>
            )}

            {getPhotosForMonth(selectedMonth).length > 0 ? (
              <div className="selected-month-grid">
                {getPhotosForMonth(selectedMonth).map((photo) => {
                  const hasError = imageErrors.has(photo.id);
                  const imageUrl = photo.thumbnailUrl || photo.url;
                  const isSelected = selectedForDeletion.has(photo.id);

                  return (
                    <div
                      key={photo.id}
                      className="selected-photo-item"
                      onClick={() =>
                        deleteMode
                          ? togglePhotoSelection(photo.id)
                          : !hasError && openModal(photo)
                      }
                      style={{
                        cursor: hasError ? "default" : "pointer",
                        border:
                          deleteMode && isSelected
                            ? "3px solid #dc3545"
                            : "none",
                        position: "relative",
                      }}
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
                          style={{
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

      {/* 사진 상세보기 모달 */}
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
          </div>
        </div>
      )}

      {/* 비밀번호 입력 모달 */}
      {showPasswordPrompt && (
        <div
          className="modal-overlay"
          onClick={() => setShowPasswordPrompt(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>
              선택한 {selectedForDeletion.size}장의 사진을 영구적으로 삭제하려면
              비밀번호를 입력하세요.
            </p>
            <input
              type="password"
              className="password-input"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="fortune-btn"
                onClick={handlePasswordSubmit}
                style={{ backgroundColor: "#dc3545", color: "white" }}
              >
                삭제하기
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
    </div>
  );
};

export default MonthlyPhotos;
