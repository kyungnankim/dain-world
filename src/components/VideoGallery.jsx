import React, { useEffect, useRef, useState } from "react";

// *** YouTube 플레이어 컴포넌트 ***
const YouTubePlayer = ({ videoId, onReady, onError }) => {
  const playerInstanceRef = useRef(null);
  const [playerId] = useState(
    `Youtubeer-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    if (!window.YT || !window.YT.Player) return;
    const cleanup = () => {
      if (
        playerInstanceRef.current &&
        typeof playerInstanceRef.current.destroy === "function"
      ) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
    cleanup();
    playerInstanceRef.current = new window.YT.Player(playerId, {
      videoId: videoId,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
      },
      events: { onReady, onError },
    });
    return cleanup;
  }, [videoId, playerId, onReady, onError]);

  return (
    <div className="youtube-player-container">
      <div id={playerId} />
    </div>
  );
};

// *** 비디오 갤러리 컴포넌트 ***
const VideoGallery = ({ onBack }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const allVideos = [
    {
      id: 1,
      type: "youtube",
      title: "[광고]엘라스틴 광고패러디",
      videoId: "9wkbeXGS5v4",
      date: "2024-10-15",
      description:
        "다인이의 첫 광고 패러디 영상입니다. 찰랑거리는 머리결을 감상하세요.",
    },
    {
      id: 2,
      type: "youtube",
      title: "[다큐]여권사진편",
      videoId: "QUZy_3dCGdk",
      date: "2024-11-20",
      description:
        "생애 첫 여권 사진을 찍으러 간 날의 기록. 과연 다인이는 웃지 않고 찍을 수 있었을까요?",
    },
    {
      id: 3,
      type: "youtube",
      title: "다인이 뒤집기 🤸‍♀️",
      videoId: "5q6fhAFXjH0",
      date: "2024-12-01",
      description: "드디어 스스로 몸을 뒤집은 역사적인 순간!",
    },
    {
      id: 4,
      type: "youtube",
      title: "[효과]세상을 보며 환하게 웃는 다인이",
      videoId: "1OVWaPMc-sY",
      date: "2025-01-10",
      description: "깔르르 웃는 모습이 매력적인 다인이의 행복한 순간입니다.",
    },
    {
      id: 5,
      type: "youtube",
      title: "[다큐]다인이 첫 설 날",
      videoId: "bBXaXeWPiFM",
      date: "2025-02-05",
      description: "예쁜 한복을 입고 처음으로 설날을 맞이했어요.",
    },
    {
      id: 6,
      type: "youtube",
      title: "다인이 일상 모먼트 1",
      videoId: "sVRBXrrKmW8",
      date: "2025-02-10",
      description: "다인이의 귀여운 일상 순간들을 담은 영상입니다.",
    },
    {
      id: 7,
      type: "youtube",
      title: "다인이 성장기록 📹",
      videoId: "yG7ODccX2iU",
      date: "2025-02-12",
      description: "쑥쑥 자라는 다인이의 모습을 기록한 특별한 영상이에요.",
    },
    {
      id: 8,
      type: "youtube",
      title: "다인이 놀이시간 🎪",
      videoId: "taVLdYXRPcM",
      date: "2025-02-14",
      description: "신나게 놀고 있는 다인이의 즐거운 시간입니다.",
    },
    {
      id: 9,
      type: "youtube",
      title: "다인이 쇼츠 #1",
      videoId: "NrWT7E08hEA",
      date: "2025-02-15",
      description: "짧지만 강렬한 다인이의 매력이 담긴 쇼츠 영상!",
    },
    {
      id: 10,
      type: "youtube",
      title: "다인이 쇼츠 #2 ✨",
      videoId: "Kf1QSq0RDA8",
      date: "2025-02-16",
      description: "반짝반짝 빛나는 다인이의 순간을 포착했어요.",
    },
    {
      id: 11,
      type: "youtube",
      title: "다인이 웃음 모음집",
      videoId: "rGrJP_8sAEA",
      date: "2025-02-17",
      description: "듣기만 해도 기분 좋아지는 다인이의 웃음소리 모음!",
    },
    {
      id: 12,
      type: "youtube",
      title: "다인이 표정 변화 😊",
      videoId: "_Obo1hu4FL8",
      date: "2025-02-18",
      description: "다양한 표정을 짓는 다인이의 감정 표현 모음집입니다.",
    },
    {
      id: 13,
      type: "youtube",
      title: "다인이 움직임 포착 📸",
      videoId: "QgcGt_cPyCY",
      date: "2025-02-19",
      description: "생생하게 담아낸 다인이의 자연스러운 움직임들!",
    },
    {
      id: 14,
      type: "youtube",
      title: "다인이 잠자는 모습 😴",
      videoId: "rFTmrmKn904",
      date: "2025-02-20",
      description: "평화롭게 잠들어 있는 다인이의 천사같은 모습이에요.",
    },
    {
      id: 15,
      type: "youtube",
      title: "다인이 밥먹는 시간 🍼",
      videoId: "b3yXlCxOjm0",
      date: "2025-02-21",
      description: "맛있게 밥을 먹고 있는 다인이의 귀여운 먹방!",
    },
    {
      id: 16,
      type: "youtube",
      title: "다인이 신기한 표정 😲",
      videoId: "AXoC6EYRz1A",
      date: "2025-02-22",
      description: "세상 모든 것이 신기한 다인이의 놀란 표정 모음입니다.",
    },
    {
      id: 17,
      type: "youtube",
      title: "다인이 행복한 순간 💕",
      videoId: "gfsf0_RwCoM",
      date: "2025-02-23",
      description: "보는 사람까지 행복해지는 다인이의 미소가 가득한 영상!",
    },
    {
      id: 18,
      type: "youtube",
      title: "다인이 특별한 하루 🌟",
      videoId: "WupC2KQMAig",
      date: "2025-02-24",
      description: "평범하지만 특별한 다인이의 일상을 담은 마지막 영상입니다.",
    },
    {
      id: 19,
      type: "youtube",
      title: "다인이 영상 1",
      videoId: "5vjJjOyG_cE",
      date: "2025-02-25",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 20,
      type: "youtube",
      title: "다인이 영상 2",
      videoId: "69hGWCiv6eE",
      date: "2025-02-26",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 21,
      type: "youtube",
      title: "다인이 영상 3",
      videoId: "2YDRYvnT1uo",
      date: "2025-02-27",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 22,
      type: "youtube",
      title: "다인이 영상 4",
      videoId: "4gkEYy6P8Sw",
      date: "2025-02-28",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 23,
      type: "youtube",
      title: "다인이 영상 5",
      videoId: "Vi2WNamHDLo",
      date: "2025-03-01",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 24,
      type: "youtube",
      title: "다인이 영상 6",
      videoId: "jiJ63k2I7qE",
      date: "2025-03-02",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 25,
      type: "youtube",
      title: "다인이 영상 7",
      videoId: "xFfe3hnQ7sU",
      date: "2025-03-03",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 26,
      type: "youtube",
      title: "다인이 영상 8",
      videoId: "S1Db9Q7bfes",
      date: "2025-03-04",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 27,
      type: "youtube",
      title: "다인이 영상 9",
      videoId: "AJw8PxJnkwQ",
      date: "2025-03-05",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 28,
      type: "youtube",
      title: "다인이 영상 10",
      videoId: "gXYzSLXHNe8",
      date: "2025-03-06",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 29,
      type: "youtube",
      title: "다인이 영상 11",
      videoId: "LfA6R_adhm8",
      date: "2025-03-07",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 30,
      type: "youtube",
      title: "다인이 영상 12",
      videoId: "-JBXcubg-AM",
      date: "2025-03-08",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 31,
      type: "youtube",
      title: "다인이 영상 13",
      videoId: "9f-9jCf9hQM",
      date: "2025-03-09",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 32,
      type: "youtube",
      title: "다인이 영상 14",
      videoId: "4G8w3f0SLCo",
      date: "2025-03-10",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 33,
      type: "youtube",
      title: "다인이 영상 15",
      videoId: "s0pfgv7O-u4",
      date: "2025-03-11",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 34,
      type: "youtube",
      title: "다인이 영상 16",
      videoId: "Wg2nmwgHwwI",
      date: "2025-03-12",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 35,
      type: "youtube",
      title: "다인이 영상 17",
      videoId: "QMqCkgR0aCo",
      date: "2025-03-13",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 36,
      type: "youtube",
      title: "다인이 영상 18",
      videoId: "oYiJnNeVzKw",
      date: "2025-03-14",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 37,
      type: "youtube",
      title: "다인이 영상 19",
      videoId: "leGpOikQsiI",
      date: "2025-03-15",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 38,
      type: "youtube",
      title: "다인이 영상 20",
      videoId: "R4dTFf_3dh8",
      date: "2025-03-16",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 39,
      type: "youtube",
      title: "다인이 영상 21",
      videoId: "D-60jq2Z-y4",
      date: "2025-03-17",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 40,
      type: "youtube",
      title: "다인이 영상 22",
      videoId: "6BQlz8CuQ4E",
      date: "2025-03-18",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 41,
      type: "youtube",
      title: "다인이 영상 23",
      videoId: "hMy1jRvgvxQ",
      date: "2025-03-19",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 42,
      type: "youtube",
      title: "다인이 영상 24",
      videoId: "8WX1dmiIsgQ",
      date: "2025-03-20",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 43,
      type: "youtube",
      title: "다인이 영상 25",
      videoId: "uPeBzN9ubGQ",
      date: "2025-03-21",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 44,
      type: "youtube",
      title: "다인이 영상 26",
      videoId: "euboqobaCt4",
      date: "2025-03-22",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 45,
      type: "youtube",
      title: "다인이 영상 27",
      videoId: "VPuPqipsRcM",
      date: "2025-03-23",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 46,
      type: "youtube",
      title: "다인이 영상 28",
      videoId: "5UrgJdefTF8",
      date: "2025-03-24",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 47,
      type: "youtube",
      title: "다인이 영상 29",
      videoId: "RbPG5lWypF4",
      date: "2025-03-25",
      description: "다인이의 새로운 순간을 담은 영상입니다.",
    },
    {
      id: 48,
      type: "vimeo",
      title: "다인이 영상 48 (Vimeo)",
      vimeoId: "1110952250", // Vimeo 비디오 ID
      date: "2025-08-13",
      description: "다인이의 순간을 담은 Vimeo 영상입니다.",
    },
    {
      id: 49,
      type: "vimeo",
      title: "다인이 영상 49 (Vimeo)",
      vimeoId: "1110952122", // Vimeo 비디오 ID
      date: "2025-08-13",
      description: "다인이의 순간을 담은 Vimeo 영상입니다.",
    },
  ];

  useEffect(() => {
    // YouTube API 스크립트가 없으면 로드
    if (!document.getElementById("youtube-api")) {
      const script = document.createElement("script");
      script.id = "youtube-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = () => console.log("YouTube API loaded");
    }
  }, []);

  const handlePlay = (id) => {
    setPlayingVideoId(playingVideoId === id ? null : id);
  };

  return (
    <div className="video-gallery-container">
      <div className="video-header">
        <button className="fortune-btn" onClick={onBack}>
          ← 돌아가기
        </button>
        <h1 className="video-title">🎬 다인이 동영상 갤러리</h1>
        <div className="video-header-spacer" />
      </div>

      <div className="video-content-grid">
        {allVideos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-info-header">
              <h3 className="video-card-title">{video.title}</h3>
              <p className="video-date">{video.date}</p>
            </div>

            <div className="responsive-video-wrapper">
              <div className="video-player-container">
                {playingVideoId === video.id ? (
                  video.type === "youtube" ? (
                    <YouTubePlayer
                      videoId={video.videoId}
                      onReady={(e) => e.target.playVideo()}
                      onError={() => setPlayingVideoId(null)}
                    />
                  ) : (
                    // Vimeo 플레이어
                    <iframe
                      src={`https://player.vimeo.com/video/${video.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`}
                      className="vimeo-iframe"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                      allowFullScreen
                      title={video.title}
                    ></iframe>
                  )
                ) : (
                  <div
                    className={`video-thumbnail ${
                      video.type === "youtube"
                        ? "youtube-thumbnail"
                        : "vimeo-thumbnail"
                    }`}
                    style={{
                      backgroundImage:
                        video.type === "youtube"
                          ? `url(https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg)`
                          : "",
                    }}
                    onClick={() => handlePlay(video.id)}
                  >
                    <div className="video-play-button">▶️</div>
                  </div>
                )}
              </div>
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
