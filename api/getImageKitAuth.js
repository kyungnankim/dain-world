// 브라우저 개발자 도구 콘솔에서 실행할 코드

// 1. ImageKit Auth API 테스트
async function testImageKitAuth() {
  try {
    console.log("🔍 ImageKit 인증 API 테스트 시작...");

    const response = await fetch("/api/getImageKitAuth");
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
    console.error("❌ API 호출 실패:", error);
  }
}

// 2. 월별 사진 API 테스트
async function testMonthlyPhotos(month = "1월") {
  try {
    console.log(`🔍 ${month} 사진 API 테스트 시작...`);

    const response = await fetch(`/api/getMonthlyPhotos?folder=${month}`);
    const data = await response.json();

    console.log(`✅ ${month} 사진 API 응답:`, data);
    return data;
  } catch (error) {
    console.error(`❌ ${month} 사진 API 호출 실패:`, error);
  }
}

// 3. 전체 테스트 실행
async function runAllTests() {
  console.log("🚀 ImageKit 전체 설정 테스트 시작");
  console.log("=====================================");

  // Auth API 테스트
  await testImageKitAuth();

  console.log("-------------------------------------");

  // 사진 API 테스트 (1월)
  await testMonthlyPhotos("1월");

  console.log("=====================================");
  console.log("✅ 테스트 완료");
}

// 사용법:
console.log("다음 함수들을 사용하세요:");
console.log("1. testImageKitAuth() - 인증 API 테스트");
console.log("2. testMonthlyPhotos('1월') - 월별 사진 API 테스트");
console.log("3. runAllTests() - 전체 테스트 실행");

// 즉시 실행
runAllTests();
