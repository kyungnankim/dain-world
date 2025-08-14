import React from "react";

function ExistingPhotos({ photos, onDeletePhoto }) {
  if (!photos || photos.length === 0) {
    return <p>올라온 사진이 아직 없습니다.</p>;
  }

  return (
    <div>
      <h3>기존 사진 목록</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              border: "1px solid #ccc",
              padding: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={photo.alt}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <button onClick={() => onDeletePhoto(photo.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExistingPhotos;
