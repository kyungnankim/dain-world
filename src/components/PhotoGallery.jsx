// src/components/PhotoGallery.jsx
import React from "react";
// Swiper React 컴포넌트와 모듈, 스타일을 가져옵니다.
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const PhotoGallery = ({ photos }) => {
  return (
    <div>
      <h2>다인이의 성장 앨범</h2>
      <Swiper
        modules={[Navigation]} // Navigation 모듈 사용
        spaceBetween={10}
        slidesPerView={1}
        navigation // 네비게이션 버튼 활성화
        loop={true} // 무한 반복
        style={{ height: "500px", borderRadius: "10px" }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <img
              src={photo.url}
              alt={photo.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoGallery;
