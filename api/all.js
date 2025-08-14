// api/all.js - 더 안전한 버전
import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  console.log("🔍 all.js 호출됨!");

  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    console.log("🔧 Cloudinary 설정 중...");

    // Cloudinary 설정
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("🔍 전체 사진 검색 시작...");

    // 간단한 테스트: 1월만 먼저 검색해보기
    const result = await cloudinary.search
      .expression(`folder:dain-world/1`)
      .sort_by("created_at", "desc")
      .max_results(5)
      .execute();

    console.log(`📁 1월 검색 결과: ${result.resources.length}장`);

    const photos = result.resources.map((resource) => ({
      id: resource.public_id,
      month: 1,
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
      alt: "1월 다인이 사진",
      name: resource.filename || resource.public_id.split("/").pop(),
      createdAt: resource.created_at,
      filePath: resource.public_id,
    }));

    console.log(`✅ 검색 완료: ${photos.length}장`);

    res.status(200).json({
      photos,
      totalPhotos: photos.length,
      debug: {
        message: "간단한 테스트 버전",
        searchedMonth: 1,
        cloudinaryConfig: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌",
          api_key: process.env.CLOUDINARY_API_KEY ? "✅" : "❌",
          api_secret: process.env.CLOUDINARY_API_SECRET ? "✅" : "❌",
        },
      },
    });
  } catch (error) {
    console.error("❌ all.js 오류:", error);
    console.error("❌ 오류 스택:", error.stack);

    res.status(500).json({
      error: "전체 사진 불러오기 실패",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
