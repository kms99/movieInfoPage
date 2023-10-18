import { getData } from "./tmdbAPI.js";

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
const $reviewLists = document.querySelector('.review-area__lists');
const $reviewNums = document.getElementById('review-nums');
// Get popular movie data
const getPopular = await getData(
  "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1"
);

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
        index = getPopular.length - 1;
        return index;
    }
  };
})();

//index changing
const infoTextRender = async function (index) {
  const targetData = getPopular[index];
  const starRate = (targetData.vote_average / 2).toFixed(1);
  let renderStarCount = 0;
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

  $infoTitle.innerText = targetData.title;
  $starText.innerText = starRate;
  $starImage.innerHTML = starHtml;
  $overview.innerText = targetData.overview?targetData.overview:'등록된 정보가 없습니다.';

  const getTrailer = await getData(
    `https://api.themoviedb.org/3/movie/${targetData.id}/videos?language=ko-KR`
  );
  const getReviews = await getData(
    `https://api.themoviedb.org/3/movie/${targetData.id}/reviews?language=en-US&page=1`
  );

  if (getTrailer[getTrailer.length - 1]) {
    $trailerBtn.style.display = "block";
    $trailerBtn.value = getTrailer[getTrailer.length - 1].key;
  } else {
    $trailerBtn.style.display = "none";
  }

  if (getReviews.length !== 0) {
    $reviewsBtn.style.display = "block";
    const reviewsHtml = getReviews.map(review=>{
      const changeHtml = 
      `
      <div class="review-area__list">
              <div class="review-area__list-Author">${review['author_details']['username']}</div>
              <div class="review-area__list-comments">${review['content']}</div>
      </div>
      `;
      return changeHtml;
    });
    $reviewLists.innerHTML=reviewsHtml.join(" ");
    $reviewNums.innerText=getReviews.length;
  } else {
    $reviewsBtn.style.display = "none";
  }
};

// main carousel render movie
const renderPoster = (movies) => {
  let renderHtml = "";
  movies.forEach((movie) => {
    renderHtml += `
    <div class="main-info__carousel-Item swiper-slide">
      <img src="https://www.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}"/>
    </div>
    `;
  });
  $carouselContainer.innerHTML = renderHtml;
  infoTextRender(0);
};

// carousel Event
const carouselBtnEvent = function (value) {
  if (value === "next") {
    if (
      !$carouselContainer.style.right ||
      $carouselContainer.style.right === "0rem"
    ) {
      $carouselContainer.style.right = "35rem";
      infoTextRender(posterClosure("next"));
      return;
    } else if (
      (getPopular.length - 1) * 35 ===
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
  } else if (value === "prev") {
    if (
      !$carouselContainer.style.right ||
      $carouselContainer.style.right === "0rem"
    ) {
      $carouselContainer.style.right = `${(getPopular.length - 1) * 35}rem`;
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

const reviewCloseEvent = function(){
  $reviewLists.scrollTop=0;
  $reviewContainer.style.bottom = "150%";
  setTimeout(function () {
    $reviewArea.style.display = "none";
    $reviewContainer.style.bottom = "-50%";
  }, 500);
}



renderPoster(getPopular);

$nextBtn.addEventListener("click", function () {
  carouselBtnEvent("next");
});
$prevBtn.addEventListener("click", function () {
  carouselBtnEvent("prev");
});

$trailerBtn.addEventListener("click", function () {
  window.open(`https://www.youtube.com/watch?v=${this.value}`);
});
$reviewsBtn.addEventListener("click", function () {
  $reviewArea.style.display = "block";
  setTimeout(function () {
    $reviewContainer.style.bottom = "50%";
  }, 10);
});
$reviewCloseBtn.addEventListener("click", reviewCloseEvent);
$reviewCloseBtn.addEventListener("click", reviewCloseEvent);


document.addEventListener('mouseup',function(e){
  if($reviewArea.style.display === "block"){
    if (e.target.id !== "review-container"){
      if(!e.target.closest('#review-container')){
        reviewCloseEvent();
      }
    }
  }
})