import React, { useState, useEffect } from "react";
import dainImage from "../assets/우주다인.png";
import bottleImage from "../assets/젖병.png";
import formulaImage from "../assets/분유통.png";

// 게임 화면 전체 스타일
const gameContainerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "#fff0f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  fontFamily: '"Gowun Dodum", sans-serif',
  overflow: "hidden",
  padding: "10px",
  boxSizing: "border-box",
  cursor: "pointer", // 화면 전체에 클릭 커서 표시
};

// 다인이 이미지 스타일 (position absolute로 변경)
const dainStyle = {
  position: "absolute",
  width: "150px",
  height: "150px",
  userSelect: "none",
  // 부드러운 이동을 위한 transition 효과 추가
  transition: "top 0.5s ease-in-out, left 0.5s ease-in-out",
  // 다인이 이미지가 다른 요소 위에 있도록 zIndex 추가
  zIndex: 2,
};

// 젖병 이미지 스타일 (커서 제거)
const bottleStyle = {
  position: "absolute",
  width: "80px",
  userSelect: "none",
  transition: "opacity 0.5s",
  zIndex: 1,
};

// 점수판 스타일
const scoreBoardStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: "10px 20px",
  borderRadius: "20px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  zIndex: 3,
};

const formulaIconStyle = {
  width: "50px",
  marginRight: "10px",
};

const scoreTextStyle = {
  fontSize: "1.5em",
  color: "#e91e63",
  fontWeight: "bold",
};

// 설명 텍스트 스타일 (화면 맨 아래로 이동)
const instructionStyle = {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "1.1em",
  color: "#5d4037",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  padding: "8px 15px",
  borderRadius: "15px",
  zIndex: 3,
};

function FeedingGame({ onBack }) {
  const [score, setScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // 다인이와 젖병의 위치를 state로 관리
  const [dainPosition, setDainPosition] = useState({ top: "50%", left: "50%" });
  const [bottlePosition, setBottlePosition] = useState({
    top: "70%",
    left: "50%",
  });
  const [bottleOpacity, setBottleOpacity] = useState(1);

  // 젖병 위치를 랜덤으로 변경하는 함수
  const moveBottle = () => {
    // 화면 가장자리를 피해서 위치 선정
    const top = Math.random() * (window.innerHeight - 250) + 100;
    const left = Math.random() * (window.innerWidth - 150) + 50;
    setBottlePosition({ top: `${top}px`, left: `${left}px` });
    setBottleOpacity(1); // 젖병을 다시 보이게 함
  };

  // 화면 클릭 이벤트 핸들러
  const handleScreenClick = () => {
    if (isMoving) return;

    setIsMoving(true);

    // 1. 다인이를 젖병 위치로 이동
    // (다인이 이미지의 중심과 젖병 이미지의 중심을 맞추기 위해 좌표 보정)
    setDainPosition({
      top: `calc(${bottlePosition.top} - 35px)`,
      left: `calc(${bottlePosition.left} - 35px)`,
    });

    // 0.6초 후 (다인이가 젖병에 도착한 후)
    setTimeout(() => {
      setScore(score + 1);
      setBottleOpacity(0); // 젖병을 잠시 숨김

      // 0.4초 더 지난 후 (총 1초 후)
      setTimeout(() => {
        // 2. 다인이를 다시 중앙으로 복귀
        setDainPosition({ top: "50%", left: "50%" });
        // 3. 젖병을 새로운 위치에 표시
        moveBottle();
        setIsMoving(false);
      }, 400);
    }, 600);
  };

  // 컴포넌트가 처음 마운트될 때 젖병 위치 설정
  useEffect(() => {
    moveBottle();
  }, []);

  return (
    // 이제 화면 전체(div)를 클릭하면 handleScreenClick이 호출됩니다.
    <div style={gameContainerStyle} onClick={handleScreenClick}>
      {/* 뒤로가기 버튼은 클릭해도 게임이 동작하지 않도록 이벤트 버블링을 막아줍니다. */}
      <button
        className="fortune-btn"
        onClick={(e) => {
          e.stopPropagation();
          onBack();
        }}
        style={{ position: "absolute", top: "20px", left: "20px", zIndex: 3 }}
      >
        돌아가기
      </button>

      {/* 점수판 */}
      <div style={scoreBoardStyle}>
        <img src={formulaImage} alt="분유통" style={formulaIconStyle} />
        <span style={scoreTextStyle}>냠냠: {score}번</span>
      </div>

      {/* 다인이 이미지 (이제 position state에 따라 움직입니다) */}
      <img
        src={dainImage}
        alt="우주다인이"
        style={{ ...dainStyle, ...dainPosition }}
      />

      {/* 젖병 이미지 */}
      <img
        src={bottleImage}
        alt="젖병"
        style={{ ...bottleStyle, ...bottlePosition, opacity: bottleOpacity }}
      />

      {/* 설명 텍스트 (맨 아래로 이동) */}
      <p style={instructionStyle}>
        화면 아무 곳이나 클릭하면 다인이가 젖병으로 달려가요!
      </p>
    </div>
  );
}

export default FeedingGame;
