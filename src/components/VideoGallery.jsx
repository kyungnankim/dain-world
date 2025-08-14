// src/components/VideoGallery.jsx - YouTube Player API 사용 버전
import React, { useEffect, useRef } from "react";

const VideoGallery = ({ onBack }) => {
  const playersRef = useRef({});

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
    // 새로 추가된 영상들
    {
      id: 6,
      title: "다인이 일상 모먼트 1",
      videoId: "sVRBXrrKmW8",
      date: "2025-02-10",
      description: "다인이의 귀여운 일상 순간들을 담은 영상입니다.",
    },
    {
      id: 7,
      title: "다인이 성장기록 📹",
      videoId: "yG7ODccX2iU",
      date: "2025-02-12",
      description: "쑥쑥 자라는 다인이의 모습을 기록한 특별한 영상이에요.",
    },
    {
      id: 8,
      title: "다인이 놀이시간 🎪",
      videoId: "taVLdYXRPcM",
      date: "2025-02-14",
      description: "신나게 놀고 있는 다인이의 즐거운 시간입니다.",
    },
    {
      id: 9,
      title: "다인이 쇼츠 #1",
      videoId: "NrWT7E08hEA",
      date: "2025-02-15",
      description: "짧지만 강렬한 다인이의 매력이 담긴 쇼츠 영상!",
    },
    {
      id: 10,
      title: "다인이 쇼츠 #2 ✨",
      videoId: "Kf1QSq0RDA8",
      date: "2025-02-16",
      description: "반짝반짝 빛나는 다인이의 순간을 포착했어요.",
    },
    {
      id: 11,
      title: "다인이 웃음 모음집",
      videoId: "rGrJP_8sAEA",
      date: "2025-02-17",
      description: "듣기만 해도 기분 좋아지는 다인이의 웃음소리 모음!",
    },
    {
      id: 12,
      title: "다인이 표정 변화 😊",
      videoId: "_Obo1hu4FL8",
      date: "2025-02-18",
      description: "다양한 표정을 짓는 다인이의 감정 표현 모음집입니다.",
    },
    {
      id: 13,
      title: "다인이 움직임 포착 📸",
      videoId: "QgcGt_cPyCY",
      date: "2025-02-19",
      description: "생생하게 담아낸 다인이의 자연스러운 움직임들!",
    },
    {
      id: 14,
      title: "다인이 잠자는 모습 😴",
      videoId: "rFTmrmKn904",
      date: "2025-02-20",
      description: "평화롭게 잠들어 있는 다인이의 천사같은 모습이에요.",
    },
    {
      id: 15,
      title: "다인이 밥먹는 시간 🍼",
      videoId: "b3yXlCxOjm0",
      date: "2025-02-21",
      description: "맛있게 밥을 먹고 있는 다인이의 귀여운 먹방!",
    },
    {
      id: 16,
      title: "다인이 신기한 표정 😲",
      videoId: "AXoC6EYRz1A",
      date: "2025-02-22",
      description: "세상 모든 것이 신기한 다인이의 놀란 표정 모음입니다.",
    },
    {
      id: 17,
      title: "다인이 행복한 순간 💝",
      videoId: "gfsf0_RwCoM",
      date: "2025-02-23",
      description: "보는 사람까지 행복해지는 다인이의 미소가 가득한 영상!",
    },
    {
      id: 18,
      title: "다인이 특별한 하루 🌟",
      videoId: "WupC2KQMAig",
      date: "2025-02-24",
      description: "평범하지만 특별한 다인이의 일상을 담은 마지막 영상입니다.",
    },
  ];

  useEffect(() => {
    // YouTube Player API 스크립트 로드
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayers();
        return;
      }

      if (document.getElementById("youtube-api")) {
        return;
      }

      const script = document.createElement("script");
      script.id = "youtube-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);

      window.onYouTubeIframeAPIReady = initializePlayers;
    };

    const initializePlayers = () => {
      youtubeVideos.forEach((video) => {
        if (playersRef.current[video.id]) return;

        playersRef.current[video.id] = new window.YT.Player(
          `player-${video.id}`,
          {
            videoId: video.videoId,
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              showinfo: 0,
              modestbranding: 1,
              fs: 1,
              cc_load_policy: 0,
              iv_load_policy: 3,
              autohide: 0,
              vq: "hd1080", // 화질 설정
            },
            events: {
              onReady: (event) => {
                // 플레이어가 준비되면 화질을 1080p로 설정
                const availableQualities =
                  event.target.getAvailableQualityLevels();
                if (availableQualities.includes("hd1080")) {
                  event.target.setPlaybackQuality("hd1080");
                } else if (availableQualities.includes("hd720")) {
                  event.target.setPlaybackQuality("hd720");
                }
              },
              onStateChange: (event) => {
                // 재생 시작 시 화질 재설정
                if (event.data === window.YT.PlayerState.PLAYING) {
                  const availableQualities =
                    event.target.getAvailableQualityLevels();
                  if (availableQualities.includes("hd1080")) {
                    event.target.setPlaybackQuality("hd1080");
                  }
                }
              },
            },
          }
        );
      });
    };

    loadYouTubeAPI();

    // 컴포넌트 언마운트 시 플레이어 정리
    return () => {
      Object.values(playersRef.current).forEach((player) => {
        if (player && player.destroy) {
          player.destroy();
        }
      });
      playersRef.current = {};
    };
  }, []);

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
              <div
                id={`player-${video.id}`}
                style={{ width: "100%", height: "100%" }}
              ></div>
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
