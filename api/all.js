// api/all.js - CommonJS 형식으로 복원 + 성능 개선
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
    console.log("🔍 전체 사진 검색 시작...");

    // ✅ 병렬 처리로 성능 개선
    const monthPromises = [];
    for (let month = 1; month <= 12; month++) {
      const promise = cloudinary.search
        .expression(`folder:dain-world/${month}`)
        .sort_by("created_at", "desc")
        .max_results(3) // 메인 갤러리용 최신 3장
        .execute()
        .then((result) => ({ month, result }))
        .catch((error) => {
          console.error(`❌ ${month}월 검색 실패:`, error.message);
          return { month, result: { resources: [] } };
        });
      monthPromises.push(promise);
    }

    // 모든 월 검색 결과 기다리기
    const monthResults = await Promise.all(monthPromises);

    const allPhotos = [];
    let totalFound = 0;

    // 결과 처리
    monthResults.forEach(({ month, result }) => {
      if (result.resources.length > 0) {
        console.log(`📁 ${month}월: ${result.resources.length}장 발견`);

        const monthPhotos = result.resources.map((resource) => ({
          id: resource.public_id,
          month,
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
          alt: `${month}월 다인이 사진`,
          name: resource.filename || resource.public_id.split("/").pop(),
          createdAt: resource.created_at,
          filePath: resource.public_id,
        }));

        allPhotos.push(...monthPhotos);
        totalFound += monthPhotos.length;
      }
    });

    // 최신순 정렬
    allPhotos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`✅ 전체 검색 완료: ${totalFound}장`);

    res.status(200).json({
      photos: allPhotos,
      totalPhotos: totalFound,
      monthsWithPhotos: monthResults.filter(
        (r) => r.result.resources.length > 0
      ).length,
    });
  } catch (error) {
    console.error("❌ 전체 사진 불러오기 실패:", error);
    res.status(500).json({
      error: "전체 사진 불러오기 실패",
      details: error.message,
    });
  }
};
