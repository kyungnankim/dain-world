// api/monthly.js - CommonJS 형식으로 복원
const cloudinary = require("cloudinary").v2;

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        error: "month 파라미터가 필요합니다",
        example: "/api/monthly?month=1",
      });
    }

    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        error: "month는 1-12 사이의 숫자여야 합니다",
        received: month,
      });
    }

    console.log(`🔍 ${monthNum}월 사진 검색 시작...`);

    const result = await cloudinary.search
      .expression(`folder:dain-world/${monthNum}`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    console.log(`📁 ${monthNum}월: ${result.resources.length}장 발견`);

    const photos = result.resources.map((resource) => ({
      id: resource.public_id,
      month: monthNum,
      url: resource.secure_url,
      thumbnailUrl: cloudinary.url(resource.public_id, {
        transformation: [
          {
            width: 300,
            height: 300,
            crop: "fill",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      }),
      fullUrl: cloudinary.url(resource.public_id, {
        transformation: [
          {
            width: 800,
            height: 800,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      }),
      alt: `${monthNum}월 다인이 사진`,
      name: resource.filename || resource.public_id.split("/").pop(),
      createdAt: resource.created_at,
      filePath: resource.public_id,
    }));

    console.log(`✅ ${monthNum}월 검색 완료: ${photos.length}장`);

    res.status(200).json({
      photos,
      month: monthNum,
      totalPhotos: photos.length,
    });
  } catch (error) {
    console.error(`❌ ${req.query.month}월 사진 불러오기 실패:`, error);
    res.status(500).json({
      error: "월별 사진 불러오기 실패",
      details: error.message,
      month: req.query.month,
    });
  }
};
