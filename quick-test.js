// 간단한 서버 연결 테스트
import fetch from "node-fetch";

async function quickTest() {
  const ports = [5173, 3000, 8080, 4173]; // 가능한 포트들

  console.log("🔍 서버 포트 스캔 중...");

  for (const port of ports) {
    try {
      console.log(`포트 ${port} 확인 중...`);
      const response = await fetch(`http://localhost:${port}`, {
        timeout: 3000,
      });
      console.log(`✅ 포트 ${port}에서 서버 발견! (상태: ${response.status})`);

      // API 경로들 테스트
      const apiPaths = ["/api/getImageKitAuth", "/api/getMonthlyPhotos"];

      for (const path of apiPaths) {
        try {
          const apiResponse = await fetch(`http://localhost:${port}${path}`, {
            timeout: 3000,
          });
          console.log(
            `  📡 ${path}: ${apiResponse.status} ${apiResponse.statusText}`
          );
        } catch (apiError) {
          console.log(`  ❌ ${path}: ${apiError.message}`);
        }
      }

      return port; // 첫 번째로 찾은 포트 반환
    } catch (error) {
      console.log(`  ❌ 포트 ${port}: ${error.message}`);
    }
  }

  console.log("❌ 활성화된 서버를 찾을 수 없습니다.");
  return null;
}

// 실행
quickTest();
