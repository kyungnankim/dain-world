// src/components/Doljanchi.jsx
import React, { useState, useEffect } from "react";

const Doljanchi = ({ partyDate }) => {
  const [dDay, setDDay] = useState("");

  useEffect(() => {
    const dolPartyDate = new Date(partyDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = dolPartyDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      setDDay(`D-${diffDays}`);
    } else if (diffDays === 0) {
      setDDay("D-DAY! 오늘이 돌잔치날!");
    } else {
      setDDay("첫돌 잔치가 무사히 끝났어요!");
    }
  }, [partyDate]);

  // 실제 호텔 정보
  const hotelInfo = {
    name: "메이필드 호텔 낙원",
    address: "서울특별시 강서구 외발산동 방화대로 94",
    // 방화대로 94 좌표 (대략적)
    lat: 37.5665,
    lng: 126.8015,
  };

  // 카카오맵으로 길찾기
  const openKakaoMap = () => {
    const query = encodeURIComponent(hotelInfo.address);
    window.open(`https://map.kakao.com/link/search/${query}`, "_blank");
  };

  // 네이버맵으로 길찾기
  const openNaverMap = () => {
    const query = encodeURIComponent(hotelInfo.address);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  // 구글맵으로 길찾기
  const openGoogleMap = () => {
    const query = encodeURIComponent(hotelInfo.address);
    window.open(`https://maps.google.com/maps?q=${query}`, "_blank");
  };

  // 카카오네비로 목적지 설정
  const openKakaoNavi = () => {
    const naviUrl = `kakaomap://route?ep=${hotelInfo.lng},${hotelInfo.lat}&by=CAR`;

    // 모바일에서는 앱으로, PC에서는 웹으로
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // 모바일: 카카오네비 앱 실행 시도
      window.location.href = naviUrl;

      // 앱이 없으면 3초 후 카카오맵 웹으로 이동
      setTimeout(() => {
        window.open(
          `https://map.kakao.com/link/to/${encodeURIComponent(
            hotelInfo.name
          )},${hotelInfo.lat},${hotelInfo.lng}`,
          "_blank"
        );
      }, 3000);
    } else {
      // PC: 카카오맵 웹에서 길찾기
      window.open(
        `https://map.kakao.com/link/to/${encodeURIComponent(hotelInfo.name)},${
          hotelInfo.lat
        },${hotelInfo.lng}`,
        "_blank"
      );
    }
  };

  // 네이버네비로 목적지 설정
  const openNaverNavi = () => {
    const naviUrl = `nmap://route/car?dlat=${hotelInfo.lat}&dlng=${
      hotelInfo.lng
    }&dname=${encodeURIComponent(hotelInfo.name)}`;

    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // 모바일: 네이버네비 앱 실행 시도
      window.location.href = naviUrl;

      // 앱이 없으면 3초 후 네이버맵 웹으로 이동
      setTimeout(() => {
        window.open(
          `https://map.naver.com/v5/directions/-/-/-/car?c=${hotelInfo.lng},${hotelInfo.lat},15,0,0,0,dh`,
          "_blank"
        );
      }, 3000);
    } else {
      // PC: 네이버맵 웹에서 길찾기
      window.open(
        `https://map.naver.com/v5/search/${encodeURIComponent(
          hotelInfo.address
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div
      className="card"
      style={{
        background: "linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#d63384", marginBottom: "10px" }}>
          💌 첫돌 잔치에 초대합니다
        </h2>
        <div style={{ fontSize: "24px", marginBottom: "15px" }}>🎂👶🎉</div>
      </div>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            lineHeight: "1.6",
            marginBottom: "15px",
          }}
        >
          다인이가 태어나 처음 맞는 생일을 축하하는 자리를 마련했습니다.
          <br />
          <strong>
            귀한 걸음 하시어 다인이의 첫 생일을 함께 축복해주세요.
          </strong>
        </p>

        <div style={{ textAlign: "center" }}>
          <div
            className="d-day"
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#d63384",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              marginBottom: "10px",
            }}
          >
            {dDay}
          </div>
        </div>
      </div>

      {/* 일정 정보 */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
          border: "2px solid #ffc0cb",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            color: "#d63384",
            marginBottom: "15px",
          }}
        >
          📅 일정 안내
        </h3>

        <div style={{ display: "grid", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>📆</span>
            <strong>날짜:</strong>
            <span style={{ color: "#d63384", fontWeight: "bold" }}>
              2025년 9월 13일 (토요일)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🕐</span>
            <strong>시간:</strong>
            <span style={{ color: "#d63384", fontWeight: "bold" }}>
              오후 2시
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🏨</span>
            <strong>장소:</strong>
            <span style={{ color: "#d63384", fontWeight: "bold" }}>
              메이필드 호텔 낙원
            </span>
          </div>
        </div>
      </div>

      {/* 지도 및 위치 정보 */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            color: "#d63384",
            marginBottom: "15px",
          }}
        >
          🗺️ 오시는 길
        </h3>

        {/* 실제 호텔 위치 지도 */}
        <div
          style={{
            width: "100%",
            height: "200px",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "15px",
            border: "2px solid #ffc0cb",
          }}
        >
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHHrMPTe&q=${encodeURIComponent(
              hotelInfo.address
            )}&zoom=16`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* 실제 호텔 위치 지도 */}
        <div
          style={{
            width: "100%",
            height: "200px",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "15px",
            border: "2px solid #ffc0cb",
          }}
        >
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              hotelInfo.address
            )}&output=embed&z=16`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* 지도 앱 버튼들 */}
        <div style={{ marginBottom: "15px" }}>
          <h4
            style={{
              textAlign: "center",
              color: "#d63384",
              marginBottom: "10px",
              fontSize: "16px",
            }}
          >
            🗺️ 지도에서 위치 확인
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
            }}
          >
            <button
              onClick={openKakaoMap}
              style={{
                padding: "10px 6px",
                backgroundColor: "#fee500",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              🗺️ 카카오맵
            </button>

            <button
              onClick={openNaverMap}
              style={{
                padding: "10px 6px",
                backgroundColor: "#03c75a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              🧭 네이버맵
            </button>

            <button
              onClick={openGoogleMap}
              style={{
                padding: "10px 6px",
                backgroundColor: "#4285f4",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              🌍 구글맵
            </button>
          </div>
        </div>

        {/* 네비게이션 앱 버튼들 */}
        <div style={{ marginBottom: "15px" }}>
          <h4
            style={{
              textAlign: "center",
              color: "#d63384",
              marginBottom: "10px",
              fontSize: "16px",
            }}
          >
            🚗 네비로 주소찍기
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <button
              onClick={openKakaoNavi}
              style={{
                padding: "12px 10px",
                backgroundColor: "#fee500",
                color: "#000",
                border: "2px solid #ffd700",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              🚗 카카오네비
              <br />
              <small style={{ fontSize: "10px", opacity: 0.8 }}>
                목적지 설정
              </small>
            </button>

            <button
              onClick={openNaverNavi}
              style={{
                padding: "12px 10px",
                backgroundColor: "#03c75a",
                color: "white",
                border: "2px solid #00b050",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              🧭 네이버네비
              <br />
              <small style={{ fontSize: "10px", opacity: 0.8 }}>
                목적지 설정
              </small>
            </button>
          </div>
        </div>

        {/* 주소 정보 */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#d63384",
            }}
          >
            🏨 {hotelInfo.name}
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "13px",
              color: "#666",
              lineHeight: "1.4",
            }}
          >
            📍 {hotelInfo.address}
          </p>
          <div
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "rgba(214, 51, 132, 0.1)",
              borderRadius: "6px",
              border: "1px dashed #d63384",
            }}
          >
            <p style={{ margin: "0", fontSize: "11px", color: "#d63384" }}>
              💡 <strong>네비게이션 팁:</strong>
              <br />
              위의 "네비로 주소찍기" 버튼을 누르면
              <br />
              자동으로 목적지가 설정됩니다!
            </p>
          </div>
        </div>
      </div>

      {/* 특별 메시지 */}
      <div
        style={{
          backgroundColor: "rgba(214, 51, 132, 0.1)",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          border: "2px dashed #d63384",
        }}
      >
        <h3 style={{ color: "#d63384", marginBottom: "10px" }}>
          💝 감사의 말씀
        </h3>
        <p
          style={{
            lineHeight: "1.6",
            fontSize: "14px",
            margin: "0",
            fontStyle: "italic",
          }}
        >
          다인이의 소중한 첫 생일을
          <br />
          함께 축하해주시는 모든 분들께
          <br />
          진심으로 감사드립니다. 💕
        </p>
      </div>

      {/* 연락처 (선택사항) */}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <p>
          궁금한 사항이 있으시면 언제든 연락주세요 📞
          <br />
          <span style={{ fontSize: "10px" }}>* 연락처는 별도 안내드립니다</span>
        </p>
      </div>
    </div>
  );
};

export default Doljanchi;
