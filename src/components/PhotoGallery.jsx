// src/components/PhotoGallery.jsx

import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

const PhotoGallery = ({ photos }) => {
  return (
    <div>
      <h2>다인이의 성장 앨범</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={true}
        loop={false}
        lazy={true}
        // ✨ 여기에 style 속성을 다시 추가하여 높이를 지정합니다.
        style={{ height: "500px", borderRadius: "10px" }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <img
              src={photo.url}
              alt={photo.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
            {/* 이미지를 불러오는 동안 표시될 로딩 아이콘 */}
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoGallery;
