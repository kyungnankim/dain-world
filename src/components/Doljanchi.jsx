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

  // 정확한 호텔 정보 - 강서구 방화대로 94
  const hotelInfo = {
    name: "메이필드 호텔 낙원",
    address: "서울특별시 강서구 방화대로 94",
    fullAddress: "서울특별시 강서구 방화대로 94, 메이필드 호텔 낙원",
    detailAddress: "서울 강서구 방화대로 94",
    lat: 37.5587, // 강서구 방화대로 실제 위도
    lng: 126.8515, // 강서구 방화대로 실제 경도 (중구보다 서쪽)
  };

  // 캘린더 생성 함수
  const generateCalendar = () => {
    const partyDate = new Date(2025, 8, 13); // 2025년 9월 13일 (month는 0부터 시작)
    const year = partyDate.getFullYear();
    const month = partyDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay(); // 0=일요일

    const days = [];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    // 이전 달의 마지막 날들
    const prevMonth = new Date(year, month, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      days.push({ day: day, isEmpty: false, isOtherMonth: true });
    }

    // 현재 달 날짜들
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({
        day: day,
        isEmpty: false,
        isOtherMonth: false,
        isEventDay: day === 13, // 13일이 이벤트 날 (원형 하이라이트)
      });
    }

    // 다음 달 시작 날들로 채우기
    const totalCells = 42; // 6주 * 7일
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({ day: day, isEmpty: false, isOtherMonth: true });
    }

    return { days, dayNames, monthName: "9월" };
  };

  const { days, dayNames, monthName } = generateCalendar();

  // 카카오맵으로 길찾기 - 정확한 주소 사용
  const openKakaoMap = () => {
    const query = `${hotelInfo.name} ${hotelInfo.detailAddress}`;
    window.open(
      `https://map.kakao.com/link/to/${encodeURIComponent(query)},${
        hotelInfo.lat
      },${hotelInfo.lng}`,
      "_blank"
    );
  };

  // 네이버맵으로 길찾기
  const openNaverMap = () => {
    const query = encodeURIComponent(
      `${hotelInfo.name} ${hotelInfo.detailAddress}`
    );
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  // 구글맵으로 길찾기
  const openGoogleMap = () => {
    const query = encodeURIComponent(`${hotelInfo.fullAddress}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  // 카카오네비 (모바일 앱 우선) - 정확한 좌표 사용
  const openKakaoNavi = () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
      // 카카오네비 앱으로 바로 네비게이션
      const naviUrl = `kakaonavi://navigate?ep=${hotelInfo.lat},${hotelInfo.lng}&by=CAR`;
      window.location.href = naviUrl;

      // 앱이 없는 경우 대체 링크
      setTimeout(() => {
        openKakaoMap();
      }, 2500);
    } else {
      openKakaoMap();
    }
  };

  // 구글맵 네비로 목적지 설정
  const openGoogleNavi = () => {
    const query = encodeURIComponent(`${hotelInfo.fullAddress}`);
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (isMobile) {
      // 모바일에서는 구글맵 앱 연결
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${hotelInfo.lat},${
          hotelInfo.lng
        }&destination_place_id=${encodeURIComponent(hotelInfo.name)}`,
        "_blank"
      );
    } else {
      // 데스크톱에서는 웹 버전
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${query}`,
        "_blank"
      );
    }
  };

  // 네이버네비 (모바일 앱 우선)
  const openNaverNavi = () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
      const naviUrl = `nmap://navigation?dlat=${hotelInfo.lat}&dlng=${
        hotelInfo.lng
      }&dname=${encodeURIComponent(hotelInfo.name)}&appname=com.dainworld.app`;
      window.location.href = naviUrl;

      setTimeout(() => {
        openNaverMap();
      }, 2500);
    } else {
      openNaverMap();
    }
  };

  // 티맵
  const openTmap = () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (isMobile) {
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (isAndroid) {
        try {
          // 안드로이드 티맵 앱 연결
          const tmapUrl = `tmap://route?goalx=${hotelInfo.lng}&goaly=${
            hotelInfo.lat
          }&goalname=${encodeURIComponent(hotelInfo.name)}`;
          window.location.href = tmapUrl;

          setTimeout(() => {
            openGoogleNavi();
          }, 3000);
        } catch (error) {
          openGoogleNavi();
        }
      } else {
        // iOS에서는 애플 지도 또는 구글맵으로 연결
        try {
          window.location.href = `maps://maps.google.com/maps?q=${hotelInfo.lat},${hotelInfo.lng}`;
          setTimeout(() => {
            openGoogleNavi();
          }, 2000);
        } catch (error) {
          openGoogleNavi();
        }
      }
    } else {
      openGoogleNavi();
    }
  };

  return (
    <div className="doljanchi-card">
      <div className="doljanchi-header">
        <h2 className="doljanchi-title">최다인 첫생일</h2>

        {/* 다인이 사진 */}
        <div className="doljanchi-photo-container">
          <img
            src="https://ik.imagekit.io/duixwrddg/dain-world/dainAngel.png?tr=w-200,h-200,c-at_max,q-80,f-webp"
            alt="다인이"
            className="doljanchi-photo"
            onError={(e) => {
              e.target.src = "/img/dainAngel.png";
            }}
          />
        </div>
      </div>
      {/* 이벤트 안내            padding: "15px",

          borderRadius: "10px",
          border: "2px solid #ffc107",backgroundColor: "rgba(255, 193, 7, 0.1)",*/}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            color: "#666",
            fontSize: "1.5em",
          }}
        >
          아빠 최영민, 엄마 김민경
        </div>
        <div
          style={{
            color: "#666",
            fontSize: "1.5em",
          }}
        >
          2025년 9월 13일 (토) 오후 5시
          <br />
          장소: 서울 강서구 메이필드 호텔 낙원
        </div>
      </div>

      {/* 캘린더 - 13일 이벤트 강조 */}
      <div className="clean-calendar-container">
        <div className="clean-calendar-month">{monthName}</div>
        <div className="clean-calendar-grid">
          {/* 요일 헤더 */}
          {dayNames.map((dayName, index) => (
            <div key={`header-${index}`} className="clean-calendar-day-header">
              {dayName}
            </div>
          ))}

          {/* 날짜 칸들 */}
          {days.map((dayInfo, index) => (
            <div
              key={`day-${index}`}
              className={`clean-calendar-day ${
                dayInfo.isOtherMonth ? "other-month" : ""
              } ${dayInfo.isEventDay ? "event-day" : ""}`}
              style={
                dayInfo.isEventDay
                  ? {
                      backgroundColor: "#ffc107",
                      color: "#333",
                      fontWeight: "700",
                      borderRadius: "50%",
                      position: "relative",
                      boxShadow: "0 0 0 3px rgba(255, 193, 7, 0.3)",
                      transform: "scale(1.1)",
                      zIndex: 2,
                    }
                  : {}
              }
            >
              {dayInfo.day}
              {dayInfo.isEventDay && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "#ff8f00",
                    whiteSpace: "nowrap",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 감성적인 메시지 */}
      <div className="doljanchi-message-card">
        <p>
          하나의 작은 점으로 시작하여 열 달을 품고 작고 여린 품에 보듬기도
          조심스러웠던 이 작은 아이로부터 엄마, 아빠로서의 삶을 배웠습니다.
          <br />
          바쁘시더라도 사랑하는 우리 아이가 건강하게 자라도록 참석하여
          축복해주시면 큰 기쁨이 되겠습니다.
        </p>
      </div>

      {/* 지도 및 위치 정보 */}
      <div className="doljanchi-location-card">
        <div className="location-address-card">
          <h3 className="location-title">오시는 길</h3>
          <p className="location-address">{hotelInfo.detailAddress}</p>
          <p className="location-address">{hotelInfo.name}</p>
        </div>

        {/* 구글맵으로 정확한 위치 표시 */}
        <div className="doljanchi-map-container">
          <iframe
            src={`https://maps.google.com/maps?q=${hotelInfo.lat},${hotelInfo.lng}&hl=ko&z=16&output=embed`}
            className="doljanchi-map"
            allowFullScreen=""
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
            }}
            title="메이필드 호텔 낙원 위치"
          ></iframe>
        </div>

        {/* 네비게이션 앱 버튼들 */}
        <div className="navi-section">
          <h4 className="navi-title">네비로 길찾기</h4>
          <div className="navi-buttons-container">
            {/* 카카오맵 로고 버튼 */}
            <div
              className="navi-btn kakao-btn"
              onClick={openKakaoNavi}
              title="카카오맵"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="#3c1e1e"
                  d="M12 3C7.03 3 3 6.58 3 10.95c0 4.38 4.18 7.46 6.89 9.64l2.11 1.7l2.11-1.7C16.82 18.41 21 15.33 21 10.95C21 6.58 16.97 3 12 3zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"
                />
              </svg>
            </div>

            {/* 네이버맵 로고 버튼 */}
            <div
              className="navi-btn naver-btn"
              onClick={openNaverNavi}
              title="네이버맵"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"
                />
              </svg>
            </div>

            {/* 구글맵 로고 버튼 */}
            <div
              className="navi-btn google-btn"
              onClick={openGoogleNavi}
              title="구글맵"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 특별 메시지 */}
      <div className="doljanchi-thanks-card">
        <h3 className="thanks-title">감사의 말씀</h3>
        <p className="thanks-message">
          다인이의 소중한 첫 생일을
          <br />
          함께 축하해주시는 모든 분들께
          <br />
          진심으로 감사드립니다.
        </p>
      </div>

      {/* 연락처 */}
      <div className="doljanchi-contact">
        <p>
          <span className="contact-item">
            최영민 연락처: <a href="tel:010-9937-2374">010-9937-2374</a>
          </span>
          <br />
          <span className="contact-item">
            김민경 연락처: <a href="tel:010-5751-7457">010-5751-7457</a>
          </span>
          <br />
          궁금한 사항이 있으시면 언제든 연락주세요
        </p>
      </div>
    </div>
  );
};

export default Doljanchi;
