// src/components/Anniversary.jsx
import React, { useMemo } from "react";

const formatDate = (date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const Anniversary = ({ birthday }) => {
  const { day100, firstBirthday } = useMemo(() => {
    const birthDate = new Date(birthday);

    // 100일 계산
    const d100 = new Date(birthDate);
    d100.setDate(birthDate.getDate() + 99);

    // 첫돌 계산
    const firstBday = new Date(birthDate);
    firstBday.setFullYear(birthDate.getFullYear() + 1);

    return {
      day100: formatDate(d100),
      firstBirthday: formatDate(firstBday),
    };
  }, [birthday]);

  return (
    <div className="card">
      <h2>다인이의 기념일</h2>
      <p>
        <strong>🎀 100일:</strong> {day100}
      </p>
      <p>
        <strong>🎂 첫돌:</strong> {firstBirthday}
      </p>
    </div>
  );
};

export default Anniversary;
