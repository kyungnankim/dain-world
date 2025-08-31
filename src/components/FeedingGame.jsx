// src/components/FeedingGame.jsx
import React, { useState, useEffect } from "react";

import dainImage from "../assets/분유다인.png";
import crawlingDainImage from "../assets/엉금다인.png";
import bottleImage from "../assets/젖병.png";
import formulaImage from "../assets/분유통.png";

// 2단계 이유식 이미지들
import spinachImage from "../assets/시금치.png";
import pumpkinImage from "../assets/단호박.png";
import beefImage from "../assets/소고기.png";
import riceImage from "../assets/감자.png";
import sesameImage from "../assets/닭고기.png";
import riceCakeImage from "../assets/양파.png";

// 각 단계별 설정
const STAGE_CONFIG = {
  1: {
    maxScore: 6,
    foods: [{ image: bottleImage, name: "젖병" }],
    characterImage: dainImage,
    title: "🍼 분유 먹기",
    instruction: "화면을 클릭해서 다인이에게 우유를 먹여주세요!",
    completionMessage: "🎉 다인이는 6개월간 우유를 먹고 무럭무럭 자랐어요!",
  },
  2: {
    maxScore: 12, // 6가지 음식 * 2번씩
    foods: [
      { image: spinachImage, name: "시금치" },
      { image: pumpkinImage, name: "단호박" },
      { image: beefImage, name: "소고기" },
      { image: riceImage, name: "감자" },
      { image: sesameImage, name: "닭고기" },
      { image: riceCakeImage, name: "양파" },
    ],
    characterImage: crawlingDainImage,
    title: "🥄 이유식 먹기",
    instruction: "다양한 이유식을 먹여서 다인이를 키워주세요!",
    completionMessage:
      "🎊 다인이가 이유식을 먹고 무럭무럭 자라 첫 돌을 맞이했어요!",
  },
};

