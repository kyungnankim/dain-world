import React, { useState, useRef, useEffect } from "react";

const CORRECT_PASSWORD = "0923"; // 삭제 비밀번호
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

function PhotoUpload({
  month,
  monthName,
  onBack,
  onPhotoUploaded,
  existingPhotos = [],
  onDeleteSelectedPhotos,
}) {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [photosToDelete, setPhotosToDelete] = useState(new Set());
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(0);
  const fileInputRef = useRef(null);

  // Cloudinary URL 생성 헬퍼
  const generateCloudinaryUrl = (publicId, transformation = "") => {
    const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
    return `${baseUrl}${
      transformation ? `/${transformation}` : ""
    }/${publicId}`;
  };

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      id: `${Date.now()}-${file.name}`,
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // 업로드 성공 처리
  const handleUploadSuccess = (uploadedPhotos) => {
    setUploadSuccess(true);
    setAutoRedirectCountdown(3);
    const countdown = setInterval(() => {
      setAutoRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 백엔드를 통한 업로드
  const handleUpload = async () => {
    if (previewImages.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("month", month);
      previewImages.forEach((item) =>
        formData.append("file", item.file, item.name)
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.success)
        throw new Error(result.error || "서버 업로드 실패");

      const uploadedPhotos = result.photos.map((p) => ({
        id: p.id,
        url: p.url,
        month: p.month,
        name: p.name,
        thumbnailUrl: generateCloudinaryUrl(
          p.id,
          "w_300,h_300,c_fill,q_auto,f_auto"
        ),
        fullUrl: generateCloudinaryUrl(
          p.id,
          "w_800,h_800,c_limit,q_auto,f_auto"
        ),
        createdAt: new Date().toISOString(),
      }));

      uploadedPhotos.forEach(onPhotoUploaded);
      handleUploadSuccess(uploadedPhotos);
      setPreviewImages([]);
    } catch (error) {
      console.error("💥 업로드 오류:", error);
      alert(`업로드 실패:\n${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // 삭제할 사진 선택/해제
  const togglePhotoForDeletion = (photoId) => {
    setPhotosToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) newSet.delete(photoId);
      else newSet.add(photoId);
      return newSet;
    });
  };

  // 삭제 실행 (비밀번호 확인 후)
  const handleDeleteRequest = () => {
    if (photosToDelete.size === 0) return;
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === CORRECT_PASSWORD) {
      onDeleteSelectedPhotos(Array.from(photosToDelete));
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPhotosToDelete(new Set());
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  useEffect(() => {
    return () =>
      previewImages.forEach((item) => URL.revokeObjectURL(item.preview));
  }, [previewImages]);

  // 업로드 성공 화면
  if (uploadSuccess) {
    return (
      <div
        className="photo-upload-container"
        style={{ textAlign: "center", padding: "40px 20px" }}
      >
        <div style={{ fontSize: "60px" }}>🎉</div>
        <h2>{monthName} 사진이 성공적으로 저장되었습니다!</h2>
        <p>
          {autoRedirectCountdown}초 후 {monthName} 갤러리로 이동합니다...
        </p>
        <button className="fortune-btn" onClick={onBack}>
          지금 바로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="photo-upload-container">
      <div className="upload-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1>📷 {monthName} 사진 관리</h1>
      </div>

      {/* --- 사진 추가 섹션 --- */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h3>새로운 사진 추가하기</h3>
        <div className="file-selector">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            id="photo-input"
          />
          <label htmlFor="photo-input" className="file-input-label">
            📁 컴퓨터에서 사진 선택
          </label>
        </div>

        {previewImages.length > 0 && (
          <div className="preview-section">
            <h4>업로드할 사진 ({previewImages.length}장)</h4>
            <div className="preview-grid">
              {previewImages.map((item) => (
                <div key={item.id} className="preview-item">
                  <img src={item.preview} alt={item.name} />
                  <button
                    className="remove-btn"
                    onClick={() =>
                      setPreviewImages((p) =>
                        p.filter((img) => img.id !== item.id)
                      )
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              className="upload-btn-main"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading
                ? "업로드 중..."
                : `🚀 ${previewImages.length}장 업로드`}
            </button>
          </div>
        )}
      </div>

      {/* --- 기존 사진 관리 섹션 --- */}
      <div className="card">
        <h3>기존 사진 관리 ({existingPhotos.length}장)</h3>
        {existingPhotos.length > 0 ? (
          <>
            <p>삭제할 사진을 선택하세요.</p>
            <div className="preview-grid deletion-mode">
              {existingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`preview-item selectable ${
                    photosToDelete.has(photo.id) ? "selected-for-deletion" : ""
                  }`}
                  onClick={() => togglePhotoForDeletion(photo.id)}
                >
                  <img src={photo.thumbnailUrl || photo.url} alt="기존 사진" />
                  <div className="selection-overlay">✓</div>
                </div>
              ))}
            </div>
            <div className="deletion-controls">
              <button
                className="fortune-btn delete-btn"
                onClick={handleDeleteRequest}
                disabled={photosToDelete.size === 0}
              >
                선택한 사진 삭제 ({photosToDelete.size}장)
              </button>
            </div>
          </>
        ) : (
          <p>이 달에는 아직 업로드된 사진이 없습니다.</p>
        )}
      </div>

      {/* 비밀번호 입력 모달 */}
      {showPasswordPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>삭제 확인</h3>
            <p>선택한 사진을 영구적으로 삭제하려면 비밀번호를 입력하세요.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호"
              className="password-input"
            />
            <div className="modal-actions">
              <button className="fortune-btn" onClick={handlePasswordSubmit}>
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
    </div>
  );
}

export default PhotoUpload;
