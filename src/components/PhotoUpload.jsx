// src/components/PhotoUpload.jsx
import React, { useState, useRef, useEffect } from "react";

const MAX_PHOTOS_PER_MONTH = 3;
const CORRECT_PASSWORD = "0923";

const PhotoUpload = ({
  month,
  monthName,
  onBack,
  onPhotoUploaded,
  existingPhotos = [],
  onDeleteSelectedPhotos,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const fileInputRef = useRef(null);

  const existingPhotoCount = existingPhotos.length;
  const canUploadMore = existingPhotoCount < MAX_PHOTOS_PER_MONTH;

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    const availableSlots =
      MAX_PHOTOS_PER_MONTH - (existingPhotoCount + previewImages.length);
    if (files.length > availableSlots) {
      alert(`사진은 최대 ${availableSlots}장까지만 더 추가할 수 있습니다.`);
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      id: Date.now() + Math.random(),
    }));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // FileReader를 사용한 임시 업로드
  const uploadWithFileReader = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({ url: reader.result, fileName: file.name });
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // 업로드 실행
  const handleUpload = async () => {
    if (previewImages.length === 0) return;
    setUploading(true);

    try {
      const uploadPromises = previewImages.map(async (item, index) => {
        const result = await uploadWithFileReader(item.file);
        return {
          id: `uploaded-${Date.now()}-${index}`,
          url: result.url,
          thumbnailUrl: result.url,
          fullUrl: result.url,
          month: month,
          alt: `${monthName} 다인이 사진`,
        };
      });
      const uploadedPhotos = await Promise.all(uploadPromises);
      uploadedPhotos.forEach(onPhotoUploaded);
      alert(`${uploadedPhotos.length}장의 사진이 임시로 추가되었습니다!`);
      setPreviewImages([]);
    } catch (error) {
      alert(`사진을 처리하는 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === CORRECT_PASSWORD) {
      onDeleteSelectedPhotos(photosToDelete);
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPhotosToDelete([]);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const removePreviewImage = (imageId) => {
    setPreviewImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const togglePhotoForDeletion = (photoId) => {
    setPhotosToDelete((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAllForDeletion = () => {
    if (photosToDelete.length === existingPhotos.length) {
      setPhotosToDelete([]);
    } else {
      setPhotosToDelete(existingPhotos.map((p) => p.id));
    }
  };

  // 컴포넌트가 사라질 때 미리보기 URL 메모리 해제
  useEffect(() => {
    return () => {
      previewImages.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [previewImages]);

  return (
    <div className="photo-upload-container">
      <div className="upload-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1>📷 {monthName} 사진 업로드</h1>
      </div>

      {showPasswordPrompt ? (
        <div className="password-prompt-section">
          <h3>선택한 사진을 삭제하려면 비밀번호를 입력하세요.</h3>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="비밀번호"
            className="password-input"
          />
          <button className="fortune-btn" onClick={handlePasswordSubmit}>
            확인
          </button>
        </div>
      ) : (
        <>
          {canUploadMore ? (
            <div className="file-selector">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                id="photo-input"
              />
              <label htmlFor="photo-input" className="file-input-label">
                📁 사진 선택하기
              </label>
              <p className="file-hint">
                앞으로 {MAX_PHOTOS_PER_MONTH - existingPhotoCount}장 더 추가할
                수 있습니다.
              </p>
            </div>
          ) : (
            <div className="replacement-section">
              <h3>🖼️ 교체할 사진 선택</h3>
              <p>삭제할 사진을 선택하세요.</p>
              <div className="preview-grid deletion-mode">
                {existingPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`preview-item selectable ${
                      photosToDelete.includes(photo.id)
                        ? "selected-for-deletion"
                        : ""
                    }`}
                    onClick={() => togglePhotoForDeletion(photo.id)}
                  >
                    <img
                      src={photo.thumbnailUrl || photo.url}
                      alt="기존 사진"
                    />
                    <div className="selection-overlay">✓</div>
                  </div>
                ))}
              </div>
              <div className="deletion-controls">
                <button
                  className="fortune-btn"
                  onClick={handleSelectAllForDeletion}
                >
                  {photosToDelete.length === existingPhotos.length
                    ? "전체 해제"
                    : "전체 선택"}
                </button>
                <button
                  className="fortune-btn delete-btn"
                  onClick={() => setShowPasswordPrompt(true)}
                  disabled={photosToDelete.length === 0}
                >
                  선택한 사진 삭제 ({photosToDelete.length}장)
                </button>
              </div>
            </div>
          )}

          {previewImages.length > 0 && (
            <>
              <div className="preview-section">
                <h3>미리보기 ({previewImages.length}장)</h3>
                <div className="preview-grid">
                  {previewImages.map((item) => (
                    <div key={item.id} className="preview-item">
                      <img src={item.preview} alt={item.name} />
                      <button
                        className="remove-btn"
                        onClick={() => removePreviewImage(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="upload-section">
                <button
                  className="upload-btn-main"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading
                    ? "처리 중..."
                    : `${previewImages.length}장 추가하기`}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PhotoUpload;
