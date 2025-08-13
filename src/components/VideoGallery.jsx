// src/components/VideoGallery.jsx
import React from "react";

const VideoGallery = ({ onBack }) => {
  // 유튜브 동영상 데이터 (iframe 직접 사용)
  const youtubeVideos = [
    {
      id: 1,
      title: "다인이 첫 웃음 😊",
      iframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/9wkbeXGS5v4?si=kit8PJO6F-6qOSZc" title="다인이 첫 웃음 😊" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
      date: "2024-10-15",
      description: "다인이가 처음으로 웃는 모습",
    },
    {
      id: 2,
      title: "다인이 옹알이 🗣️",
      iframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/QUZy_3dCGdk?si=KYkYEbccfX8lg9PY" title="다인이 옹알이 🗣️" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
      date: "2024-11-20",
      description: "다인이의 귀여운 옹알이",
    },
    {
      id: 3,
      title: "다인이 뒤집기 🤸‍♀️",
      iframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/5q6fhAFXjH0?si=EIq-gAA6kkQs0dRB" title="다인이 뒤집기 🤸‍♀️" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
      date: "2024-12-01",
      description: "다인이가 처음으로 뒤집는 순간",
    },
    {
      id: 4,
      title: "다인이 이유식 먹방 🍼",
      iframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/1OVWaPMc-sY?si=3YaVueUh99sQiHFZ" title="다인이 이유식 먹방 🍼" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
      date: "2025-01-10",
      description: "다인이의 첫 이유식 도전",
    },
    {
      id: 5,
      title: "다인이와 함께하는 목욕시간 🛁",
      iframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/bBXaXeWPiFM?si=pqiijBGi-ATcGrLM" title="다인이와 함께하는 목욕시간 🛁" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
      date: "2025-02-05",
      description: "다인이의 즐거운 목욕시간",
    },
  ];

  return (
    <div className="video-gallery-container">
      <div className="video-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1 className="video-title">🎬 다인이 동영상 갤러리</h1>
        <div></div>
      </div>

      <div className="video-content">
        {youtubeVideos.map((video) => (
          <div
            key={video.id}
            className="video-item"
            style={{ marginBottom: "40px" }}
          >
            <div dangerouslySetInnerHTML={{ __html: video.iframe }} />
            <div className="video-info">
              <h3>{video.title}</h3>
              <p className="video-date">{video.date}</p>
              <p className="video-description">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
