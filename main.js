import { getData, getSingleData } from "./tmdbAPI.js";

const $mainTitle = document.getElementById("main-header__title");
const $searchBtn = document.getElementById("main-header__searchArea");
const $carouselContainer = document.getElementById("carousel-item-container");
const $infoTitle = document.getElementById("movie-info-title");
const $starImage = document.getElementById("starRate-image");
const $starText = document.getElementById("starRate-text");
const $overview = document.getElementById("overview");
const $trailerBtn = document.getElementById("trailer-btn");
const $reviewsBtn = document.getElementById("review-btn");
const $prevBtn = document.querySelector(".carousel-button-prev");
const $nextBtn = document.querySelector(".carousel-button-next");
const $reviewArea = document.querySelector(".review-area");
const $reviewContainer = document.querySelector(".review-area__container");
const $reviewCloseBtn = document.getElementById("review-closeBtn");
const $reviewLists = document.querySelector(".review-area__lists");
const $reviewNums = document.getElementById("review-nums");
const $mainInfoTitle = document.querySelector(".main-info__title span");


const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("q");

const checkQuery = async function(id_check){
  
  if (Boolean(id_check)) {
    let data = [await getSingleData(`https://api.themoviedb.org/3/movie/${id_check}?language=ko-KR`)];
    return data;
  }else{
    let data = await getData(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1`);
    return data;
  }
}

const getMoviesData = await checkQuery(id);
// Get movie data
// const getMoviesData = checkQuery(id);

// const getMoviesData=await getData(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1`);

// console.log(id);
// const getMoviesData = await getData(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`);
// console.log(getMoviesData);

// carousel Index Closure
const posterClosure = (function () {
  let index = 0;

  return function (value) {
    switch (value) {
      case "next":
        return ++index;
      case "prev":
        return --index;
      case "firstIndex":
        index = 0;
        return index;
      case "lastIndex":
        index = getMoviesData.length - 1;
        return index;
    }
  };
})();

// carousel 인덱스를 이용한 메인페이지 text 랜더링
const infoTextRender = async function (index) {
  // 현재 인덱스에 따른 데이터 가져오기
  console.log(getMoviesData);
  const targetData = getMoviesData[index];
  console.log(targetData);
  // StarRate 이미지 로직
  let renderStarCount = 0;
  const starRate = (targetData.vote_average / 2).toFixed(1);
  let starCount = { full: Math.floor(parseFloat(starRate)) };
  let starHtml = "";

  if (parseFloat(starRate) - Math.floor(parseFloat(starRate)) === 0) {
    starCount["half"] = false;
  } else {
    parseFloat(starRate) - Math.floor(parseFloat(starRate)) >= 0.5
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

  // 데이터 랜더링
  $infoTitle.innerText = targetData.title;
  $starText.innerText = starRate;
  $starImage.innerHTML = starHtml;
  $overview.innerText = targetData.overview
    ? targetData.overview
    : "등록된 정보가 없습니다.";

  // 현재 인덱스 정보의 id 값을 이용한 Trailer, Reviews API 호출
  const getTrailer = await getData(
    `https://api.themoviedb.org/3/movie/${targetData.id}/videos?language=ko-KR`
  );
  const getReviews = await getData(
    `https://api.themoviedb.org/3/movie/${targetData.id}/reviews?language=en-US&page=1`
  );

  // Trailer 버튼 이벤트 예외처리
  if (getTrailer[getTrailer.length - 1]) {
    $trailerBtn.style.display = "block";
    $trailerBtn.value = getTrailer[getTrailer.length - 1].key;
  } else {
    $trailerBtn.style.display = "none";
  }

  // Reviews 버튼 이벤트 예외처리
  if (getReviews.length !== 0) {
    $reviewsBtn.style.display = "block";
    const reviewsHtml = getReviews.map((review) => {
      const changeHtml = `
      <div class="review-area__list">
              <div class="review-area__list-Author">${review["author_details"]["username"]}</div>
              <div class="review-area__list-comments">${review["content"]}</div>
      </div>
      `;
      return changeHtml;
    });
    $reviewLists.innerHTML = reviewsHtml.join(" ");
    $reviewNums.innerText = getReviews.length;
  } else {
    $reviewsBtn.style.display = "none";
  }
};

// popular API 데이터를 이용한 carousel Item 생성 및 랜더링
const renderPoster = (movies) => {

  console.log(movies)
  if (!Array.isArray(movies)) {
    movies=[movies];
  }
  console.log(movies)

  let renderHtml = "";
  movies.forEach((movie) => {
    renderHtml += `
    <div class="main-info__carousel-Item swiper-slide">
      <img src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}"/>
    </div>
    `;
  });
  $carouselContainer.innerHTML = renderHtml;

  // 최초 0번째 인덱스 TEXT 랜더링을 위한 함수 호출
  infoTextRender(0);
};

// carousel Prev, Next 버튼 클릭 시 이벤트 처리
const carouselBtnEvent = function (value) {
  // 다음버튼을 눌렀을 때
  if (value === "next") {
    if (
      !$carouselContainer.style.right ||
      $carouselContainer.style.right === "0rem"
    ) {
      $carouselContainer.style.right = "35rem";
      infoTextRender(posterClosure("next"));
      return;
    } else if (
      (getMoviesData.length - 1) * 35 ===
      parseInt($carouselContainer.style.right.replace("rem", ""))
    ) {
      $carouselContainer.style.right = "0rem";
      infoTextRender(posterClosure("firstIndex"));
      return;
    } else {
      const next =
        parseInt($carouselContainer.style.right.replace("rem", "")) + 35;
      $carouselContainer.style.right = `${next}rem`;
      infoTextRender(posterClosure("next"));
      return;
    }
  }
  // 이전 버튼을 눌렀을 때
  else if (value === "prev") {
    if (
      !$carouselContainer.style.right ||
      $carouselContainer.style.right === "0rem"
    ) {
      $carouselContainer.style.right = `${(getMoviesData.length - 1) * 35}rem`;
      infoTextRender(posterClosure("lastIndex"));
      return;
    } else {
      const next =
        parseInt($carouselContainer.style.right.replace("rem", "")) - 35;
      $carouselContainer.style.right = `${next}rem`;
      infoTextRender(posterClosure("prev"));
      return;
    }
  }
};

// 리뷰화면을 닫기위한 이벤트
const reviewCloseEvent = function () {
  $reviewLists.scrollTop = 0;
  $reviewContainer.style.bottom = "150%";
  setTimeout(function () {
    $reviewArea.style.display = "none";
    $reviewContainer.style.bottom = "-50%";
  }, 500);
};

// 코드 실행 부
// 최초 랜더링
renderPoster(getMoviesData);

// 검색데이터일시
if(getMoviesData.length===1){
  $nextBtn.style.display='none';
  $prevBtn.style.display='none';
  $mainInfoTitle.innerText='Search Movie'
}


// 버튼 이벤트 처리
// Carousel Button
// Carousel next 버튼
$nextBtn.addEventListener("click", function () {
  carouselBtnEvent("next");
});
// Carousel next 버튼
$prevBtn.addEventListener("click", function () {
  carouselBtnEvent("prev");
});

// Trailer 버튼
$trailerBtn.addEventListener("click", function () {
  window.open(`https://www.youtube.com/watch?v=${this.value}`);
});

// Reviews 버튼
$reviewsBtn.addEventListener("click", function () {
  $reviewArea.style.display = "block";
  setTimeout(function () {
    $reviewContainer.style.bottom = "50%";
  }, 10);
});

// Reviews 창 닫기 이벤트
// 내부 close 버튼을 클릭했을 때
$reviewCloseBtn.addEventListener("click", reviewCloseEvent);
// 내부 창 외에 다른 곳을 클릭했을 때
document.addEventListener("mouseup", function (e) {
  if ($reviewArea.style.display === "block") {
    if (e.target.id !== "review-container") {
      if (!e.target.closest("#review-container")) {
        reviewCloseEvent();
      }
    }
  }
});

// 페이지 변경
// 메인페이지
$mainTitle.addEventListener("click", () => {
  window.location.href = "./index.html";
});
// 검색페이지
$searchBtn.addEventListener("click", () => {
  window.location.href = "./searchPage/search.html";
});
