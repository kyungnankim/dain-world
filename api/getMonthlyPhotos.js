// api/getMonthlyPhotos.js
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default async function handler(req, res) {
  const { folder } = req.query;
  if (!folder) {
    return res.status(400).json({ error: "folder 파라미터가 필요합니다" });
  }

  try {
    const files = await imagekit.listFiles({
      path: `dain-world/${folder}`,
      limit: 100,
    });

    const photos = files.map((file) => ({
      url: file.url,
      thumbnailUrl: `${file.url}?tr=w-300,h-300,c-at_max,q-60,f-webp`,
      fullUrl: `${file.url}?tr=w-600,h-600,c-at_max,q-70,f-webp`,
      fortuneUrl: `${file.url}?tr=w-150,h-150,c-at_max,q-50,f-webp`,
      bgUrl: `${file.url}?tr=w-100,h-100,c-at_max,q-30,f-webp,bl-3`,
      alt: file.name,
    }));

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ error: "이미지 불러오기 실패" });
  }
}
