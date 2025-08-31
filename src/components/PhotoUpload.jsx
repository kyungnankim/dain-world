// PhotoUpload.jsx - 실제 사진 업로드 컴포넌트
import React, { useState, useEffect } from "react";
import { uploadPhotos, deletePhotos } from "../utils/cloudinary";

const PhotoUpload = ({
  month,
  monthName,
  onBack,
  onPhotoUploaded,
  existingPhotos = [],
  onDeleteSelectedPhotos,
  onRefresh,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [deletionMode, setDeletionMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
  const [showReplacement, setShowReplacement] = useState(false);

  const CORRECT_PASSWORD = "0923";
  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    console.log(`PhotoUpload - ${month}월 컴포넌트 마운트됨`);
    console.log("기존 사진:", existingPhotos);
  }, [month, existingPhotos]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // 파일 개수 제한 확인
    if (selectedFiles.length + files.length > MAX_FILES) {
      alert(`최대 ${MAX_FILES}개의 파일만 선택할 수 있습니다.`);
      return;
    }

    // 파일 크기 및 형식 검증
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(
          `${file.name}은(는) 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.`
        );
        return false;
      }

      if (!file.type.startsWith("image/")) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // 새 파일들을 기존 선택된 파일들에 추가
    const newSelectedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newSelectedFiles);

    // 미리보기 생성
    const newPreviews = [...previews];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = {
          id: `preview_${Date.now()}_${Math.random()}`,
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        newPreviews.push(preview);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    // 파일 입력 초기화
    e.target.value = "";
  };

  const removePreview = (previewId) => {
    const previewToRemove = previews.find((p) => p.id === previewId);
    if (previewToRemove) {
      setSelectedFiles(selectedFiles.filter((f) => f !== previewToRemove.file));
      setPreviews(previews.filter((p) => p.id !== previewId));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      console.log(
        `${selectedFiles.length}개 파일을 ${month}월로 업로드 시작...`
      );

      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const uploadedPhotos = await uploadPhotos(selectedFiles, month);

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("업로드된 사진들:", uploadedPhotos);

      // 업로드된 각 사진에 대해 콜백 호출
      uploadedPhotos.forEach((photo) => {
        if (onPhotoUploaded) {
          onPhotoUploaded({
            ...photo,
            thumbnailUrl: photo.url, // 썸네일 URL 생성
            alt: `${month}월 다인이 사진`,
            createdAt: new Date().toISOString(),
          });
        }
      });

      // 상태 초기화
      setSelectedFiles([]);
      setPreviews([]);
      setUploadProgress(0);

      alert(`${uploadedPhotos.length}장의 사진이 성공적으로 업로드되었습니다!`);

      // 선택적으로 새로고침
      if (onRefresh) {
        setTimeout(onRefresh, 500);
      }
    } catch (error) {
      console.error("업로드 오류:", error);
      alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const toggleDeletionMode = () => {
    setDeletionMode(!deletionMode);
    setSelectedForDeletion(new Set());
  };

  const togglePhotoForDeletion = (photoId) => {
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
          if (onDeleteSelectedPhotos) {
            onDeleteSelectedPhotos(
              result.deletedIds || Array.from(selectedForDeletion)
            );
          }

          setShowPasswordPrompt(false);
          setPasswordInput("");
          setSelectedForDeletion(new Set());
          setDeletionMode(false);

          const message = result.partialSuccess
            ? `${result.deletedCount}/${result.totalRequested}장이 삭제되었습니다.`
            : `${result.deletedCount}장이 성공적으로 삭제되었습니다.`;

          alert(message);

          if (onRefresh) {
            setTimeout(onRefresh, 500);
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

  return (
    <div className="photo-upload-container">
      {/* 헤더 */}
      <div className="upload-header">
        <h1>{monthName} 사진 업로드</h1>
      </div>

      {/* 파일 선택 섹션 */}
      <div className="file-selector">
        <h3>사진 선택</h3>
        <input
          type="file"
          id="photo-input"
          className="file-input"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <label
          htmlFor="photo-input"
          className={`file-input-label ${isUploading ? "disabled" : ""}`}
        >
          {isUploading ? "업로드 중..." : "사진 선택하기"}
        </label>

        {selectedFiles.length > 0 && (
          <p style={{ marginTop: "10px", color: "#666" }}>
            {selectedFiles.length}개 파일 선택됨 (최대 {MAX_FILES}개)
          </p>
        )}
      </div>

      {/* 미리보기 섹션 */}
      {previews.length > 0 && (
        <div className="preview-section">
          <h3>미리보기</h3>
          <div className="preview-grid">
            {previews.map((preview) => (
              <div key={preview.id} className="preview-item">
                <img
                  src={preview.url}
                  alt={preview.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <button
                  className="remove-btn"
                  onClick={() => removePreview(preview.id)}
                  disabled={isUploading}
                >
                  ×
                </button>
                <div className="preview-info">
                  <small>{preview.name}</small>
                  <small>{(preview.size / 1024 / 1024).toFixed(1)}MB</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업로드 섹션 */}
      {selectedFiles.length > 0 && (
        <div className="upload-section">
          <button
            className="upload-btn-main"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading
              ? "업로드 중..."
              : `${selectedFiles.length}장 업로드하기`}
          </button>

          {isUploading && uploadProgress > 0 && (
            <div className="upload-progress">
              <div
                className="upload-progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 기존 사진 관리 섹션 */}
      {existingPhotos.length > 0 && (
        <div className="replacement-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3>기존 사진 관리 ({existingPhotos.length}장)</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="fortune-btn"
                onClick={toggleDeletionMode}
                style={{
                  backgroundColor: deletionMode ? "#dc3545" : "#6c757d",
                  color: "white",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
              >
                {deletionMode ? "취소" : "사진 삭제"}
              </button>

              {deletionMode && selectedForDeletion.size > 0 && (
                <button
                  className="fortune-btn"
                  onClick={handleDeleteRequest}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                >
                  선택 삭제 ({selectedForDeletion.size})
                </button>
              )}
            </div>
          </div>

          {deletionMode && (
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
                삭제할 사진을 선택하세요. 삭제된 사진은 복구할 수 없습니다.
              </p>
            </div>
          )}

          <div
            className={`preview-grid ${deletionMode ? "deletion-mode" : ""}`}
          >
            {existingPhotos.map((photo) => {
              const isSelected = selectedForDeletion.has(photo.id);
              return (
                <div
                  key={photo.id}
                  className={`preview-item ${
                    deletionMode ? "selectable" : ""
                  } ${isSelected ? "selected-for-deletion" : ""}`}
                  onClick={() =>
                    deletionMode && togglePhotoForDeletion(photo.id)
                  }
                >
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.alt || photo.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      opacity: isSelected ? 0.7 : 1,
                    }}
                  />
                  {isSelected && <div className="selection-overlay">✓</div>}
                </div>
              );
            })}
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
                className="fortune-btn delete-btn"
                onClick={handlePasswordSubmit}
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

      {/* 뒤로가기 버튼 */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button className="fortune-btn" onClick={onBack} disabled={isUploading}>
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;
