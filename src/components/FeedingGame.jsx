import React, { useState, useEffect } from "react";
import dainImage from "../assets/분유다인.png";
import crawlingDainImage from "../assets/엉금다인.png";
import bottleImage from "../assets/젖병.png";
import formulaImage from "../assets/분유통.png";

// 2단계 이유식 이미지들
import spinachImage from "../assets/시금치.png";
import pumpkinImage from "../assets/단호박.png";
import beefImage from "../assets/소고기.png";
import riceImage from "../assets/바나나.png";
import sesameImage from "../assets/오징어.png";
import riceCakeImage from "../assets/블루베리.png";

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
  cursor: "pointer",
};

// 다인이 이미지 스타일 (크기가 동적으로 변함)
const dainStyle = {
  position: "absolute",
  userSelect: "none",
  transition:
    "top 0.5s ease-in-out, left 0.5s ease-in-out, width 0.3s ease, height 0.3s ease",
  zIndex: 2,
};

// 음식 이미지 스타일
const foodStyle = {
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
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "15px 25px",
  borderRadius: "25px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 3,
};

// 단계 표시 스타일
const stageIndicatorStyle = {
  position: "absolute",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(233, 30, 99, 0.9)",
  color: "white",
  padding: "10px 20px",
  borderRadius: "20px",
  fontSize: "1.2em",
  fontWeight: "bold",
  zIndex: 3,
};

// 단계 전환 메시지 스타일
const stageTransitionStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: "30px 40px",
  borderRadius: "20px",
  textAlign: "center",
  fontSize: "1.3em",
  color: "#e91e63",
  fontWeight: "bold",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  zIndex: 4,
  animation: "popIn 0.5s ease-out",
};

// 설명 텍스트 스타일
const instructionStyle = {
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "1.1em",
  color: "#5d4037",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: "10px 20px",
  borderRadius: "15px",
  zIndex: 3,
  textAlign: "center",
};

// 각 단계별 설정
const STAGE_CONFIG = {
  1: {
    maxScore: 6,
    foods: [{ image: bottleImage, name: "젖병" }],
    characterImage: dainImage,
    title: "🍼 분유 먹기",
    instruction: "화면을 클릭해서 다인이에게 분유를 먹여주세요!",
    completionMessage: "🎉 다인이는 6개월간 분유를 먹었어요!",
  },
  2: {
    maxScore: 12, // 6가지 음식 * 2번씩
    foods: [
      { image: spinachImage, name: "시금치" },
      { image: pumpkinImage, name: "단호박" },
      { image: beefImage, name: "소고기" },
      { image: riceImage, name: "바나나" },
      { image: sesameImage, name: "오징어" },
      { image: riceCakeImage, name: "블루베리" },
    ],
    characterImage: crawlingDainImage,
    title: "🥄 이유식 먹기",
    instruction: "다양한 이유식을 먹여서 다인이를 키워주세요!",
    completionMessage: "🎊 다인이가 이유식을 다 먹고 무럭무럭 자랐어요!",
  },
};

