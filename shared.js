// image_path 값 예외처리
export const imagePath = function (poster_path) {
  return poster_path
    ? `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${poster_path}`
    : `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg`;
};

// rate를 starRateHTML로 변환해주는 함수
export const starRateHtml = function (rate) {
  let renderStarCount = 0;
  let starCount = { full: Math.floor(parseFloat(rate)) };
  let starHtml = "";

  if (parseFloat(rate) - Math.floor(parseFloat(rate)) === 0) {
    starCount["half"] = false;
  } else {
    parseFloat(rate) - Math.floor(parseFloat(rate)) >= 0.5
      ? (starCount["half"] = true)
      : (starCount["half"] = false);
  }

  while (renderStarCount < 5) {
    if (renderStarCount < starCount["full"]) {
      starHtml += `<img src="./iconImage/full-star.svg" />`;
      renderStarCount++;
      continue;
    }
    if (starCount["half"]) {
      starHtml += `<img src="./iconImage/half-star.svg" />`;
      starCount["half"] = false;
      renderStarCount++;
      continue;
    } else {
      starHtml += `<img src="./iconImage/empty-star.svg" />`;
      renderStarCount++;
      continue;
    }
  }
  return starHtml;
};
