// src/components/PhotoGallery.jsx

import React from "react";
// 1. 기능에 필요한 'Navigation' 모듈을 import 합니다.
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation"; // 네비게이션 '스타일'은 그대로 둡니다.

const PhotoGallery = ({ photos }) => {
  return (
    <div>
      <h2>다인이의 성장 앨범</h2>
      <Swiper
        // 2. 사용할 모듈 목록을 Swiper에 등록합니다.
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        // 3. navigation 옵션을 true로 설정합니다.
        navigation={true}
        loop={true}
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
