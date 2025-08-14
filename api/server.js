// server.js

const express = require("express");
const cors = require("cors");

// 기존 API 핸들러 불러오기
const allHandler = require("./api/all.js");
const monthlyHandler = require("./api/monthly.js");
const deleteHandler = require("./api/delete.js");
const uploadHandler = require("./api/upload.js");

const app = express();
const PORT = 3001; // 우리만의 백엔드 포트

app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱

// Vercel의 req, res 객체와 비슷하게 만들어주는 미들웨어
const adaptVercelRequest = (handler) => (req, res) => {
  req.body = req.body || {};
  req.query = req.query || {};
  return handler(req, res);
};

// 라우팅 설정
app.get("/api/all", adaptVercelRequest(allHandler));
app.get("/api/monthly", adaptVercelRequest(monthlyHandler));
app.post("/api/delete", adaptVercelRequest(deleteHandler));
app.post("/api/upload", adaptVercelRequest(uploadHandler));

app.listen(PORT, () => {
  console.log(`✅ Express server is running on http://localhost:${PORT}`);
  console.log("This is your new backend!");
  console.log("Keep this terminal running.");
});
