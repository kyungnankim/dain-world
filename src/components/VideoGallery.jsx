// src/components/VideoGallery.jsx - 개선된 버전
import React from "react";

const VideoGallery = ({ onBack }) => {
  const youtubeVideos = [
    {
      id: 1,
      title: "[광고]엘라스틴 광고패러디",
      videoId: "9wkbeXGS5v4",
      date: "2024-10-15",
      description:
        "다인이의 첫 광고 패러디 영상입니다. 찰랑거리는 머릿결을 감상하세요.",
    },
    {
      id: 2,
      title: "[다큐]여권사진편",
      videoId: "QUZy_3dCGdk",
      date: "2024-11-20",
      description:
        "생애 첫 여권 사진을 찍으러 간 날의 기록. 과연 다인이는 웃지 않고 찍을 수 있었을까요?",
    },
    {
      id: 3,
      title: "다인이 뒤집기 🤸‍♀️",
      videoId: "5q6fhAFXjH0",
      date: "2024-12-01",
      description: "드디어 스스로 몸을 뒤집은 역사적인 순간!",
    },
    {
      id: 4,
      title: "[효과]세상을 보며 환하게 웃는 다인이",
      videoId: "1OVWaPMc-sY",
      date: "2025-01-10",
      description: "까르르 웃는 모습이 매력적인 다인이의 행복한 순간입니다.",
    },
    {
      id: 5,
      title: "[다큐]다인이 첫 설 날",
      videoId: "bBXaXeWPiFM",
      date: "2025-02-05",
      description: "예쁜 한복을 입고 처음으로 설날을 맞이했어요.",
    },
  ];

  return (
    <div className="video-gallery-container">
      <div className="video-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1 className="video-title">🎬 다인이 동영상 갤러리</h1>
        {/* 헤더 균형을 위한 빈 div */}
        <div style={{ width: "86px" }}></div>
      </div>

      <div className="video-content">
        {youtubeVideos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-info-header">
              <h3 className="video-card-title">{video.title}</h3>
              <p className="video-date">{video.date}</p>
            </div>

            <div className="responsive-video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            <div className="video-info-footer">
              <p className="video-description">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
