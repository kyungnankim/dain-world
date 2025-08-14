// api/test.js - 환경변수 테스트용
export default function handler(req, res) {
  console.log("🧪 test.js 호출됨!");

  // CORS 헤더
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 환경변수 체크
  const envCheck = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅" : "❌",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅" : "❌",
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL ? "✅" : "❌",
  };

  console.log("🔍 환경변수 체크:", envCheck);

  res.status(200).json({
    success: true,
    message: "API가 작동합니다!",
    timestamp: new Date().toISOString(),
    environment: envCheck,
    allEnvKeys: Object.keys(process.env).filter(
      (key) => key.includes("CLOUDINARY") || key.includes("IMAGEKIT")
    ),
  });
}
