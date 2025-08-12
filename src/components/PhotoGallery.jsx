// src/components/PhotoGallery.jsx
import React from "react";
// Swiper의 Lazy Loading 기능을 사용하기 위해 모듈과 CSS를 추가로 가져옵니다.
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Lazy } from "swiper/modules";

// 기본 Swiper 스타일 외에 Lazy Loading 스타일도 추가합니다.
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/lazy";

const PhotoGallery = ({ photos }) => {
  return (
    <div>
      <h2>다인이의 성장 앨범</h2>
      <Swiper
        // Lazy 모듈을 Swiper에 등록합니다.
        modules={[Navigation, Lazy]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        // ✨ 문제의 원인이었던 loop 기능을 비활성화합니다.
        loop={false}
        // ✨ Lazy Loading 옵션을 활성화하여 속도를 높입니다.
        lazy={{
          loadPrevNext: true, // 이전/다음 이미지를 미리 로딩
        }}
        style={{ height: "500px", borderRadius: "10px" }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <img
              // 실제 이미지 경로는 data-src에 넣습니다.
              data-src={photo.url}
              alt={photo.alt}
              // lazy 로딩 클래스를 추가합니다.
              className="swiper-lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* 로딩 중임을 알려주는 동그라미 효과를 추가합니다. */}
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoGallery;
