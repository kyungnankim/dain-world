// src/components/PhotoUpload.jsx
import React, { useState, useRef } from "react";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const fileInputRef = useRef(null);

  const existingPhotoCount = existingPhotos.length;
  const canUploadMore = existingPhotoCount < MAX_PHOTOS_PER_MONTH;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    const currentTotalCount = existingPhotoCount + previewImages.length;
    const availableSlots = MAX_PHOTOS_PER_MONTH - currentTotalCount;

    if (files.length > availableSlots) {
      alert(`사진은 최대 ${availableSlots}장까지만 더 추가할 수 있습니다.`);
      fileInputRef.current.value = "";
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      id: Date.now() + Math.random(),
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    fileInputRef.current.value = "";
  };

  const generateImageKitAuthToken = async () => {
    const res = await fetch("/api/getImageKitAuth");
    if (!res.ok) throw new Error("인증 토큰 요청 실패");
    return res.json();
  };

  const uploadToImageKit = async (file) => {
    const authParams = await generateImageKitAuthToken();
    const folderPath = `dain-world/${month}월/`;
    const cleanFileName = `${Date.now()}_${file.name.replace(
      /[^a-zA-Z0-9가-힣.]/g,
      "_"
    )}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicKey", authParams.publicKey);
    formData.append("signature", authParams.signature);
    formData.append("expire", authParams.expire);
    formData.append("token", authParams.token);
    formData.append("fileName", cleanFileName);
    formData.append("folder", folderPath);
    formData.append("useUniqueFileName", "false");

    const response = await fetch(`${authParams.urlEndpoint}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("ImageKit 업로드 실패");
    return response.json();
  };

  const handleUpload = async () => {
    if (previewImages.length === 0) {
      alert("업로드할 사진을 선택해주세요.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = previewImages.map(async (item, index) => {
        const result = await uploadToImageKit(item.file);
        setUploadProgress(
          Math.round(((index + 1) / previewImages.length) * 100)
        );
        return {
          id: `uploaded-${Date.now()}-${index}`,
          url: result.url,
          thumbnailUrl: result.url + "?tr=w-300,h-300,c-at_max,q-60,f-webp",
          fullUrl: result.url + "?tr=w-800,h-800,c-at_max,q-80,f-webp",
          fileName: result.name,
          fileId: result.fileId,
          filePath: result.filePath,
          uploadDate: new Date().toISOString(),
          month: month,
          alt: `${monthName} 다인이 사진`,
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      uploadedPhotos.forEach(onPhotoUploaded);

      alert(`${uploadedPhotos.length}장의 사진이 업로드되었습니다!`);
      previewImages.forEach((item) => URL.revokeObjectURL(item.preview));
      setPreviewImages([]);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const togglePhotoForDeletion = (photoId) => {
    setPhotosToDelete((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === CORRECT_PASSWORD) {
      onDeleteSelectedPhotos(photosToDelete);
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPhotosToDelete([]);
    } else {
      alert("비밀번호가 틀렸습니다.");
      setPasswordInput("");
    }
  };

  return (
    <div className="photo-upload-container">
      <div className="upload-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1>📷 {monthName} 사진 업로드</h1>
      </div>
      {/* 업로드 / 삭제 UI 기존 구조 그대로 유지 */}
    </div>
  );
};

export default PhotoUpload;
