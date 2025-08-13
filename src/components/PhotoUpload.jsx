// src/components/PhotoUpload.jsx
import React, { useState, useRef } from "react";

// ImageKit 설정
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/duixwrddg";
const MAX_PHOTOS_PER_MONTH = 3;
const CORRECT_PASSWORD = "0923";

const PhotoUpload = ({
  month,
  monthName,
  onBack,
  onPhotoUploaded,
  existingPhotos = [],
  onDeleteSelectedPhotos, // onDeleteExistingPhotos -> onDeleteSelectedPhotos로 변경
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [photosToDelete, setPhotosToDelete] = useState([]); // 삭제할 사진 ID 목록
  const fileInputRef = useRef(null);

  const existingPhotoCount = existingPhotos.length;
  const canUploadMore = existingPhotoCount < MAX_PHOTOS_PER_MONTH;

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    const availableSlots = MAX_PHOTOS_PER_MONTH - existingPhotoCount;
    if (files.length > availableSlots) {
      alert(`사진은 최대 ${availableSlots}장까지만 더 추가할 수 있습니다.`);
      return;
    }

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setPreviewImages(previews);
  };

  // ImageKit 업로드 시뮬레이션
  const uploadToImageKitSimple = async (file) => {
    const fileName = `${Date.now()}_${file.name.replace(
      /[^a-zA-Z0-9.]/g,
      "_"
    )}`;
    const mockUrl = `${IMAGEKIT_URL_ENDPOINT}/dain-world/${month}월/${fileName}`;
    console.log("ImageKit 업로드 시뮬레이션:", mockUrl);
    return {
      url: mockUrl,
      fileName: fileName,
    };
  };

  // 업로드 실행
  const handleUpload = async () => {
    if (previewImages.length === 0) {
      alert("업로드할 사진을 선택해주세요.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = previewImages.map(async (item, index) => {
        const uploadResult = await uploadToImageKitSimple(item.file);
        setUploadProgress(
          Math.round(((index + 1) / previewImages.length) * 100)
        );
        return {
          id: Date.now() + index,
          url: uploadResult.url,
          thumbnailUrl: `${uploadResult.url}?tr=w-300,h-300,c-at_max,q-60,f-webp`,
          fullUrl: `${uploadResult.url}?tr=w-600,h-600,c-at_max,q-70,f-webp`,
          fileName: uploadResult.fileName,
          uploadDate: new Date().toISOString(),
          month: month,
          alt: `${monthName} 다인이 사진`,
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      uploadedPhotos.forEach((photo) => onPhotoUploaded(photo));

      alert(`${uploadedPhotos.length}장의 사진이 성공적으로 업로드되었습니다!`);
      setPreviewImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("업로드 오류:", error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // 삭제할 사진 선택/해제
  const togglePhotoForDeletion = (photoId) => {
    setPhotosToDelete((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  // 전체 선택
  const handleSelectAllForDeletion = () => {
    if (photosToDelete.length === existingPhotos.length) {
      setPhotosToDelete([]); // 모두 선택된 상태면 전체 해제
    } else {
      setPhotosToDelete(existingPhotos.map((p) => p.id)); // 아니면 전체 선택
    }
  };

  // 비밀번호 확인 및 선택된 사진 삭제 처리
  const handlePasswordSubmit = () => {
    if (passwordInput === CORRECT_PASSWORD) {
      alert("인증되었습니다. 선택한 사진을 삭제합니다.");
      onDeleteSelectedPhotos(photosToDelete); // 부모에게 선택된 ID 목록 전달
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPhotosToDelete([]); // 선택 목록 초기화
    } else {
      alert("비밀번호가 틀렸습니다.");
      setPasswordInput("");
    }
  };

  // 미리보기 이미지 제거
  const removePreviewImage = (index) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

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
                disabled={uploading}
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
              <p>최대 3장까지 업로드 가능합니다. 삭제할 사진을 선택하세요.</p>
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
                      alt={`기존 사진`}
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
                  {previewImages.map((item, index) => (
                    <div key={index} className="preview-item">
                      <img src={item.preview} alt={`미리보기 ${index + 1}`} />
                      <button
                        className="remove-btn"
                        onClick={() => removePreviewImage(index)}
                        disabled={uploading}
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
                    ? `업로드 중... ${uploadProgress}%`
                    : `${previewImages.length}장 업로드하기`}
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
