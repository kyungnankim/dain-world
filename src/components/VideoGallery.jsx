// src/components/VideoGallery.jsx - 유튜브 동영상 전용
import React, { useState } from "react";

const VideoGallery = ({ onBack }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 유튜브 동영상 데이터 (실제 다인이 동영상 URL로 교체하세요)
  const youtubeVideos = [
    {
      id: 1,
      title: "다인이 첫 웃음 😊",
      youtubeId: "dQw4w9WgXcQ", // 실제 유튜브 영상 ID로 교체
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      date: "2024-10-15",
      description: "다인이가 처음으로 웃는 모습",
    },
    {
      id: 2,
      title: "다인이 옹알이 🗣️",
      youtubeId: "dQw4w9WgXcQ", // 실제 유튜브 영상 ID로 교체
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      date: "2024-11-20",
      description: "다인이의 귀여운 옹알이",
    },
    {
      id: 3,
      title: "다인이 뒤집기 🤸‍♀️",
      youtubeId: "dQw4w9WgXcQ", // 실제 유튜브 영상 ID로 교체
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      date: "2024-12-01",
      description: "다인이가 처음으로 뒤집는 순간",
    },
    {
      id: 4,
      title: "다인이 이유식 먹방 🍼",
      youtubeId: "dQw4w9WgXcQ", // 실제 유튜브 영상 ID로 교체
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      date: "2025-01-10",
      description: "다인이의 첫 이유식 도전",
    },
    {
      id: 5,
      title: "다인이와 함께하는 목욕시간 🛁",
      youtubeId: "dQw4w9WgXcQ", // 실제 유튜브 영상 ID로 교체
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      date: "2025-02-05",
      description: "다인이의 즐거운 목욕시간",
    },
    {
      id: 6,
      title: "다인이 첫 장난감 🧸",
      youtubeId: "dQw4w9WgXcQ", // 실제 유튜브 영상 ID로 교체
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      date: "2025-03-15",
      description: "다인이와 새로운 장난감 친구들",
    },
  ];

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="video-gallery-container">
      {/* 헤더 */}
      <div className="video-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1 className="video-title">🎬 다인이 동영상 갤러리</h1>
        <div></div> {/* 공간 맞추기용 */}
      </div>

      {/* 동영상 갤러리 */}
      <div className="video-content">
        <div className="video-description">
          <p
            style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}
          >
            다인이의 소중한 순간들을 동영상으로 만나보세요 💝
          </p>
        </div>

        <div className="video-grid">
          {youtubeVideos.map((video) => (
            <div key={video.id} className="video-item">
              <div
                className="video-thumbnail"
                onClick={() => openVideoModal(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="thumbnail-img"
                />
                <div className="play-button">▶️</div>
                <div className="video-duration-overlay">YouTube</div>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p className="video-date">{video.date}</p>
                <p className="video-description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 동영상이 없을 때 */}
        {youtubeVideos.length === 0 && (
          <div className="no-videos">
            <p>아직 업로드된 동영상이 없어요 🎬</p>
            <p>소중한 순간들을 영상으로 남겨주세요!</p>
          </div>
        )}

        {/* 동영상 업로드 안내 */}
        <div className="video-upload-guide">
          <h3>📹 동영상 추가 방법</h3>
          <div className="upload-steps">
            <div className="step">
              <span className="step-number">1</span>
              <p>유튜브에 다인이 동영상 업로드</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>영상 ID를 복사하여 코드에 추가</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>제목과 설명을 입력하여 완성!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 유튜브 동영상 모달 */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeVideoModal}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="video-close-btn" onClick={closeVideoModal}>
              ✕
            </button>

            {/* 유튜브 임베드 */}
            <div className="youtube-container">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="video-modal-info">
              <h3>{selectedVideo.title}</h3>
              <p className="modal-date">{selectedVideo.date}</p>
              <p className="modal-description">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
