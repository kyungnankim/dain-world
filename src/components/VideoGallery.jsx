import React, { useEffect, useRef, useState, useCallback } from "react";
import video48 from "../assets/IMG_2025081321224470.MOV";
import video49 from "../assets/IMG_2025081321224483.MOV";

// *** 모바일 환경에 맞게 최적화하고, 실패 처리를 추가한 썸네일 생성 함수 ***
const createThumbnail = (videoSrc) => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement("video");

    videoElement.playsInline = true;
    videoElement.muted = true;
    videoElement.preload = "auto"; // 'metadata'보다 더 확실하게 preload
    videoElement.crossOrigin = "anonymous";
    videoElement.src = videoSrc;

    let seeked = false;

    const cleanUp = () => {
      videoElement.remove();
    };

    videoElement.onloadedmetadata = () => {
      try {
        if (videoElement.duration < 0.2) {
          videoElement.currentTime = 0;
        } else {
          videoElement.currentTime = 0.1;
        }
      } catch (e) {
        reject("Failed to set currentTime");
        cleanUp();
      }
    };

    videoElement.onseeked = () => {
      if (seeked) return;
      seeked = true;
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 360;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/jpeg");
      resolve(dataURL);
      cleanUp();
    };

    videoElement.onerror = (err) => {
      reject("Video load error");
      cleanUp();
    };

    // Safari 등 일부 브라우저에서 onseeked가 안 올 경우 타임아웃 설정 (최대 5초)
    setTimeout(() => {
      if (!seeked) {
        reject("Thumbnail generation timeout");
        cleanUp();
      }
    }, 5000);

    videoElement.load(); // 일부 브라우저에서 필요
  });
};

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
    <div style={{ width: "100%", height: "100%" }}>
      <div id={playerId} />
    </div>
  );
};

const VideoGallery = ({ onBack }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [localThumbnails, setLocalThumbnails] = useState({});
  const observer = useRef(null);

  const allVideos = [
    {
      id: 1,
      type: "youtube",
      title: "[광고]엘라스틴 광고패러디",
      videoId: "9wkbeXGS5v4",
      date: "2024-10-15",
      description:
        "다인이의 첫 광고 패러디 영상입니다. 찰랑거리는 머릿결을 감상하세요.",
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
      description: "까르르 웃는 모습이 매력적인 다인이의 행복한 순간입니다.",
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
      title: "다인이 행복한 순간 💝",
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
      type: "local",
      title: "다인이 영상 48",
      localSrc: video48,
      date: "2025-08-13",
      description: "다인이의 순간을 담은 로컬 영상입니다.",
    },
    {
      id: 49,
      type: "local",
      title: "다인이 영상 49",
      localSrc: video49,
      date: "2025-08-13",
      description: "다인이의 순간을 담은 로컬 영상입니다.",
    },
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    if (!document.getElementById("youtube-api")) {
      const script = document.createElement("script");
      script.id = "youtube-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = () => console.log("YouTube API loaded");
    }

    const handleIntersect = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { videoId, videoSrc } = entry.target.dataset;
          obs.unobserve(entry.target);
          if (videoSrc) {
            createThumbnail(videoSrc)
              .then((thumb) => {
                setLocalThumbnails((prev) => ({
                  ...prev,
                  [parseInt(videoId, 10)]: thumb,
                }));
              })
              .catch((err) => {
                console.error("Thumbnail creation failed for:", videoId, err);
                // *** 실패 시 'failed' 상태를 저장하여 더 이상 시도하지 않음 ***
                setLocalThumbnails((prev) => ({
                  ...prev,
                  [parseInt(videoId, 10)]: "failed",
                }));
              });
          }
        }
      });
    };

    const currentObserver = new IntersectionObserver(handleIntersect, {
      rootMargin: "200px",
    });
    observer.current = currentObserver;

    return () => currentObserver.disconnect();
  }, []);

  const localVideoCardRef = useCallback((node) => {
    if (node && observer.current) {
      observer.current.observe(node);
    }
  }, []);

  const handlePlay = (id) => {
    setPlayingVideoId(playingVideoId === id ? null : id);
  };

  return (
    <div
      className="video-gallery-container"
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div
        className="video-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
        }}
      >
        <button
          className="fortune-btn"
          onClick={onBack}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ← 돌아가기
        </button>
        <h1
          className="video-title"
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          🎬 다인이 동영상 갤러리
        </h1>
        <div style={{ width: "86px" }} />
      </div>

      <div
        className="video-content"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {allVideos.map((video) => {
          const thumbState = localThumbnails[video.id];
          const isThumbLoading = video.type === "local" && !thumbState;

          return (
            <div
              key={video.id}
              ref={video.type === "local" ? localVideoCardRef : null}
              data-video-id={video.id}
              data-video-src={video.localSrc || ""}
              className="video-card"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: "1px solid #e1e5e9",
              }}
            >
              <div
                className="video-info-header"
                style={{ marginBottom: "15px" }}
              >
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {video.title}
                </h3>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  {video.date}
                </p>
              </div>

              <div
                className="responsive-video-wrapper"
                style={{
                  marginBottom: "15px",
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                  backgroundColor: "#000",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {playingVideoId === video.id ? (
                    video.type === "youtube" ? (
                      <YouTubePlayer
                        videoId={video.videoId}
                        onReady={(e) => e.target.playVideo()}
                        onError={() => setPlayingVideoId(null)}
                      />
                    ) : (
                      <video
                        controls
                        autoPlay
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        preload="auto"
                        playsInline
                      >
                        <source src={video.localSrc} type="video/mp4" />
                        <source src={video.localSrc} type="video/mov" />
                        비디오를 재생할 수 없습니다.
                      </video>
                    )
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        backgroundImage:
                          video.type === "youtube"
                            ? `url(https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg)`
                            : thumbState && thumbState !== "failed"
                            ? `url(${thumbState})`
                            : "",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "14px",
                      }}
                      onClick={() => handlePlay(video.id)}
                    >
                      {isThumbLoading && "썸네일 생성 중..."}
                      <div
                        style={{
                          fontSize: "48px",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          borderRadius: "50%",
                          padding: "20px",
                          color: "white",
                          transition: "transform 0.2s",
                          // 로딩 중일 때는 재생 버튼 숨김
                          display: isThumbLoading ? "none" : "flex",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        ▶️
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="video-info-footer">
                <p
                  style={{
                    margin: 0,
                    color: "#555",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {video.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoGallery;
