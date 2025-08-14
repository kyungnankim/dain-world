// api/delete.js - CommonJS 형식으로 복원
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
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST 메서드만 허용됩니다.",
    });
  }

  try {
    const { photoIds } = req.body;

    // ✅ 입력 검증
    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "삭제할 사진 ID 배열이 필요합니다.",
      });
    }

    // ✅ 최대 삭제 개수 제한 (안전장치)
    if (photoIds.length > 50) {
      return res.status(400).json({
        success: false,
        error: "한 번에 최대 50장까지만 삭제할 수 있습니다.",
      });
    }

    console.log(`🗑️ ${photoIds.length}장의 사진 삭제 시작:`, photoIds);

    const deletedIds = [];
    const failedIds = [];

    // ✅ 각 사진을 순차적으로 삭제 (너무 많은 동시 요청 방지)
    for (const photoId of photoIds) {
      try {
        console.log(`🗑️ 삭제 중: ${photoId}`);

        const result = await cloudinary.uploader.destroy(photoId, {
          resource_type: "image",
        });

        if (result.result === "ok") {
          deletedIds.push(photoId);
          console.log(`✅ 삭제 성공: ${photoId}`);
        } else if (result.result === "not found") {
          console.log(`⚠️ 이미 삭제됨: ${photoId}`);
          deletedIds.push(photoId); // 이미 없으므로 성공으로 처리
        } else {
          console.log(`❌ 삭제 실패: ${photoId} - ${result.result}`);
          failedIds.push({ id: photoId, reason: result.result });
        }
      } catch (deleteError) {
        console.error(`❌ ${photoId} 삭제 중 오류:`, deleteError.message);
        failedIds.push({ id: photoId, reason: deleteError.message });
      }

      // 과도한 API 호출 방지를 위한 짧은 지연
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // ✅ 결과 정리
    const totalRequested = photoIds.length;
    const totalDeleted = deletedIds.length;
    const totalFailed = failedIds.length;

    console.log(`🎉 삭제 작업 완료: ${totalDeleted}/${totalRequested} 성공`);

    // ✅ 성공 응답
    const responseData = {
      success: true,
      message: `${totalDeleted}장의 사진이 삭제되었습니다.`,
      deletedIds,
      deletedCount: totalDeleted,
      totalRequested,
      // 실패한 항목이 있으면 포함
      ...(totalFailed > 0 && {
        failedIds,
        failedCount: totalFailed,
        partialSuccess: true,
      }),
    };

    // 부분 성공인 경우 206 상태 코드 사용
    const statusCode = totalFailed > 0 ? 206 : 200;
    res.status(statusCode).json(responseData);
  } catch (error) {
    console.error("❌ 사진 삭제 API 오류:", error);

    res.status(500).json({
      success: false,
      error: "사진 삭제 중 서버에서 오류가 발생했습니다.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
