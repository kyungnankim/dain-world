import React, { useState, useRef, useEffect } from "react";

const CORRECT_PASSWORD = "0923"; // 삭제 비밀번호
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// ✅ 제한 완전 제거 또는 큰 값으로 설정
const MAX_PHOTOS_PER_MONTH = 999; // 사실상 무제한 (또는 Number.MAX_SAFE_INTEGER)

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

  // ✅ 제한 로직 비활성화
  const canUpload = true; // 항상 업로드 가능
  const remainingSlots = 999; // 사실상 무제한
  const needsDelete = false; // 삭제 강제하지 않음

  const generateCloudinaryUrl = (publicId, transformation = "") => {
    const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
    return `${baseUrl}${
      transformation ? `/${transformation}` : ""
    }/${publicId}`;
  };

  const handleFileSelect = (e) => {
    // ✅ 업로드 제한 체크 제거
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );

    // ✅ 파일 개수 제한도 제거 (원하면 합리적인 제한은 둘 수 있음)
    // 예: 한 번에 너무 많은 파일 선택 방지용으로 20장 정도 제한
    if (files.length > 20) {
      alert("한 번에 최대 20장까지 선택할 수 있습니다.");
      return;
    }

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

  const handleUpload = async () => {
    if (previewImages.length === 0) return;

    // ✅ 업로드 제한 체크 제거
    setUploading(true);

    const failedUploads = [];

    try {
      const uploadPromises = previewImages.map(async (item) => {
        try {
          const formData = new FormData();
          formData.append("month", month);
          formData.append("file", item.file, item.name);

          console.log(`🚀 API로 '${item.name}' 파일 전송 시작...`);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || `'${item.name}' 업로드 실패`);
          }

          return result.photos[0];
        } catch (uploadError) {
          console.error(`💥 '${item.name}' 업로드 중 오류:`, uploadError);
          failedUploads.push({ name: item.name, reason: uploadError.message });
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((p) => p !== null);

      if (successfulUploads.length === 0) {
        throw new Error("모든 파일 업로드에 실패했습니다.");
      }

      const finalPhotos = successfulUploads.map((p) => ({
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

      finalPhotos.forEach(onPhotoUploaded);
      handleUploadSuccess(finalPhotos);

      if (failedUploads.length > 0) {
        const failedFileNames = failedUploads.map((f) => f.name).join(", ");
        alert(`${failedUploads.length}개 파일 업로드 실패: ${failedFileNames}`);
      }

      setPreviewImages([]);
    } catch (error) {
      console.error("💥 전체 업로드 과정 오류:", error);
      alert(`업로드 실패:\n${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const togglePhotoForDeletion = (photoId) => {
    setPhotosToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) newSet.delete(photoId);
      else newSet.add(photoId);
      return newSet;
    });
  };

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

      {/* ✅ 제한 관련 스타일 및 비활성화 로직 모두 제거 */}
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
            사진 선택
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
              {uploading ? "업로드 중..." : `${previewImages.length}장 업로드`}
            </button>
          </div>
        )}
      </div>

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
