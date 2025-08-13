// api/debugImageKit.js - 환경 변수 확인용 임시 파일
const crypto = require("crypto");

module.exports = function handler(req, res) {
  // CORS 헤더
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // 환경 변수들 확인 (실제 값은 숨김)
    const envCheck = {
      hasPublicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
      hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
      hasUrlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT,

      // 실제 값의 앞부분만 표시 (보안용)
      publicKeyPreview: process.env.IMAGEKIT_PUBLIC_KEY
        ? process.env.IMAGEKIT_PUBLIC_KEY.substring(0, 15) + "..."
        : "NOT_SET",
      privateKeyPreview: process.env.IMAGEKIT_PRIVATE_KEY
        ? process.env.IMAGEKIT_PRIVATE_KEY.substring(0, 15) + "..."
        : "NOT_SET",
      urlEndpointPreview: process.env.IMAGEKIT_URL_ENDPOINT || "NOT_SET",

      // 실제 값들 (개발용 - 나중에 삭제 필요!)
      actualPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      actualPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      actualUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    };

    // 토큰 생성 테스트
    let tokenTest = null;
    try {
      const token = Math.random().toString(36).substring(2);
      const expire = Math.floor(Date.now() / 1000) + 60 * 30;
      const signature = crypto
        .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY)
        .update(token + expire)
        .digest("hex");

      tokenTest = {
        success: true,
        token: token.substring(0, 10) + "...",
        expire,
        signature: signature.substring(0, 10) + "...",
      };
    } catch (error) {
      tokenTest = {
        success: false,
        error: error.message,
      };
    }

    res.status(200).json({
      message: "ImageKit 환경 변수 확인",
      envCheck,
      tokenTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "환경 변수 확인 실패",
      details: error.message,
    });
  }
};
