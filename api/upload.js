// api/upload.js - CommonJS 형식으로 통일
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async function handler(req, res) {
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
    // 환경변수 확인
    console.log("🔍 환경변수 체크:");
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary 환경변수가 설정되지 않았습니다.");
    }

    console.log("📦 formidable로 파일 파싱 시작...");

    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
      multiples: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const month = fields.month?.[0] || fields.month;
    if (!month) {
      return res.status(400).json({
        success: false,
        error: "month 파라미터가 필요합니다.",
      });
    }

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    const uploadResults = [];

    for (const file of fileArray) {
      if (!file) continue;

      console.log(`📤 업로드 중: ${file.originalFilename}`);

      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: `dain-world/${month}`,
        public_id: `${Date.now()}_${file.originalFilename?.replace(
          /\.[^/.]+$/,
          ""
        )}`,
        overwrite: false,
        resource_type: "auto",
      });

      uploadResults.push({
        id: result.public_id,
        url: result.secure_url,
        month: parseInt(month),
        name: file.originalFilename,
      });

      console.log(`✅ 업로드 성공: ${result.public_id}`);
    }

    res.status(200).json({
      success: true,
      message: `${uploadResults.length}장의 사진이 업로드되었습니다.`,
      photos: uploadResults,
    });
  } catch (error) {
    console.error("❌ upload.js 오류:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