function FeedingGame({ onBack }) {
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });

  const [dainPosition, setDainPosition] = useState({ top: "50%", left: "50%" });
  const [foodPosition, setFoodPosition] = useState({ top: "70%", left: "50%" });
  const [foodOpacity, setFoodOpacity] = useState(1);

  useEffect(() => {
    const updateScreenSize = () => {
      if (typeof window !== "undefined") {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const currentStage = STAGE_CONFIG[stage] || STAGE_CONFIG[1];

  const getDainSize = () => {
    const isMobile = screenSize.width <= 768;
    const isTablet = screenSize.width > 768 && screenSize.width <= 1024;

    let baseSize, growthPerFood, maxSize;

    if (isMobile) {
      baseSize = 120;
      growthPerFood = 12;
      maxSize = 220;
    } else if (isTablet) {
      baseSize = 150;
      growthPerFood = 16;
      maxSize = 280;
    } else {
      baseSize = 180;
      growthPerFood = 20;
      maxSize = 350;
    }

    const currentSize = baseSize + score * growthPerFood;
    return Math.min(currentSize, maxSize);
  };

  const getCurrentFood = () => {
    if (stage === 1) {
      return currentStage.foods[0];
    } else {
      return currentStage.foods[currentFoodIndex % currentStage.foods.length];
    }
  };

  // 화면 내에서만 음식이 움직이도록 수정된 함수
  const moveFood = () => {
    const isMobile = screenSize.width <= 768;

    // 화면 경계 설정 - 더 보수적으로 설정
    const topPadding = isMobile ? 80 : 90; // 상단 네비게이션 아래
    const bottomPadding = isMobile ? 160 : 180; // 하단 네비게이션 + 안내문 위
    const sidePadding = isMobile ? 30 : 50; // 좌우 여백

    // 실제 게임 영역 크기 계산
    const gameAreaWidth = screenSize.width - sidePadding * 2;
    const gameAreaHeight = screenSize.height - topPadding - bottomPadding;

    // 음식 크기 고려 (90px)
    const foodSize = 90;
    const maxLeft = gameAreaWidth - foodSize;
    const maxTop = gameAreaHeight - foodSize;

    // 안전한 범위 내에서 랜덤 위치 계산
    const safeLeft = Math.max(0, Math.random() * maxLeft);
    const safeTop = Math.max(0, Math.random() * maxTop);

    // 최종 위치 설정 (패딩 추가)
    const finalLeft = sidePadding + safeLeft;
    const finalTop = topPadding + safeTop;

    setFoodPosition({
      top: `${finalTop}px`,
      left: `${finalLeft}px`,
    });
    setFoodOpacity(1);
  };

  // 다인이를 화면 가운데로 초기 위치 설정
  const initializeDainPosition = () => {
    const isMobile = screenSize.width <= 768;
    const topPadding = isMobile ? 80 : 90;
    const bottomPadding = isMobile ? 160 : 180;

    // 화면 중앙에 배치
    const centerX = screenSize.width / 2;
    const centerY =
      topPadding + (screenSize.height - topPadding - bottomPadding) / 2;

    setDainPosition({
      top: `${centerY}px`,
      left: `${centerX}px`,
    });
  };

  const restartGame = () => {
    setStage(1);
    setScore(0);
    setCurrentFoodIndex(0);
    setGameCompleted(false);
    setShowTransition(false);
    setIsMoving(false);

    // 다인이 위치 초기화 후 음식 위치 설정
    setTimeout(() => {
      initializeDainPosition();
      moveFood();
    }, 100);
  };

  const goToNextStage = () => {
    setShowTransition(true);

    setTimeout(() => {
      setStage(stage + 1);
      setScore(0);
      setCurrentFoodIndex(0);
      initializeDainPosition();
      moveFood();
      setShowTransition(false);
    }, 3000);
  };

  const handleScreenClick = () => {
    if (isMoving || showTransition || gameCompleted) return;

    setIsMoving(true);

    // 다인이가 음식 위치로 이동 (중앙 정렬을 위한 오프셋)
    const dainSize = getDainSize();
    const foodOffset = 45; // 음식 크기의 절반 (90px/2)
    const dainOffset = dainSize / 2;

    const newDainPosition = {
      top: `calc(${foodPosition.top} + ${foodOffset - dainOffset}px)`,
      left: `calc(${foodPosition.left} + ${foodOffset - dainOffset}px)`,
    };

    setDainPosition(newDainPosition);

    setTimeout(() => {
      const newScore = score + 1;
      setScore(newScore);
      setFoodOpacity(0);

      setTimeout(() => {
        if (stage === 2) {
          setCurrentFoodIndex(currentFoodIndex + 1);
        }

        setTimeout(() => {
          if (newScore >= currentStage.maxScore) {
            if (stage < 2) {
              goToNextStage();
            } else {
              setGameCompleted(true);
            }
          } else {
            moveFood();
          }
          setIsMoving(false);
        }, 200);
      }, 300);
    }, 600);
  };

  // 화면 크기 변경시 위치 재조정
  useEffect(() => {
    if (screenSize.width > 0 && screenSize.height > 0) {
      initializeDainPosition();
      if (!showTransition) {
        moveFood();
      }
    }
  }, [screenSize.width, screenSize.height]);

  // 스테이지 변경시 위치 재설정
  useEffect(() => {
    if (!showTransition && screenSize.width > 0) {
      setTimeout(() => {
        initializeDainPosition();
        moveFood();
      }, 100);
    }
  }, [stage]);

  if (!currentStage) {
    return <div className="feeding-game-loading">Loading...</div>;
  }

  const currentFood = getCurrentFood();
  const dainSize = getDainSize();

  return (
    <div
      className="feeding-game-container"
      onClick={handleScreenClick}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden", // 스크롤 방지
        position: "relative",
      }}
    >
      <div className="feeding-game-stage-indicator">
        {currentStage.title} - {score}/{currentStage.maxScore}
      </div>

      <div className="feeding-game-scoreboard">
        <img
          src={formulaImage}
          alt="분유통"
          className="feeding-game-scoreboard-icon"
        />
        <span className="feeding-game-scoreboard-text">냠냠: {score}번</span>
      </div>

      <img
        src={currentStage.characterImage}
        alt="다인이"
        className="feeding-game-dain"
        style={{
          position: "absolute",
          top: dainPosition.top,
          left: dainPosition.left,
          width: `${dainSize}px`,
          height: `${dainSize}px`,
          transform: "translate(-50%, -50%)", // 중앙 정렬
          transition: isMoving
            ? "top 0.5s ease-in-out, left 0.5s ease-in-out, width 0.3s ease, height 0.3s ease"
            : "width 0.3s ease, height 0.3s ease",
          zIndex: 2,
          userSelect: "none",
        }}
      />

      {!showTransition && !gameCompleted && (
        <img
          src={currentFood.image}
          alt={currentFood.name}
          className="feeding-game-food"
          style={{
            position: "absolute",
            top: foodPosition.top,
            left: foodPosition.left,
            width: "90px",
            height: "90px",
            opacity: foodOpacity,
            transition: "opacity 0.5s",
            zIndex: 1,
            userSelect: "none",
          }}
        />
      )}

      {!showTransition && !gameCompleted && (
        <div className="feeding-game-instruction">
          {currentStage.instruction}
          <br />
          <small>현재 음식: {currentFood.name}</small>
        </div>
      )}

      {showTransition && (
        <div className="feeding-game-modal">
          <div className="feeding-game-modal-emoji">
            {stage < 2 ? "🎉" : "🎊"}
          </div>
          <div className="feeding-game-modal-title">
            {currentStage.completionMessage}
          </div>
          {stage < 2 && (
            <div className="feeding-game-modal-subtitle">
              잠시 후 {STAGE_CONFIG[stage + 1].title} 단계로 넘어갑니다...
            </div>
          )}
          {stage >= 2 && (
            <div className="feeding-game-modal-subtitle">
              게임이 완료되었습니다! 메인으로 돌아갑니다...
            </div>
          )}
        </div>
      )}

      {gameCompleted && (
        <div className="feeding-game-modal">
          <div className="feeding-game-modal-emoji">🎊</div>
          <div className="feeding-game-modal-title">축하합니다!</div>
          <div className="feeding-game-modal-description">
            다인이가 모든 음식을 먹고 건강하게 자랐어요!
          </div>
          <div className="feeding-game-completed-buttons">
            <button
              className="fortune-btn feeding-game-restart-button"
              onClick={restartGame}
            >
              다시하기
            </button>
            <button
              className="fortune-btn feeding-game-home-button"
              onClick={onBack}
            >
              메인으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedingGame;
