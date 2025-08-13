// api/getMonthlyPhotos.js - 숫자 폴더명 지원
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = async function handler(req, res) {
  // CORS 헤더 추가
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { folder } = req.query;
  if (!folder) {
    return res.status(400).json({ error: "folder 파라미터가 필요합니다" });
  }

  console.log(`📂 폴더 요청: "${folder}"`);

  try {
    // 환경 변수 확인
    console.log("🔑 환경 변수 확인:");
    console.log("- PUBLIC_KEY:", !!process.env.IMAGEKIT_PUBLIC_KEY);
    console.log("- PRIVATE_KEY:", !!process.env.IMAGEKIT_PRIVATE_KEY);
    console.log("- URL_ENDPOINT:", process.env.IMAGEKIT_URL_ENDPOINT);

    const files = await imagekit.listFiles({
      path: `dain-world/${folder}`, // 예: dain-world/1, dain-world/2
      limit: 100,
    });

    console.log(`✅ ImageKit API 응답: ${files.length}개 파일 발견`);

    const photos = files.map((file, index) => ({
      url: file.url,
      thumbnailUrl: `${file.url}?tr=w-300,h-300,c-at_max,q-60,f-webp`,
      fullUrl: `${file.url}?tr=w-600,h-600,c-at_max,q-70,f-webp`,
      fortuneUrl: `${file.url}?tr=w-150,h-150,c-at_max,q-50,f-webp`,
      bgUrl: `${file.url}?tr=w-100,h-100,c-at_max,q-30,f-webp,bl-3`,
      alt: file.name,
      name: file.name,
      id: file.fileId || `${folder}-${Date.now()}-${index}`,
      fileId: file.fileId,
      filePath: file.filePath,
      createdAt: file.createdAt,
    }));

    console.log(`📤 응답 전송: ${photos.length}장의 사진 데이터`);
    res.status(200).json(photos);
  } catch (error) {
    console.error("❌ ImageKit API 오류:", error);
    res.status(500).json({
      error: "이미지 불러오기 실패",
      details: error.message,
      folder: folder,
    });
  }
};
