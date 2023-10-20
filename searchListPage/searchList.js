import { getData } from "../tmdbAPI.js";
import { imagePath } from "../shared.js";

const $mainTitle = document.getElementById("main-header__title");
const $searchBtn = document.getElementById("main-header__searchArea");
const $movieRenderContainer = document.querySelector(".main-movies__items");
const $movieNum = document.querySelector(".main-movies__title span");
const $currentSelectTitle = document.getElementById("currentTitle");
const $currentSelectId = document.getElementById("currentId");
const $currentSelect = document.querySelector(".main-movies__currentSelect");
const urlSearchParams = new URLSearchParams(window.location.search);
const searchKeyword = urlSearchParams.get("q");

const moviesList = await getData(
  `https://api.themoviedb.org/3/search/movie?query=${searchKeyword}&include_adult=false&language=ko-KR&page=1`
);

const addCard = () => {
  $movieNum.innerText = moviesList.length;

  let cardHtml = "";
  moviesList.forEach((movie) => {
    // StarRate 이미지 로직
    let renderStarCount = 0;
    const starRate = (movie.vote_average / 2).toFixed(1);
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
        starHtml += `<img src="../iconImage/card-star_full.svg" />`;
        renderStarCount++;
        continue;
      }
      if (starCount["half"]) {
        starHtml += `<img src="../iconImage/card-star_half.svg" />`;
        starCount["half"] = false;
        renderStarCount++;
        continue;
      } else {
        starHtml += `<img src="../iconImage/card-star_empty.svg" />`;
        renderStarCount++;
        continue;
      }
    }
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

addCard();

// 페이지 변경
// 메인페이지
$mainTitle.addEventListener("click", () => {
  window.location.href = "../index.html";
});
// 검색페이지
$searchBtn.addEventListener("click", () => {
  window.location.href = "../searchPage/search.html";
});

const $movieItem = document.querySelectorAll(".main-movie__item");

$movieItem.forEach(function (item) {
  item.addEventListener("mouseover", function () {
    $currentSelect.style.display = "block";
    $currentSelectTitle.innerText = item.dataset["title"];
    $currentSelectId.innerHTML = item.dataset["id"];
  });

  item.addEventListener("mouseout", function () {
    $currentSelect.style.display = "none";
  });
  item.addEventListener("click", function () {
    window.location.href = `../index.html?q=${item.dataset["id"]}`;
  });
});