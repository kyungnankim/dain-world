import React, { useEffect, useState } from "react";

const fortunes = [
  "오늘은 세상에서 가장 맛있는 맘마를 먹게 될 거예요! 🍼",
  "엄마 아빠의 사랑을 듬뿍 받아 행복 지수가 MAX! ❤️",
  "까르르~ 웃음소리가 온 집안에 울려 퍼지는 날! 😄",
  "뒤집기 성공? 새로운 개인기가 생길지도 몰라요!",
  "오늘 밤은 깨지 않고 통잠 자는 기적이! ✨",
  "최고의 컨디션으로 기분 좋은 하루를 보낼 거예요.",
  "다인이의 옹알이에 모두가 귀를 기울이는 날. 옹알옹알~",
  "작은 손으로 새로운 무언가를 꽉 잡게 될 거예요.",
  "예쁜 두 눈에 세상의 모든 신기한 것들이 담기는 날.",
  "방긋 웃는 미소 한 방에 가족 모두가 사르르 녹아요.",
  "오늘은 왠지 모르게 응가도 시원하게 성공! 쾌변의 날!",
  "포동포동 볼살이 더욱 사랑스러워지는 마법의 하루.",
  "아빠의 '비행기' 놀이가 그 어느 때보다 신날 거예요. ✈️",
  "엄마의 자장가에 스르르 꿀잠에 빠져들어요.",
  "발가락을 꼼지락꼼지락, 새로운 재미를 발견하는 날!",
  "세상 모든 장난감이 다인이의 친구가 되어줄 거예요.",
  "목욕 시간을 가장 좋아하게 될지도 몰라요! 첨벙첨벙~ 🛀",
  "다인이의 작은 발이 한 뼘 더 성장하는 날!",
  "새로운 소리에 갸우뚱? 호기심이 폭발하는 하루!",
  "오늘은 왠지 모르게 잠투정도 안 하는 순둥이 모드!",
  "까꿍 놀이에 세상 가장 행복한 웃음을 터뜨릴 거예요.",
  "몰라보게 쑥쑥 자라 모두를 놀라게 할 거예요.",
  "엄마의 심장을 저격하는 필살 애교 발사! 💘",
  "아빠의 턱수염도 오늘은 간지럽지 않고 재밌어요!",
  "새로운 맛의 퓨레에 눈이 번쩍 뜨일지도! 🥕",
  "작은 두 손을 모아 짝짝꿍! 박수를 배우는 날.",
  "창밖으로 보이는 모든 것이 신기하고 새로운 하루.",
  "다인이의 작은 숨소리가 세상 가장 평화로운 음악.",
  "오늘은 뭘 해도 귀엽다는 칭찬을 100번 들을 거예요.",
  "포근한 이불 속에서 최고의 행복을 느끼는 날.",
  "방귀 소리도 오늘은 경쾌한 연주 같아요! 뿡뿡! 🎶",
  "할머니의 무한 사랑에 에너지 완전 충전!",
  "할아버지의 구수한 이야기에 귀가 쫑긋!",
  "다인이의 작은 하품에 모두가 따라 하품하게 돼요.",
  "새 옷을 입고 모델처럼 맵시를 뽐내는 날!",
  "손가락 빠는 모습도 오늘은 예술적으로 보일 거예요.",
  "옹알이로 세상과 소통하는 능력이 +1 상승했습니다.",
  "배냇짓 한 번에 온 가족의 시선이 집중!",
  "엎드려서 고개 들기 신기록 달성! 튼튼 목!",
  "오늘은 왠지 모르게 트림도 한 번에 성공!",
  "거울 속의 친구(자기 자신)와 즐겁게 노는 날.",
  "알록달록 모빌이 최고의 영화가 되어줄 거예요.",
  "엄마 품이 세상에서 가장 아늑한 침대라는 걸 깨닫는 날.",
  "아빠의 든든한 팔은 최고의 놀이기구!",
  "작은 입으로 오물오물, 새로운 맛을 탐험해요.",
  "다인이의 존재 자체가 가족에게는 가장 큰 선물! ",
  "오늘은 찡그린 표정마저 사랑스러워 보여요.",
  "배밀이로 온 집안을 탐험하는 용감한 탐험가!",
  "작은 손가락 하나하나가 소중한 보물이에요.",
  "옹알이로 노래 실력을 뽐내는 작은 가수!",
  "오늘은 왠지 모르게 머리카락이 한 올 더 자란 것 같아요!",
  "새로운 장난감 친구가 생길지도 몰라요.",
  "다인이의 웃음소리는 세상 모든 비타민!",
  "작은 몸짓 하나하나에 이야기가 담겨 있어요.",
  "오늘은 꿀잠 예약! 꿈속에서 훨훨 날아다닐 거예요.",
  "엄마 아빠의 목소리를 정확하게 구분하는 똑똑이가 되는 날.",
  "다인이의 눈동자는 우주를 담은 듯 반짝여요. ✨",
  "포동포동 뱃살은 다인이의 매력 포인트!",
  "오늘은 이유식 한 그릇 뚝딱! 먹방 요정 등극!",
  "작은 발도장 꾹! 새로운 역사를 만들어가는 날.",
  "엄마의 향기가 세상 최고의 아로마 테라피.",
  "아빠의 엉뚱한 표정 개그에 빵 터질 거예요.",
  "오늘은 왠지 칭얼거림도 노래처럼 들릴지도?",
  "다인이의 작은 손이 엄마의 손가락을 꽉 잡을 때, 사랑이 통해요.",
  "세상 모든 소리가 다인이의 호기심을 자극할 거예요.",
  "오늘은 잠자는 모습이 천사 그 자체! 👼",
  "새로운 표정을 습득하여 표현력이 풍부해집니다.",
  "다인이의 작은 기침 소리에도 온 가족이 주목!",
  "오늘은 어떤 자세로 자도 편안함을 느끼는 날.",
  "작은 몸으로 큰 행복을 선물하는 사랑둥이!",
  "맘마 먹고 기분 좋게 '아~' 소리를 낼 거예요.",
  "오늘은 왠지 모르게 양말 신는 걸 좋아하게 될지도?",
  "다인이의 눈웃음 한 방이면 모든 시름이 사라져요.",
  "작은 발가락에 힘을 주며 일어설 준비를 해요.",
  "옹알이로 가족회의에 참여하여 중요한 의견을 낼 거예요.",
  "오늘은 왠지 모르게 침을 덜 흘리는 깔끔한 날!",
  "다인이의 작은 움직임 하나가 가족에게는 큰 기쁨.",
  "오늘은 어떤 옷을 입어도 찰떡같이 소화하는 패셔니스타.",
  "엄마 아빠의 사랑 고백을 100번 이상 듣게 될 거예요.",
  "작은 손으로 세상을 탐색하는 용감한 탐험가!",
  "오늘은 왠지 모르게 낯가림도 잠시 쉬어가는 날.",
  "다인이의 통통한 허벅지는 건강의 상징!",
  "새로운 까까 맛에 신세계를 경험할 거예요.",
  "오늘은 왠지 모르게 머리 감는 시간이 즐거울 거예요.",
  "다인이의 작은 재채기 소리마저 귀여움 그 자체!",
  "엄마의 '사랑해' 속삭임에 기분 좋게 잠이 들어요.",
  "아빠의 든든한 어깨에 올라 세상을 구경해요.",
  "오늘은 왠지 모르게 손톱 깎는 시간도 얌전할 거예요.",
  "다인이의 뽀얀 피부가 더욱 빛나는 하루.",
  "작은 입술로 '음마' 또는 '아빠' 비슷한 소리를 낼지도!",
  "오늘은 왠지 모르게 기저귀 가는 시간도 즐거워요.",
  "다인이의 작은 심장 소리가 사랑의 멜로디.",
  "새로운 그림책에 푹 빠져드는 지적인 아기가 될 거예요.",
  "오늘은 왠지 모르게 유모차 타는 걸 가장 좋아해요.",
  "다인이의 모든 순간이 소중한 역사입니다.",
  "엄마의 따뜻한 눈빛 속에서 안정감을 찾아요.",
  "아빠의 장난에 속아주는 척, 연기력이 늘어나는 날.",
  "오늘은 왠지 모르게 보리차 맛이 꿀맛일 거예요.",
  "다인이의 꼼지락거림은 성장의 증거!",
  "작은 콧구멍으로 세상을 향기롭게 느껴요.",
  "오늘은 왠지 모르게 안겨있는 걸 가장 좋아해요.",
  "다인이의 맑은 눈은 거짓말을 못해요.",
  "새로운 소리를 따라하며 언어 능력이 쑥쑥!",
  "오늘은 왠지 모르게 카시트에도 얌전히 앉아있을 거예요.",
  "다인이의 행복이 곧 가족의 행복!",
  "엄마의 다정한 목소리는 최고의 안정제.",
  "아빠의 튼튼한 다리는 최고의 그네.",
  "오늘은 왠지 모르게 치즈 맛에 눈을 뜰지도!",
  "다인이의 작은 발자국이 미래를 향한 큰 걸음이 돼요.",
  "작은 귀로 세상의 모든 좋은 소리만 들어요.",
  "오늘은 왠지 모르게 혼자서도 잘 노는 독립적인 아기.",
  "다인이의 미소는 백만 불짜리 미소!",
  "새로운 촉감 놀이에 푹 빠져들 거예요.",
  "오늘은 왠지 모르게 병원에서도 울지 않는 용감한 아기.",
  "다인이의 모든 날이 기적이고 선물이에요.",
  "엄마의 노래 실력에 최고의 호응을 해줄 거예요.",
  "아빠의 코골이도 오늘은 자장가처럼 들릴지도?",
  "오늘은 왠지 모르게 과일 퓨레를 가장 좋아해요.",
  "다인이의 작은 손톱이 튼튼하게 자라나요.",
  "작은 머리로 세상을 이해하려 노력하는 기특한 아기.",
  "오늘은 왠지 모르게 '도리도리' 개인기를 보여줄지도!",
  "다인이의 뽀뽀는 세상 가장 달콤한 선물.",
  "새로운 친구(인형)를 가장 아끼게 될 거예요.",
  "오늘은 왠지 모르게 사진 찍을 때마다 웃어줄 거예요.",
  "다인이의 성장은 가족 모두의 자랑거리!",
  "엄마의 쓰담쓰담에 모든 걱정이 사라져요.",
  "아빠의 엉덩이 춤에 최고의 리액션을 보여줄 거예요.",
  "오늘은 왠지 모르게 물 마시는 걸 좋아하게 돼요.",
  "다인이의 작은 체온이 세상을 따뜻하게 만들어요.",
  "작은 심장이 두근두근, 새로운 경험에 설레는 날.",
  "오늘은 왠지 모르게 '만세' 포즈를 취할지도!",
  "다인이의 옹알이는 세상에서 가장 중요한 언어.",
  "새로운 장소에 가도 씩씩하게 적응할 거예요.",
  "오늘은 왠지 모르게 비눗방울 놀이에 푹 빠질 거예요.",
  "다인이의 하루는 사랑으로 가득 차 있어요.",
  "엄마의 요리 솜씨에 감탄하게 될 거예요.",
  "아빠의 목마 타기는 세상에서 가장 높은 놀이기구.",
  "오늘은 왠지 모르게 떡뻥을 가장 맛있게 먹어요.",
  "다인이의 작은 꿈이 무럭무럭 자라나는 밤.",
  "작은 코로 킁킁, 맛있는 냄새를 맡아요.",
  "오늘은 왠지 모르게 '잼잼' 개인기를 선보일지도!",
  "다인이의 눈물도 소중한 성장의 일부예요.",
  "새로운 노래에 맞춰 엉덩이를 들썩들썩!",
  "오늘은 왠지 모르게 이 닦는 시간도 즐거워요.",
  "다인이의 존재만으로도 세상은 충분히 아름다워요.",
  "엄마의 미소는 다인이를 따라 웃게 만들어요.",
  "아빠의 '까꿍'은 세상에서 제일 재미있는 마술.",
  "오늘은 왠지 모르게 요거트 맛에 반할 거예요.",
  "다인이의 작은 발이 세상을 향해 나아갑니다.",
  "작은 두 손으로 사랑을 전하는 방법을 배워요.",
];
const TodayFortune = ({ photos = [] }) => {
  const [fortune, setFortune] = useState(
    "버튼을 눌러 오늘의 운세를 확인하세요!"
  );
  const [fortuneImageUrl, setFortuneImageUrl] = useState(
    "https://ik.imagekit.io/duixwrddg/default-dain-world/default.png"
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log("TodayFortune - 받은 사진 개수:", photos.length);
  }, [photos]);

  const showFortune = () => {
    // 랜덤 운세 선택
    const randomFortuneIndex = Math.floor(Math.random() * fortunes.length);
    const selectedFortune = fortunes[randomFortuneIndex];
    setFortune(selectedFortune);

    // 사진이 있으면 랜덤 사진 선택
    if (photos && photos.length > 0) {
      const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
      console.log("선택된 운세 사진:", randomPhoto);

      setSelectedPhoto(randomPhoto);
      // fortuneUrl이 있으면 사용, 없으면 thumbnailUrl, 그것도 없으면 url 사용
      const imageUrl =
        randomPhoto.fortuneUrl || randomPhoto.thumbnailUrl || randomPhoto.url;
      setFortuneImageUrl(imageUrl);
      setImageError(false);
    } else {
      console.log("사진이 없어서 기본 이미지 사용");
      setSelectedPhoto(null);
      setFortuneImageUrl(
        "https://ik.imagekit.io/duixwrddg/default-dain-world/default.png"
      );
      setImageError(false);
    }
  };

  const handleImageError = (e) => {
    console.error("운세 이미지 로드 실패:", fortuneImageUrl);
    setImageError(true);

    // fallback 순서: selectedPhoto의 다른 URL들 시도
    if (selectedPhoto) {
      if (e.target.src !== selectedPhoto.url) {
        e.target.src = selectedPhoto.url;
        return;
      }
      if (
        e.target.src !== selectedPhoto.thumbnailUrl &&
        selectedPhoto.thumbnailUrl
      ) {
        e.target.src = selectedPhoto.thumbnailUrl;
        return;
      }
    }

    // 최종 fallback
    e.target.src =
      "https://ik.imagekit.io/duixwrddg/default-dain-world/default.png";
  };

  const handleImageLoad = () => {
    console.log("운세 이미지 로드 성공:", fortuneImageUrl);
    setImageError(false);
  };

  return (
    <div className="card fortune-card">
      <h2>✨ 다인이의 오늘의 운세 ✨</h2>

      {/* 사진 개수 표시 */}
      {photos.length > 0 && (
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
            marginBottom: "10px",
          }}
        >
          {photos.length}장의 사진 중에서 랜덤 선택
        </div>
      )}

      <div style={{ position: "relative", display: "inline-block" }}>
        {imageError ? (
          <div
            style={{
              width: "400px",
              height: "400px",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              border: "2px dashed #ddd",
              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center", color: "#999" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📷</div>
              <div>이미지 로드 실패</div>
            </div>
          </div>
        ) : (
          <img
            key={fortuneImageUrl} // key를 추가하여 이미지 변경시 리렌더링 보장
            src={fortuneImageUrl}
            alt="다인이 운세 사진"
            className="fortune-img"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{
              maxWidth: "400px",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "3px solid #ff69b4",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
        )}

        {/* 월 정보 표시 
        {selectedPhoto && (
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "rgba(255, 105, 180, 0.9)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {selectedPhoto.month}월
          </div>
        )}
          */}
      </div>

      <div
        id="fortune-text"
        style={{
          margin: "20px 0",
          padding: "15px",
          backgroundColor: "#fff8f0",
          borderRadius: "10px",
          border: "2px solid #ffd700",
          fontSize: "16px",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        {fortune}
      </div>

      <button onClick={showFortune} className="fortune-btn">
        {photos.length > 0 ? "운세 보기 🔮" : "운세 보기 (사진 없음)"}
      </button>

      {/* 사진이 없을 때 안내 메시지 */}
      {photos.length === 0 && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#f0f8ff",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
          }}
        >
          📸 월별 갤러리에서 사진을 추가하면
          <br />
          다인이 사진과 함께 운세를 볼 수 있어요!
        </div>
      )}
    </div>
  );
};

export default TodayFortune;
