// api/upload.js - 더 안전한 버전
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

export default async function handler(req, res) {
  console.log("🚀 upload.js 호출됨!");
  console.log("📝 Method:", req.method);

  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    console.log("✅ OPTIONS 요청 처리");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    console.log("❌ POST가 아닌 요청:", req.method);
    return res.status(405).json({
      success: false,
      error: "POST 메서드만 허용됩니다.",
    });
  }

  try {
    console.log("🔧 Cloudinary 설정 중...");

    // Cloudinary 설정
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("📦 formidable로 파일 파싱 시작...");

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
      multiples: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("❌ formidable 파싱 에러:", err);
          reject(err);
        } else {
          console.log("✅ formidable 파싱 성공");
          console.log("📄 fields:", fields);
          console.log("📁 files:", Object.keys(files));
          resolve({ fields, files });
        }
      });
    });

    const month = fields.month?.[0] || fields.month;
    if (!month) {
      return res.status(400).json({
        success: false,
        error: "month 파라미터가 필요합니다.",
      });
    }

    console.log(`📅 업로드 월: ${month}`);

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    console.log(`📸 업로드할 파일 수: ${fileArray.length}`);

    const uploadResults = [];

    for (const file of fileArray) {
      if (!file) {
        console.log("⚠️ 빈 파일 건너뜀");
        continue;
      }

      console.log(`📤 업로드 중: ${file.originalFilename || "unnamed"}`);
      console.log(`📍 파일 경로: ${file.filepath}`);

      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: `dain-world/${month}`,
        public_id: `${Date.now()}_${
          file.originalFilename?.replace(/\.[^/.]+$/, "") || "photo"
        }`,
        overwrite: false,
        resource_type: "auto",
      });

      uploadResults.push({
        id: result.public_id,
        url: result.secure_url,
        month: parseInt(month),
        name: file.originalFilename || "photo",
      });

      console.log(`✅ 업로드 성공: ${result.public_id}`);
    }

    console.log(`🎉 업로드 완료: ${uploadResults.length}장`);

    res.status(200).json({
      success: true,
      message: `${uploadResults.length}장의 사진이 업로드되었습니다.`,
      photos: uploadResults,
    });
  } catch (error) {
    console.error("❌ upload.js 오류:", error);
    console.error("❌ 오류 스택:", error.stack);

    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

// Vercel 설정
export const config = {
  api: {
    bodyParser: false,
  },
};
