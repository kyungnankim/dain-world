// src/components/Welcome.jsx
import React, { useState, useEffect } from "react";

const Welcome = ({ partyDate, onEnter }) => {
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

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        {/* 다인이 천사 이미지 */}
        <div className="welcome-image-container">
          <img
            src="https://ik.imagekit.io/duixwrddg/dain-world/dainAngel.png?tr=w-300,h-300,c-at_max,q-80,f-webp"
            alt="다인이 천사"
            className="welcome-image"
            onError={(e) => {
              e.target.src = "/img/dainAngel.png";
            }}
          />
        </div>

        {/* 초대 메시지 */}
        <div className="welcome-message">
          <h1 className="welcome-title">💌 첫돌 잔치에 초대합니다</h1>

          <p className="welcome-text">
            다인이가 태어나 처음 맞는 생일을 축하하는 자리를 마련했습니다.
            <br />
            귀한 걸음 하시어 다인이의 첫 생일을 함께 축복해주세요.
          </p>

          <div className="welcome-info">
            <p className="welcome-date">
              <strong>📅 날짜:</strong> 2025년 9월 13일 (토요일)
            </p>

            <p className="welcome-countdown">
              <strong>🎂 다인이의 첫돌잔치까지</strong>
            </p>
            <div className="welcome-dday">{dDay}</div>
          </div>

          {/* 들어가기 버튼 */}
          <button className="enter-button" onClick={onEnter}>
            <span>🎂</span>
            다인이 월드 들어가기
            <span>✨</span>
          </button>
        </div>

        {/* 하단 장식 */}
        <div className="welcome-decoration">💝 ✨ 💕 ✨ 💝</div>
      </div>
    </div>
  );
};

export default Welcome;
