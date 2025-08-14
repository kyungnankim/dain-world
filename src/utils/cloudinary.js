export const getAllPhotos = async () => {
  try {
    console.log("🔍 getAllPhotos 함수 호출됨");

    const response = await fetch("/api/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📡 API 응답 상태:", response.status);

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 받은 데이터:", data);

    // API에서 받은 photos 배열 반환
    const photos = data.photos || [];
    console.log(`✅ 파싱된 사진 수: ${photos.length}장`);

    return photos;
  } catch (error) {
    console.error("❌ getAllPhotos 에러:", error);
    throw error;
  }
};

export const getMonthlyPhotos = async (month) => {
  try {
    console.log(`🔍 getMonthlyPhotos 호출됨 - ${month}월`);

    const response = await fetch(`/api/monthly?month=${month}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`📡 ${month}월 API 응답 상태:`, response.status);

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📦 ${month}월 받은 데이터:`, data);

    const photos = data.photos || [];
    console.log(`✅ ${month}월 파싱된 사진 수: ${photos.length}장`);

    return photos;
  } catch (error) {
    console.error(`❌ getMonthlyPhotos 에러 (${month}월):`, error);
    throw error;
  }
};

export const uploadPhotos = async (files, month) => {
  try {
    console.log(`📤 사진 업로드 시작 - ${month}월, ${files.length}개 파일`);

    const formData = new FormData();
    formData.append("month", month);

    // 여러 파일 추가
    Array.from(files).forEach((file) => {
      formData.append("file", file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    console.log("📡 업로드 응답 상태:", response.status);

    if (!response.ok) {
      throw new Error(`업로드 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 업로드 응답 데이터:", data);

    if (!data.success) {
      throw new Error(data.error || "업로드 실패");
    }

    console.log(`✅ 업로드 성공: ${data.photos?.length || 0}장`);
    return data.photos || [];
  } catch (error) {
    console.error("❌ uploadPhotos 에러:", error);
    throw error;
  }
};

export const deletePhotos = async (photoIds) => {
  try {
    console.log("🗑️ 사진 삭제 시작:", photoIds);

    const response = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photoIds }),
    });

    console.log("📡 삭제 응답 상태:", response.status);

    if (!response.ok) {
      throw new Error(`삭제 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 삭제 응답 데이터:", data);

    if (!data.success) {
      throw new Error(data.error || "삭제 실패");
    }

    console.log(`✅ 삭제 성공: ${data.deletedCount}장`);
    return data;
  } catch (error) {
    console.error("❌ deletePhotos 에러:", error);
    throw error;
  }
};
