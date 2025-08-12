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

  return (
    <div className="card">
      <h2>💌 첫돌 잔치에 초대합니다</h2>
      <p>
        다인이가 태어나 처음 맞는 생일을 축하하는 자리를 마련했습니다.
        <br />
        귀한 걸음 하시어 다인이의 첫 생일을 함께 축복해주세요.
      </p>
      <p>
        <strong>날짜:</strong> 2025년 9월 13일 (토요일)
      </p>
      <p>
        <strong>다인이의 첫돌잔치까지</strong>
      </p>
      <div className="d-day">{dDay}</div>
    </div>
  );
};

export default Doljanchi;
