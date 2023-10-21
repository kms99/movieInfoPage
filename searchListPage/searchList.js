import { getData } from "../tmdbAPI.js";
import { imagePath, starRateHtml } from "../shared.js";

const $mainTitle = document.getElementById("main-header__title");
const $searchBtn = document.getElementById("main-header__searchArea");
const $movieRenderContainer = document.querySelector(".main-movies__items");
const $movieNum = document.querySelector(".main-movies__title span");
const $currentSelectTitle = document.getElementById("currentTitle");
const $currentSelectId = document.getElementById("currentId");
const $currentSelect = document.querySelector(".main-movies__currentSelect");

// queryString 값 확인
const searchKeyword =  new URLSearchParams(window.location.search).get("q");

// queryString의 값을 가져와 search api 호출 
const moviesList = await getData(
  `https://api.themoviedb.org/3/search/movie?query=${searchKeyword}&include_adult=false&language=ko-KR&page=1`
);

const addCard = () => {
  $movieNum.innerText = moviesList.length;
  let cardHtml = "";
  moviesList.forEach((movie) => {
    // 5점 기준 rate로 변경 및 starRate html text 가져오기 
    const starRate = (movie.vote_average / 2).toFixed(1);
    const starHtml = starRateHtml(starRate);
    
    // 각각의 영화카드 HTML 동적생성
    cardHtml += `
    <div class="main-movie__item" data-id="${movie.id}" data-title="${movie.title}">
            <div class="main-movie__item-flip">
              <div class="main-movie__card">
                <div class="front" style="background-image:url('${imagePath(movie.poster_path)}')"></div>
                <div class="back" style="background:linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('${imagePath(movie.poster_path)}'); background-position: center; background-size: cover;">
                  <div class="card-movieName">${movie.title}</div>
                  <div class='card-rate'>
                      <div class="card-rateStar">
                      ${starHtml}
                      </div>
                      <span class="card-rateText">
                          ${starRate}
                      </span>
                  </div>
                  <div class="card-contents">${movie.overview}</div>
                </div>
              </div>
            </div>
          </div>
    `;
    $movieRenderContainer.innerHTML = cardHtml;
  });
};

// 페이지 변경
// 메인페이지
$mainTitle.addEventListener("click", () => {
  window.location.href = "../index.html";
});
// 검색페이지
$searchBtn.addEventListener("click", () => {
  window.location.href = "../searchPage/search.html";
});

// 영화 카드 이벤트
const $movieItem = document.querySelectorAll(".main-movie__item");

$movieItem.forEach(function (item) {
  // 카드 hover시 각 카드의 title, id 출력
  item.addEventListener("mouseover", function () {
    $currentSelect.style.display = "block";
    $currentSelectTitle.innerText = item.dataset["title"];
    $currentSelectId.innerHTML = item.dataset["id"];
  });

  // 카드 hover out 시 각 카드의 title, id 안보이게 변경
  item.addEventListener("mouseout", function () {
    $currentSelect.style.display = "none";
  });

  // 카드 클릭시 영화 id를 queryString으로 담아서 페이지 전환
  item.addEventListener("click", function () {
    window.location.href = `../index.html?id=${item.dataset["id"]}`;
  });
});

// <<<<<<<코드 실행 부>>>>>>>>>>
addCard();