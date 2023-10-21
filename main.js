import { getData, getSingleData } from "./tmdbAPI.js";
import { imagePath, starRateHtml } from "./shared.js";

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

// movieListPage에서 요소 클릭시 발생하는 queryString 값
const id = new URLSearchParams(window.location.search).get("id");

// queryString 값 체크
const checkQuery = async function(id_check){
  //queryString이 있다면, searchMovie api 호출
  if (Boolean(id_check)) { 
    let data = [await getSingleData(`https://api.themoviedb.org/3/movie/${id_check}?language=ko-KR`)];
    return data;
  }
  //queryString이 없다면, popularMovie api 호출
  else{
    let data = await getData(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`);
    return data;
  }
}
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
  const targetData = getMoviesData[index];
  // 5점 기준 rate로 변경 및 starRate html text 가져오기 
  const starRate = (targetData.vote_average / 2).toFixed(1);
  const starHtml = starRateHtml(starRate);
  // 데이터 랜더링
  $infoTitle.innerText = targetData.title?targetData.title:'등록된 제목이 없습니다.';
  $starText.innerText = starRate;
  $starImage.innerHTML = starHtml;
  $overview.innerText = targetData.overview?targetData.overview: "등록된 정보가 없습니다.";

  // 현재 인덱스 정보의 id 값을 이용한 Trailer, Reviews API 호출
  const getTrailer = await getData(
    `https://api.themoviedb.org/3/movie/${targetData.id}/videos?language=ko-KR`
  );
  const getReviews = await getData(
    `https://api.themoviedb.org/3/movie/${targetData.id}/reviews?language=en-US&page=1`
  );

  // Trailer값 유무에 따른 버튼 예외처리 
  // Trailer 값이 있을 때
  if (getTrailer[getTrailer.length - 1]) {
    $trailerBtn.style.display = "block";
    $trailerBtn.value = getTrailer[getTrailer.length - 1].key;
  }
  // Trailer 값이 없을 때
  else {
    $trailerBtn.style.display = "none";
  }

  // Reviews값 유무에 따른 예외처리
  // Reviews 값이 있을 때
  if (getReviews.length !== 0) {
    $reviewsBtn.style.display = "block";
    // Reviews값 HTMl 요소 동적생성
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
  } 
  // Reviews 값이 없을 때
  else {
    $reviewsBtn.style.display = "none";
  }
};

// movie 데이터를 이용한 carousel Item 생성 및 랜더링
const renderPoster = (movies) => {
  console.log(movies)
  // 단일 영화가 들어왔을 때
  if (movies.length===1) {
    //캐러쉘 버튼 비활성화, 타이틀 변경
    $nextBtn.style.display='none';
    $prevBtn.style.display='none';
    $mainInfoTitle.innerText='Search Movie';
  }

  // 캐러쉘 아이템(포스터) HTML 동적생성
  let renderHtml = "";
  movies.forEach((movie) => {
    const image_Path = imagePath(movie.poster_path);
    renderHtml += `
    <div class="main-info__carousel-Item swiper-slide">
      <img src="${image_Path}"/>
    </div>
    `;
  });
  // 랜더링
  $carouselContainer.innerHTML = renderHtml;

  // 최초 인덱스 TEXT 랜더링을 위한 함수 호출
  infoTextRender(posterClosure('firstIndex'));
};

// carousel Prev, Next 버튼 클릭 시 이벤트 처리
const carouselBtnEvent = function (value) {
  // 다음버튼을 눌렀을 때
  if (value === "next") {
    // 인덱스 0일 때 
    if (!$carouselContainer.style.right || $carouselContainer.style.right === "0rem") {
      $carouselContainer.style.right = "35rem";
      infoTextRender(posterClosure("next"));
      return;
    } 
    // 인덱스 마지막 일 때 > 0번 인덱스로 이동
    else if ((getMoviesData.length - 1) * 35 === parseInt($carouselContainer.style.right.replace("rem", ""))) {
      $carouselContainer.style.right = "0rem";
      infoTextRender(posterClosure("firstIndex"));
      return;
    } 
    // 일반적인 동작
    else {
      const next =
        parseInt($carouselContainer.style.right.replace("rem", "")) + 35;
      $carouselContainer.style.right = `${next}rem`;
      infoTextRender(posterClosure("next"));
      return;
    }
  }
  // 이전 버튼을 눌렀을 때
  else if (value === "prev") {
    // 인덱스 0일 때 > 마지막 인덱스로 이동
    if (!$carouselContainer.style.right || $carouselContainer.style.right === "0rem") {
      $carouselContainer.style.right = `${(getMoviesData.length - 1) * 35}rem`;
      infoTextRender(posterClosure("lastIndex"));
      return;
    } 
    // 일반적으로 동작할 때
    else {
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
  // 리뷰 항목에 scroll이 생겼을 경우 닫을 때는 최상위 스크롤로 이동
  $reviewLists.scrollTop = 0;

  // position:relative; 속성이기 때문에 위로 요소 이동
  $reviewContainer.style.bottom = "150%";

  // 0.5초의 시간 이후 reviewContainer를 담고있는 reviewArea 디스플레이 none처리
  // 이후 reviewContainer는 bottom = '-50%'로 위치이동 (아래쪽)
  setTimeout(function () {
    $reviewArea.style.display = "none";
    $reviewContainer.style.bottom = "-50%";
  }, 500);
};

// <<<<<<<코드 실행 부>>>>>>>>>>
// 영화 데이터 값 가져오기
const getMoviesData = await checkQuery(id);
// 최초 랜더링
renderPoster(getMoviesData);

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
