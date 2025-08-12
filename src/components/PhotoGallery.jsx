import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Lazy } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/lazy";

const PhotoGallery = ({ photos }) => {
  return (
    <div>
      <h2>다인이의 성장 앨범</h2>
      <Swiper
        modules={[Navigation, Lazy]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        loop={false} // loop 비활성화
        lazy={{
          loadPrevNext: true, // 이전/다음 이미지 미리 로딩
          loadOnTransitionStart: true, // 전환 시작 시 이미지를 로드
        }}
        style={{ height: "500px", borderRadius: "10px" }}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <img
              data-src={photo.url} // 이미지 경로를 data-src로 넣기
              alt={photo.alt}
              className="swiper-lazy" // lazy 로딩 클래스
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoGallery;
