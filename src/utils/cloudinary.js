// src/utils/cloudinary.js - Fallback 처리 버전
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Cloudinary URL 생성 헬퍼 함수
export const generateCloudinaryUrl = (publicId, transformation = "") => {
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  const transformationStr = transformation ? `/${transformation}` : "";
  return `${baseUrl}${transformationStr}/${publicId}`;
};

// ✅ API 호출 + Fallback 처리
export const getAllPhotos = async () => {
  try {
    console.log("🔍 백엔드 API를 통해 모든 사진 검색...");

    const response = await fetch("/api/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const photos = data.photos || [];

    console.log(`✅ 총 ${photos.length}장 사진 로드 완료`);
    return photos;
  } catch (error) {
    console.error("❌ 백엔드 API 실패:", error);

    // ✅ Fallback: 사용자에게 안내 메시지
    console.log("🔄 Fallback: Vercel 개발 서버가 실행되지 않았을 수 있습니다.");

    // 임시로 빈 배열 반환하되, 사용자에게 알림
    if (error.message.includes("<!DOCTYPE")) {
      alert(
        `⚠️ API 서버 문제 발견!\n\n해결방법:\n1. 터미널에서 'vercel dev' 실행\n2. 또는 'npm run dev'로 재시작\n\n현재는 업로드만 가능하고 조회는 안 됩니다.`
      );
    }

    return [];
  }
};

// ✅ 특정 월 사진 조회 + Fallback
export const getMonthlyPhotos = async (month) => {
  try {
    console.log(`🔍 ${month}월 사진을 백엔드 API에서 검색...`);

    const response = await fetch(`/api/monthly?month=${month}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`${month}월 API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const photos = data.photos || [];

    console.log(`✅ ${month}월: ${photos.length}장 사진 반환`);
    return photos;
  } catch (error) {
    console.error(`❌ ${month}월 사진 불러오기 실패:`, error);

    // ✅ Fallback 처리
    if (error.message.includes("<!DOCTYPE")) {
      console.log(`🔄 ${month}월 조회 실패: API 서버 문제`);

      // 사용자에게 한 번만 알림 (localStorage로 제어)
      const alertKey = "api_error_shown";
      if (!localStorage.getItem(alertKey)) {
        alert(
          `⚠️ API 서버가 실행되지 않았습니다!\n\n해결방법:\n1. 새 터미널 열기\n2. 'vercel dev' 실행\n3. http://localhost:3000 확인\n4. 페이지 새로고침\n\n현재는 업로드만 가능합니다.`
        );
        localStorage.setItem(alertKey, "true");

        // 5분 후 다시 알림 가능하도록
        setTimeout(() => {
          localStorage.removeItem(alertKey);
        }, 5 * 60 * 1000);
      }
    }

    return [];
  }
};

// ✅ 사진 삭제 (API 방식 유지)
export const deletePhotos = async (photoIds) => {
  try {
    console.log("🗑️ 백엔드를 통해 사진 삭제:", photoIds);

    const response = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photoIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `삭제 API 호출 실패: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log(`🎉 삭제 완료: ${result.deletedCount || photoIds.length}장`);

    return result.deletedIds || photoIds;
  } catch (error) {
    console.error("❌ 사진 삭제 실패:", error);
    throw new Error(`삭제 실패: ${error.message}`);
  }
};

// ✅ 연결 테스트 함수
export const testConnection = async () => {
  try {
    console.log("🧪 백엔드 API 연결 테스트...");

    const response = await fetch("/api/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      const photoCount = data.photos?.length || 0;

      console.log("✅ API 연결 성공:", photoCount, "장");
      return {
        success: true,
        photoCount,
        message: `API 서버 정상 작동 (${photoCount}장)`,
      };
    } else {
      console.error("❌ API 연결 실패:", response.status);
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        suggestion: "Vercel dev 서버를 실행해주세요",
      };
    }
  } catch (error) {
    console.error("❌ 연결 테스트 실패:", error);

    let suggestion = "네트워크 연결을 확인해주세요";
    if (error.message.includes("<!DOCTYPE")) {
      suggestion = "터미널에서 'vercel dev'를 실행해주세요";
    }

    return {
      success: false,
      error: error.message,
      suggestion,
    };
  }
};

// ✅ API 서버 상태 확인
export const checkApiServer = async () => {
  try {
    const response = await fetch("/api/all");
    return response.ok;
  } catch {
    return false;
  }
};

// 브라우저 콘솔에서 사용할 수 있는 테스트 함수들
if (import.meta.env.DEV) {
  window.testCloudinaryConnection = testConnection;
  window.testMonth = getMonthlyPhotos;
  window.checkApiServer = checkApiServer;

  window.cloudinaryDebug = {
    getAllPhotos,
    getMonthlyPhotos,
    generateUrl: generateCloudinaryUrl,
    testConnection,
    checkApiServer,
    deletePhotos,
  };

  console.log("🔧 개발 모드: window.cloudinaryDebug 사용 가능");
  console.log("📋 사용법: await window.testCloudinaryConnection()");
  console.log("📋 사용법: await window.checkApiServer() - API 서버 확인");
}
