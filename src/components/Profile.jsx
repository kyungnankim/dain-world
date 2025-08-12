// src/components/Profile.jsx
import React from "react";

// 날짜를 'YYYY년 MM월 DD일' 형식으로 변환하는 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

const Profile = ({ birthday }) => {
  return (
    <div className="card">
      <h2>다인이는요</h2>
      <p>
        <strong>이름:</strong> 최다인 (Choi Da-in)
      </p>
      <p>
        <strong>성별:</strong> 공주님 👑
      </p>
      <p>
        <strong>태어난 날:</strong> {formatDate(birthday)}
      </p>
    </div>
  );
};

export default Profile;
