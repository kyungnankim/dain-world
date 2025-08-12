/* eslint-env node */ // ✨ 이 한 줄을 맨 위에 추가하면 경고가 사라집니다.

// Node.js의 기본 모듈인 '파일 시스템(fs)'과 '경로(path)'를 가져옵니다.
const fs = require("fs");
const path = require("path");

// ▼▼▼ 이미지 파일이 있는 폴더 경로를 지정해주세요. ▼▼▼
const targetDirectory = path.join(__dirname, "public", "images");
// ▲▲▲ 보통 이 부분은 수정할 필요가 없습니다. ▲▲▲

// 처리할 이미지 확장자 목록
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

console.log(`'${targetDirectory}' 폴더의 파일 이름 변경을 시작합니다...`);

try {
  // 폴더 안의 모든 파일 목록을 읽어옵니다.
  const files = fs.readdirSync(targetDirectory);

  // 이미지 파일만 필터링합니다.
  const imageFiles = files.filter((file) => {
    const extension = path.extname(file).toLowerCase();
    return imageExtensions.includes(extension);
  });

  if (imageFiles.length === 0) {
    console.log("폴더에 변경할 이미지 파일이 없습니다.");
    process.exit(0);
  }

  // 이미지 파일을 순서대로 정렬합니다. (이름순)
  imageFiles.sort();

  let counter = 1; // 파일 번호는 1부터 시작

  // 필터링된 각 이미지 파일에 대해 반복 작업을 수행합니다.
  for (const oldFile of imageFiles) {
    const oldExtension = path.extname(oldFile).toLowerCase();
    const newFile = `dain_${counter}${oldExtension}`;

    const oldPath = path.join(targetDirectory, oldFile);
    const newPath = path.join(targetDirectory, newFile);

    // 파일 이름을 변경합니다.
    fs.renameSync(oldPath, newPath);

    console.log(`✅ ${oldFile}  ->  ${newFile} (으)로 변경됨`);
    counter++;
  }

  console.log(
    `\n🎉 총 ${imageFiles.length}개의 이미지 파일 이름 변경을 완료했습니다!`
  );
} catch (error) {
  console.error("\n❌ 오류가 발생했습니다:", error.message);
  console.error("폴더 경로가 올바른지, 폴더가 존재하는지 확인해주세요.");
  process.exit(1);
}