function FeedingGame({ onBack }) {
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);

  // 다인이와 음식의 위치를 state로 관리
  const [dainPosition, setDainPosition] = useState({ top: "50%", left: "50%" });
  const [foodPosition, setFoodPosition] = useState({ top: "70%", left: "50%" });
  const [foodOpacity, setFoodOpacity] = useState(1);

  // 현재 단계 설정
  const currentStage = STAGE_CONFIG[stage];

  // 다인이 크기 계산 (먹을때마다 커짐)
  const getDainSize = () => {
    const baseSize = 120;
    const growthPerFood = 15;
    const currentSize = baseSize + score * growthPerFood;
    return Math.min(currentSize, 250); // 최대 크기 제한
  };

  // 현재 음식 가져오기
  const getCurrentFood = () => {
    if (stage === 1) {
      return currentStage.foods[0];
    } else {
      return currentStage.foods[currentFoodIndex % currentStage.foods.length];
    }
  };

  // 음식 위치를 랜덤으로 변경하는 함수
  const moveFood = () => {
    const top = Math.random() * (window.innerHeight - 300) + 100;
    const left = Math.random() * (window.innerWidth - 200) + 100;
    setFoodPosition({ top: `${top}px`, left: `${left}px` });
    setFoodOpacity(1);
  };

  // 다음 단계로 전환
  const goToNextStage = () => {
    setShowTransition(true);

    setTimeout(() => {
      setStage(stage + 1);
      setScore(0);
      setCurrentFoodIndex(0);
      setDainPosition({ top: "50%", left: "50%" });
      moveFood();
      setShowTransition(false);
    }, 3000);
  };

  // 화면 클릭 이벤트 핸들러
  const handleScreenClick = () => {
    if (isMoving || showTransition) return;

    setIsMoving(true);

    // 1. 다인이를 음식 위치로 이동
    setDainPosition({
      top: `calc(${foodPosition.top} - 35px)`,
      left: `calc(${foodPosition.left} - 35px)`,
    });

    // 0.6초 후 (다인이가 음식에 도착한 후)
    setTimeout(() => {
      const newScore = score + 1;
      setScore(newScore);
      setFoodOpacity(0); // 음식을 잠시 숨김

      // 2단계에서는 음식 순서 변경
      if (stage === 2) {
        setCurrentFoodIndex(currentFoodIndex + 1);
      }

      // 0.4초 더 지난 후 (총 1초 후)
      setTimeout(() => {
        // 단계 완료 체크
        if (newScore >= currentStage.maxScore) {
          if (stage < 2) {
            goToNextStage();
          } else {
            // 게임 완료
            setShowTransition(true);
            setTimeout(() => {
              onBack(); // 메인으로 돌아가기
            }, 3000);
          }
        } else {
          // 2. 다인이를 다시 중앙으로 복귀
          setDainPosition({ top: "50%", left: "50%" });
          // 3. 음식을 새로운 위치에 표시
          moveFood();
        }
        setIsMoving(false);
      }, 400);
    }, 600);
  };

  // 컴포넌트가 처음 마운트될 때 음식 위치 설정
  useEffect(() => {
    moveFood();
  }, []);

  // 단계가 변경될 때 음식 위치 재설정
  useEffect(() => {
    if (!showTransition) {
      moveFood();
    }
  }, [stage]);

  const currentFood = getCurrentFood();
  const dainSize = getDainSize();

  return (
    <div style={gameContainerStyle} onClick={handleScreenClick}>
      {/* 뒤로가기 버튼 */}
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

      {/* 단계 표시 */}
      <div style={stageIndicatorStyle}>
        {currentStage.title} - {score}/{currentStage.maxScore}
      </div>

      {/* 점수판 */}
      <div style={scoreBoardStyle}>
        <img
          src={formulaImage}
          alt="분유통"
          style={{ width: "40px", marginRight: "10px" }}
        />
        <span
          style={{ fontSize: "1.3em", color: "#e91e63", fontWeight: "bold" }}
        >
          냠냠: {score}번
        </span>
      </div>

      {/* 다인이 이미지 (크기가 동적으로 변함) */}
      <img
        src={currentStage.characterImage}
        alt="다인이"
        style={{
          ...dainStyle,
          ...dainPosition,
          width: `${dainSize}px`,
          height: `${dainSize}px`,
        }}
      />

      {/* 음식 이미지 */}
      {!showTransition && (
        <img
          src={currentFood.image}
          alt={currentFood.name}
          style={{ ...foodStyle, ...foodPosition, opacity: foodOpacity }}
        />
      )}

      {/* 설명 텍스트 */}
      {!showTransition && (
        <p style={instructionStyle}>
          {currentStage.instruction}
          <br />
          <small>현재 음식: {currentFood.name}</small>
        </p>
      )}

      {/* 단계 전환 메시지 */}
      {showTransition && (
        <div style={stageTransitionStyle}>
          <div style={{ fontSize: "3em", marginBottom: "15px" }}>
            {stage < 2 ? "🎉" : "🎊"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            {currentStage.completionMessage}
          </div>
          {stage < 2 && (
            <div style={{ fontSize: "1em", color: "#666", marginTop: "15px" }}>
              잠시 후 {STAGE_CONFIG[stage + 1].title} 단계로 넘어갑니다...
            </div>
          )}
          {stage >= 2 && (
            <div style={{ fontSize: "1em", color: "#666", marginTop: "15px" }}>
              게임이 완료되었습니다! 메인으로 돌아갑니다...
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default FeedingGame;
/*import React, { useState, useEffect } from "react";
import dainImage from "../assets/분유다인.png";
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

      <div style={scoreBoardStyle}>
        <img src={formulaImage} alt="분유통" style={formulaIconStyle} />
        <span style={scoreTextStyle}>냠냠: {score}번</span>
      </div>

      <img
        src={dainImage}
        alt="분유다인이"
        style={{ ...dainStyle, ...dainPosition }}
      />

      <img
        src={bottleImage}
        alt="젖병"
        style={{ ...bottleStyle, ...bottlePosition, opacity: bottleOpacity }}
      />
      <p style={instructionStyle}>
        화면 아무 곳이나 클릭하면 다인이가 젖병으로 달려가요!
      </p>
    </div>
  );
}

export default FeedingGame;
*/
