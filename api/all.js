// api/all.js - 모든 월 검색 버전
import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  console.log("🔍 all.js 호출됨 (전체 월 검색 모드)!");

  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Cloudinary 설정
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("🔍 전체 사진 검색 시작 (1월-12월)...");

    const searchPromises = [];

    // 1월부터 12월까지 각 월에 대한 검색 작업을 생성합니다.
    for (let month = 1; month <= 12; month++) {
      searchPromises.push(
        cloudinary.search
          .expression(`folder:dain-world/${month}`)
          .sort_by("created_at", "desc")
          .max_results(3) // 메인 갤러리에서는 월별로 최신 5장만 표시
          .execute()
          .then((result) => ({ month, resources: result.resources })) // 결과에 월 정보 추가
      );
    }

    // 모든 검색 작업을 동시에 실행합니다.
    const monthlyResults = await Promise.all(searchPromises);

    let allPhotos = [];

    // 각 월별 검색 결과를 순회하며 allPhotos 배열에 추가합니다.
    monthlyResults.forEach(({ month, resources }) => {
      const photosFromMonth = resources.map((resource) => ({
        id: resource.public_id,
        month: month, // 동적으로 할당된 월 정보 사용
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
        alt: `${month}월 다인이 사진`,
        name: resource.filename || resource.public_id.split("/").pop(),
        createdAt: resource.created_at,
        filePath: resource.public_id,
      }));
      allPhotos = allPhotos.concat(photosFromMonth);
    });

    // 모든 사진을 최신순으로 정렬합니다.
    allPhotos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`✅ 전체 검색 완료: ${allPhotos.length}장`);

    res.status(200).json({
      photos: allPhotos,
      totalPhotos: allPhotos.length,
    });
  } catch (error) {
    console.error("❌ all.js 오류:", error);
    res.status(500).json({
      error: "전체 사진 불러오기 실패",
      details: error.message,
    });
  }
}
