import React, { useState, useEffect, useRef } from "react";

/**
 * Kakao 지도를 표시하는 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프로퍼티
 * @param {number} props.lat - 위도
 * @param {number} props.lng - 경도
 */
const KakaoMap = ({ lat, lng }) => {
  // 지도를 담을 DOM 레퍼런스를 생성합니다.
  const mapContainer = useRef(null);

  useEffect(() => {
    // Kakao 지도 API 스크립트가 이미 로드되었는지 확인합니다.
    if (window.kakao && window.kakao.maps) {
      // 이미 로드되었다면 지도를 초기화합니다.
      initMap();
    } else {
      // 스크립트가 없다면 동적으로 생성하여 추가합니다.
      const script = document.createElement("script");
      script.async = true;
      // 여기에 본인의 Kakao Maps API 키를 입력해야 합니다.
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=38fd5ee37773faa7868aec6f8bf67018&autoload=false`;
      document.head.appendChild(script);

      // 스크립트 로드가 완료되면 지도를 초기화합니다.
      script.onload = () => {
        window.kakao.maps.load(() => {
          initMap();
        });
      };
    }

    // 지도 초기화 함수
    const initMap = () => {
      if (mapContainer.current) {
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
          level: 4, // 지도의 확대 레벨
        };
        // 지도를 생성합니다.
        const map = new window.kakao.maps.Map(mapContainer.current, options);

        // 마커가 표시될 위치입니다.
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);

        // 마커를 생성합니다.
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 마커가 지도 위에 표시되도록 설정합니다.
        marker.setMap(map);

        // 인포윈도우에 표시할 내용입니다.
        const iwContent = `<div style="padding:5px; font-size:14px; text-align:center;"><strong>메이필드 호텔 낙원</strong><br><a href="https://map.kakao.com/link/map/메이필드 호텔,${lat},${lng}" style="color:blue" target="_blank">큰 지도 보기</a> <a href="https://map.kakao.com/link/to/메이필드 호텔,${lat},${lng}" style="color:green" target="_blank">길찾기</a></div>`;
        const iwPosition = new window.kakao.maps.LatLng(lat, lng);

        // 인포윈도우를 생성합니다.
        const infowindow = new window.kakao.maps.InfoWindow({
          position: iwPosition,
          content: iwContent,
        });

        // 마커 위에 인포윈도우를 표시합니다.
        infowindow.open(map, marker);
      }
    };
  }, [lat, lng]); // lat, lng가 변경될 때마다 지도를 다시 렌더링합니다.

  // 지도가 표시될 div를 반환합니다.
  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
