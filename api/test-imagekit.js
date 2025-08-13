// Node.js 환경에서 ImageKit API 테스트
import fetch from "node-fetch"; // npm install node-fetch 필요

// 기본 URL 설정 (개발 서버 주소)
const BASE_URL = "http://localhost:3000"; // Next.js 기본 포트

// 1. ImageKit Auth API 테스트
async function testImageKitAuth() {
  try {
    console.log("🔍 ImageKit 인증 API 테스트 시작...");

    const response = await fetch(`${BASE_URL}/api/getImageKitAuth`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ API 응답:", data);

    // 응답 검증
    const checks = {
      hasToken: !!data.token,
      hasExpire: !!data.expire,
      hasSignature: !!data.signature,
      hasPublicKey: !!data.publicKey,
      hasUrlEndpoint: !!data.urlEndpoint,
      publicKeyFormat: data.publicKey?.startsWith("public_"),
      urlEndpointFormat: data.urlEndpoint?.startsWith(
        "https://ik.imagekit.io/"
      ),
    };

    console.log("🔍 응답 검증:", checks);

    if (Object.values(checks).every(Boolean)) {
      console.log("🎉 ImageKit 설정이 올바릅니다!");
    } else {
      console.log("❌ ImageKit 설정에 문제가 있습니다.");
    }

    return data;
  } catch (error) {
    console.error("❌ API 호출 실패:", error.message);

    // 개발 서버 실행 여부 확인
    if (error.code === "ECONNREFUSED") {
      console.log("💡 해결 방법: 개발 서버를 먼저 실행해주세요.");
      console.log("   npm run dev 또는 yarn dev");
    }
  }
}

// 2. 월별 사진 API 테스트
async function testMonthlyPhotos(month = "1월") {
  try {
    console.log(`🔍 ${month} 사진 API 테스트 시작...`);

    const encodedMonth = encodeURIComponent(month);
    const response = await fetch(
      `${BASE_URL}/api/getMonthlyPhotos?folder=${encodedMonth}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log(`✅ ${month} 사진 API 응답:`, data);
    return data;
  } catch (error) {
    console.error(`❌ ${month} 사진 API 호출 실패:`, error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("💡 해결 방법: 개발 서버를 먼저 실행해주세요.");
    }
  }
}

// 3. 서버 연결 확인
async function checkServerConnection() {
  try {
    console.log("🔍 서버 연결 확인 중...");
    const response = await fetch(BASE_URL);
    console.log(`✅ 서버 연결 성공 (${response.status})`);
    return true;
  } catch (error) {
    console.log("❌ 서버 연결 실패");
    console.log("💡 다음 명령어로 개발 서버를 실행해주세요:");
    console.log("   npm run dev 또는 yarn dev");
    return false;
  }
}

// 4. 전체 테스트 실행
async function runAllTests() {
  console.log("🚀 ImageKit 전체 설정 테스트 시작");
  console.log("=====================================");

  // 서버 연결 확인
  const isServerRunning = await checkServerConnection();
  if (!isServerRunning) {
    return;
  }

  console.log("-------------------------------------");

  // Auth API 테스트
  await testImageKitAuth();

  console.log("-------------------------------------");

  // 사진 API 테스트 (1월)
  await testMonthlyPhotos("1월");

  console.log("=====================================");
  console.log("✅ 테스트 완료");
}

// 환경 확인
console.log("📝 사용 전 준비사항:");
console.log("1. 개발 서버 실행: npm run dev");
console.log("2. node-fetch 설치: npm install node-fetch");
console.log("");
console.log("🔧 사용 가능한 함수:");
console.log("1. checkServerConnection() - 서버 연결 확인");
console.log("2. testImageKitAuth() - 인증 API 테스트");
console.log("3. testMonthlyPhotos('1월') - 월별 사진 API 테스트");
console.log("4. runAllTests() - 전체 테스트 실행");
console.log("");

// 즉시 실행
runAllTests();
