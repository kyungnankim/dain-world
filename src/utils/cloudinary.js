// utils/cloudinary.js - 개선된 Cloudinary 연결
export const getAllPhotos = async () => {
  try {
    console.log("getAllPhotos 함수 호출됨");

    const response = await fetch("/api/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // CORS 및 캐싱 설정
      mode: "cors",
      cache: "default",
    });

    console.log("API 응답 상태:", response.status);
    console.log("API 응답 헤더:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 오류 응답:", errorText);
      throw new Error(`API 호출 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("받은 데이터:", data);

    // API에서 받은 photos 배열 반환
    const photos = data.photos || [];
    console.log(`파싱된 사진 수: ${photos.length}장`);

    // 각 사진에 필요한 필드가 있는지 확인하고 보완
    const validatedPhotos = photos.map((photo) => ({
      id: photo.id || photo.public_id,
      month: photo.month || 1,
      url: photo.url || photo.secure_url,
      thumbnailUrl: photo.thumbnailUrl || photo.url || photo.secure_url,
      fullUrl: photo.fullUrl || photo.url || photo.secure_url,
      alt: photo.alt || `${photo.month || 1}월 다인이 사진`,
      name: photo.name || photo.filename || "사진",
      createdAt:
        photo.createdAt || photo.created_at || new Date().toISOString(),
      filePath: photo.filePath || photo.public_id,
    }));

    console.log("검증된 사진 데이터:", validatedPhotos);
    return validatedPhotos;
  } catch (error) {
    console.error("getAllPhotos 에러:", error);
    console.error("에러 스택:", error.stack);

    // 네트워크 오류인지 확인
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("네트워크 연결 오류: API 서버에 연결할 수 없습니다.");
    }

    throw error;
  }
};

export const getMonthlyPhotos = async (month) => {
  try {
    console.log(`getMonthlyPhotos 호출됨 - ${month}월`);

    // month 파라미터 검증
    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new Error(`유효하지 않은 월: ${month} (1-12 사이의 숫자여야 함)`);
    }

    const response = await fetch(`/api/monthly?month=${monthNum}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      cache: "default",
    });

    console.log(`${monthNum}월 API 응답 상태:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${monthNum}월 API 오류:`, errorText);
      throw new Error(
        `${monthNum}월 사진 조회 실패: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`${monthNum}월 받은 데이터:`, data);

    const photos = data.photos || [];
    console.log(`${monthNum}월 파싱된 사진 수: ${photos.length}장`);

    // 사진 데이터 검증 및 보완
    const validatedPhotos = photos.map((photo) => ({
      id: photo.id || photo.public_id,
      month: monthNum, // 요청한 월로 보장
      url: photo.url || photo.secure_url,
      thumbnailUrl: photo.thumbnailUrl || photo.url || photo.secure_url,
      fullUrl: photo.fullUrl || photo.url || photo.secure_url,
      alt: photo.alt || `${monthNum}월 다인이 사진`,
      name: photo.name || photo.filename || "사진",
      createdAt:
        photo.createdAt || photo.created_at || new Date().toISOString(),
      filePath: photo.filePath || photo.public_id,
    }));

    return validatedPhotos;
  } catch (error) {
    console.error(`getMonthlyPhotos 에러 (${month}월):`, error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(`${month}월 사진 로드 중 네트워크 오류가 발생했습니다.`);
    }

    throw error;
  }
};

export const uploadPhotos = async (files, month) => {
  try {
    console.log(`사진 업로드 시작 - ${month}월, ${files.length}개 파일`);

    // 입력 검증
    if (!files || files.length === 0) {
      throw new Error("업로드할 파일이 없습니다.");
    }

    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new Error(`유효하지 않은 월: ${month}`);
    }

    // FormData 생성
    const formData = new FormData();
    formData.append("month", monthNum.toString());

    // 파일들을 FormData에 추가
    Array.from(files).forEach((file, index) => {
      console.log(`파일 ${index + 1}: ${file.name}, 크기: ${file.size} bytes`);

      // 파일 크기 및 타입 검증
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        throw new Error(
          `${file.name}이(가) 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.`
        );
      }

      if (!file.type.startsWith("image/")) {
        throw new Error(`${file.name}은(는) 이미지 파일이 아닙니다.`);
      }

      formData.append("file", file);
    });

    // 업로드 요청
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      // Content-Type 헤더는 FormData 사용시 자동으로 설정됨
      mode: "cors",
    });

    console.log("업로드 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("업로드 오류 응답:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `업로드 실패: ${response.status}`);
      } catch {
        throw new Error(`업로드 실패: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log("업로드 응답 데이터:", data);

    if (!data.success) {
      throw new Error(data.error || "업로드에 실패했습니다.");
    }

    const uploadedPhotos = data.photos || [];
    console.log(`업로드 성공: ${uploadedPhotos.length}장`);

    // 업로드된 사진 데이터 검증 및 보완
    const validatedPhotos = uploadedPhotos.map((photo) => ({
      id: photo.id || photo.public_id,
      month: monthNum,
      url: photo.url || photo.secure_url,
      thumbnailUrl: photo.thumbnailUrl || photo.url || photo.secure_url,
      fullUrl: photo.fullUrl || photo.url || photo.secure_url,
      alt: `${monthNum}월 다인이 사진`,
      name: photo.name || photo.filename || "새 사진",
      createdAt: new Date().toISOString(),
      filePath: photo.filePath || photo.public_id,
    }));

    return validatedPhotos;
  } catch (error) {
    console.error("uploadPhotos 에러:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "업로드 중 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    }

    throw error;
  }
};

export const deletePhotos = async (photoIds) => {
  try {
    console.log("사진 삭제 시작:", photoIds);

    // 입력 검증
    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      throw new Error("삭제할 사진 ID가 없습니다.");
    }

    // 최대 삭제 개수 제한
    if (photoIds.length > 50) {
      throw new Error("한 번에 최대 50장까지만 삭제할 수 있습니다.");
    }

    const response = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ photoIds }),
      mode: "cors",
    });

    console.log("삭제 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("삭제 오류 응답:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `삭제 실패: ${response.status}`);
      } catch {
        throw new Error(`삭제 실패: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log("삭제 응답 데이터:", data);

    if (!data.success) {
      throw new Error(data.error || "삭제에 실패했습니다.");
    }

    console.log(`삭제 성공: ${data.deletedCount}장`);
    return data;
  } catch (error) {
    console.error("deletePhotos 에러:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "삭제 중 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    }

    throw error;
  }
};

// 연결 상태 확인 함수 (디버깅용)
export const testConnection = async () => {
  try {
    console.log("API 연결 테스트 시작...");

    const response = await fetch("/api/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("연결 테스트 응답:", response.status);

    if (response.ok) {
      console.log("✅ API 서버 연결 정상");
      return true;
    } else {
      console.log("❌ API 서버 연결 실패:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ API 연결 테스트 실패:", error);
    return false;
  }
};
