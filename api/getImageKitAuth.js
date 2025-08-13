// api/getImageKitAuth.js
import crypto from "crypto";

export default function handler(req, res) {
  const token = Math.random().toString(36).substring(2);
  const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30분
  const signature = crypto
    .createHmac("sha1", process.env.IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest("hex");

  res.status(200).json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}
