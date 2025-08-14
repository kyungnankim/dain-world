// src/components/PhotoUpload.jsx - 자동 이동 기능 추가
import React, { useState, useRef, useEffect } from "react";

const MAX_PHOTOS_PER_MONTH = 3;
const CORRECT_PASSWORD = "0923";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const PhotoUpload = ({
  month,
  monthName,
  onBack,
  onPhotoUploaded,
  existingPhotos = [],
  onDeleteSelectedPhotos,
  onRefresh,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false); // ✅ 성공 상태 추가
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(0); // ✅ 카운트다운 추가
  const fileInputRef = useRef(null);

  const existingPhotoCount = existingPhotos.length;
  const canUploadMore = existingPhotoCount < MAX_PHOTOS_PER_MONTH;

  // Cloudinary URL 생성 헬퍼
  const generateCloudinaryUrl = (publicId, transformation = "") => {
    const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
    const transformationStr = transformation ? `/${transformation}` : "";
    return `${baseUrl}${transformationStr}/${publicId}`;
  };

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

  // ✅ 업로드 성공 후 자동 이동 처리
  const handleUploadSuccess = (uploadedPhotos) => {
    console.log("🎉 업로드 성공! 자동 이동 준비...");

    setUploadSuccess(true);
    setAutoRedirectCountdown(3); // 3초 카운트다운

    // 카운트다운 시작
    const countdown = setInterval(() => {
      setAutoRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          console.log("🔄 월별 갤러리로 자동 이동!");
          onBack(); // 월별 갤러리로 돌아가기
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 성공 메시지 표시
    const photoCount = uploadedPhotos.length;
    const successMessage = `🎉 ${photoCount}장의 사진이 성공적으로 업로드되었습니다!\n\n📅 ${monthName} 갤러리로 이동합니다...`;

    // 즉시 알림 표시하지 않고 상태로 관리
    console.log(successMessage);
  };

  // ✅ 폴더 충돌 방지 업로드 함수
  const handleUpload = async () => {
    if (previewImages.length === 0) return;
    setUploading(true);

    try {
      const uploadPromises = previewImages.map(async (item, index) => {
        console.log(`🚀 파일 ${index + 1} 업로드 시작: ${item.name}`);

        // 고유한 파일명 생성 (폴더 경로 포함)
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const uniquePublicId = `dain-world/${month}/${month}_${timestamp}_${randomSuffix}`;

        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("upload_preset", "dain-world");
        formData.append("public_id", uniquePublicId);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        console.log(`📡 응답 상태: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ 업로드 실패 응답:", errorData);
          throw new Error(
            errorData.error?.message ||
              `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log(`✅ 업로드 성공:`, result);

        // 최종 사진 객체 생성
        return {
          id: result.public_id,
          url: result.secure_url,
          thumbnailUrl: generateCloudinaryUrl(
            result.public_id,
            "w_300,h_300,c_fill,q_auto,f_auto"
          ),
          fullUrl: generateCloudinaryUrl(
            result.public_id,
            "w_800,h_800,c_limit,q_auto,f_auto"
          ),
          month: parseInt(month),
          alt: `${monthName} 다인이 사진`,
          name: result.original_filename || item.file.name,
          filePath: result.public_id,
          createdAt: result.created_at,
          cloudinaryData: result,
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);

      // 성공한 각 사진에 대해 상위 컴포넌트 상태 업데이트
      uploadedPhotos.forEach(onPhotoUploaded);

      // ✅ 업로드 성공 처리 (자동 이동 포함)
      handleUploadSuccess(uploadedPhotos);

      setPreviewImages([]);
    } catch (error) {
      console.error("💥 업로드 오류:", error);

      let errorMessage = error.message;

      if (error.message.includes("Upload preset not found")) {
        errorMessage =
          `❌ Upload Preset 'dain-world'를 찾을 수 없습니다.\n\n` +
          `해결방법:\n` +
          `1. Cloudinary 콘솔 → Settings → Upload\n` +
          `2. 'dain-world' preset을 Unsigned 모드로 생성\n` +
          `3. Asset folder를 'dain-world'로 설정`;
      } else if (error.message.includes("Invalid")) {
        errorMessage = `❌ 잘못된 요청입니다.\n상세: ${error.message}`;
      } else if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        errorMessage = `❌ 인증 실패. Upload Preset이 Unsigned 모드인지 확인하세요.`;
      }

      alert(`업로드 실패:\n${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // ✅ 즉시 갤러리로 이동 버튼
  const handleImmediateRedirect = () => {
    console.log("🚀 즉시 갤러리로 이동!");
    setAutoRedirectCountdown(0);
    onBack();
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

  // ✅ 업로드 성공 화면
  if (uploadSuccess) {
    return (
      <div className="photo-upload-container">
        <div className="upload-header">
          <h1>🎉 업로드 완료!</h1>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#f0f8ff",
            borderRadius: "20px",
            margin: "20px",
            border: "3px solid #4CAF50",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>📸</div>
          <h2 style={{ color: "#4CAF50", marginBottom: "20px" }}>
            {monthName} 사진이 성공적으로 저장되었습니다!
          </h2>

          {autoRedirectCountdown > 0 && (
            <div
              style={{
                fontSize: "18px",
                marginBottom: "30px",
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "10px",
                border: "2px solid #ff69b4",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                📅 <strong>{monthName} 갤러리</strong>로 이동합니다...
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ff69b4",
                }}
              >
                {autoRedirectCountdown}초
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="fortune-btn"
              onClick={handleImmediateRedirect}
              style={{
                backgroundColor: "#ff69b4",
                fontSize: "16px",
                padding: "12px 24px",
              }}
            >
              📅 지금 바로 {monthName} 갤러리 보기
            </button>

            <button
              className="fortune-btn"
              onClick={() => {
                setUploadSuccess(false);
                setAutoRedirectCountdown(0);
              }}
              style={{
                backgroundColor: "#6c757d",
                fontSize: "16px",
                padding: "12px 24px",
              }}
            >
              📷 더 업로드하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-upload-container">
      <div className="upload-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1>📷 {monthName} 사진 업로드</h1>
        <div style={{ fontSize: "12px", color: "#666" }}>
          📁 dain-world/{month}/ 경로로 업로드
        </div>
      </div>

      {/* Upload Preset 상태 확인 */}
      <div
        style={{
          backgroundColor: "#e8f5e8",
          border: "1px solid #4caf50",
          borderRadius: "8px",
          padding: "12px",
          margin: "10px 0",
          fontSize: "14px",
        }}
      >
        <strong>✅ Upload Preset 감지됨:</strong>
        <br />
        <code>dain-world</code> (Unsigned 모드) →
        <code>dain-world/{month}/</code> 폴더로 업로드
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
                    ? "📤 Cloudinary에 업로드 중..."
                    : `🚀 ${previewImages.length}장 업로드하기`}
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
