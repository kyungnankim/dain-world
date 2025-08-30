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

  // 수정된 호텔 정보
  const hotelInfo = {
    name: "메이필드 호텔 낙원",
    address: "서울특별시 중구 낙원동 18-1",
    lat: 37.5704,
    lng: 126.9869,
  };

  // 카카오맵으로 길찾기
  const openKakaoMap = () => {
    window.open(
      `https://map.kakao.com/link/to/${encodeURIComponent(hotelInfo.name)},${
        hotelInfo.lat
      },${hotelInfo.lng}`,
      "_blank"
    );
  };

  // 네이버맵으로 길찾기
  const openNaverMap = () => {
    const query = encodeURIComponent(hotelInfo.name);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  // 구글맵으로 길찾기
  const openGoogleMap = () => {
    const query = encodeURIComponent(hotelInfo.address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  // 카카오네비 (모바일 앱 우선)
  const openKakaoNavi = () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
      // 카카오네비 앱 실행 시도
      window.location.href = `kakaonavi://navigate?ep=${hotelInfo.lat},${hotelInfo.lng}&by=CAR`;

      // 2.5초 후 앱이 실행되지 않았다면 카카오맵 웹으로 이동
      setTimeout(() => {
        openKakaoMap();
      }, 2500);
    } else {
      openKakaoMap(); // PC는 카카오맵 웹으로
    }
  };

  // 구글맵 네비로 목적지 설정
  const openGoogleNavi = () => {
    const query = encodeURIComponent(hotelInfo.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${query}`,
      "_blank"
    );
  };

  // 네이버네비 (모바일 앱 우선)
  const openNaverNavi = () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
      // 네이버맵 앱 실행 시도 (호텔명과 좌표 모두 포함)
      const naviUrl = `nmap://search?query=${encodeURIComponent(
        hotelInfo.name
      )}&appname=com.example.myapp`;
      window.location.href = naviUrl;

      // 2.5초 후 앱이 실행되지 않았다면 네이버맵 웹으로 이동
      setTimeout(() => {
        openNaverMap();
      }, 2500);
    } else {
      openNaverMap(); // PC는 네이버맵 웹으로
    }
  };

  // 티맵 - 안정적인 대체 방안으로 수정
  const openTmap = () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (isMobile) {
      // 안드로이드와 iOS 구분하여 처리
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (isAndroid) {
        // 안드로이드에서 티맵 실행 시도
        try {
          window.location.href = `tmap://search?name=${encodeURIComponent(
            hotelInfo.name
          )}`;

          // 3초 후 실행 실패시 구글맵으로 대체
          setTimeout(() => {
            openGoogleNavi();
          }, 3000);
        } catch (error) {
          // 즉시 구글맵으로 대체
          openGoogleNavi();
        }
      } else {
        // iOS에서는 애플 지도 시도 후 구글맵으로 대체
        try {
          window.location.href = `maps://maps.google.com/maps?q=${encodeURIComponent(
            hotelInfo.address
          )}`;

          setTimeout(() => {
            openGoogleNavi();
          }, 2000);
        } catch (error) {
          openGoogleNavi();
        }
      }
    } else {
      // PC에서는 구글맵으로
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

      {/* 부모 정보 및 날짜 */}
      <div className="doljanchi-info-card">
        <div className="doljanchi-parents">
          아빠 <span className="parent-name">최영민</span>, 엄마{" "}
          <span className="parent-name">김민경</span>
        </div>

        <div className="doljanchi-date">2025년 09월 13일 (토요일)</div>
        <div className="doljanchi-time">오후 5시 (17시)</div>
        <div className="doljanchi-venue">장소: {hotelInfo.name}</div>

        <div className="doljanchi-dday-container">
          <div className="doljanchi-dday">{dDay}</div>
        </div>
      </div>

      {/* 감성적인 메시지 */}
      <div className="doljanchi-message-card">
        <p>
          하나의 작은 점으로 시작하여 열 달을 품고 작고 여린 품에 보듬기도
          조심스러웠던 이 작은 아이로부터 엄마, 아빠로서의 삶을 배웠습니다.
        </p>
        <p>
          어느날 천사처럼 나타난 우리 아이가 어느덧 일 년이 되어 감사하는
          마음으로 조이한 자리를 마련하였습니다.
        </p>
        <p className="doljanchi-message-highlight">
          바쁘시더라도 사랑하는 우리 아이가 건강하게 자라도록 참석하여
          축복해주시면 큰 기쁨이 되겠습니다.
        </p>
      </div>

      {/* 지도 및 위치 정보 */}
      <div className="doljanchi-location-card">
        <h3 className="location-title">오시는 길</h3>
        <div className="location-address-card">
          <p className="location-address">{hotelInfo.address}</p>
        </div>

        {/* 구글맵 임베드 */}
        <div className="doljanchi-map-container">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              hotelInfo.address
            )}&output=embed&z=16`}
            className="doljanchi-map"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* 네비게이션 앱 버튼들 */}
        <div className="navi-section">
          <h4 className="navi-title">네비로 길찾기</h4>
          <div className="navi-buttons-container">
            {/* 카카오맵 로고 버튼 */}
            <div className="navi-btn kakao-btn" onClick={openKakaoNavi}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="#3c1e1e"
                  d="M12 3C7.03 3 3 6.58 3 10.95c0 4.38 4.18 7.46 6.89 9.64l2.11 1.7l2.11-1.7C16.82 18.41 21 15.33 21 10.95C21 6.58 16.97 3 12 3zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"
                />
              </svg>
            </div>

            {/* 네이버맵 로고 버튼 */}
            <div className="navi-btn naver-btn" onClick={openNaverNavi}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"
                />
              </svg>
            </div>

            {/* 구글맵 로고 버튼 */}
            <div className="navi-btn google-btn" onClick={openGoogleNavi}>
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

            {/* 티맵 로고 버튼 */}
            <div className="navi-btn tmap-btn" onClick={openTmap}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="white"
                  d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zm0 2.83L17.1 18.4L12 16.17L6.9 18.4L12 4.83z"
                />
                <circle fill="white" cx="12" cy="8" r="2" />
              </svg>
            </div>
          </div>

          {/* 앱 이름 표시 
          <div className="navi-labels-container">
            <div className="navi-label">카카오맵</div>
            <div className="navi-label">네이버맵</div>
            <div className="navi-label">구글맵</div>
            <div className="navi-label">티맵</div>
          </div>
          */}
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
            헬퍼 연락처: <a href="tel:010-7503-6190">010-7503-6190</a>
          </span>
          <br />
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
