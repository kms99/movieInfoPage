import { getData } from "../tmdbAPI.js";

const $mainTitle = document.getElementById("main-header__title");
const $searchBtn = document.getElementById("main-header__searchArea");
const $searchForm = document.querySelector(".main-search__form");
const $userInput = document.querySelector(".main-search__form-input");
const $checkText = document.querySelector(".main-search__successCheck");

// 검색결과가 있는지 확인
const searchResultCheck = async function(query){
  const searchData = await getData(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`);
  return searchData.length!==0?true:false;
};

// 검색 이벤트
$searchForm.addEventListener('submit',async function(e){
  // 입력한 검색 키워드
  const inputValue = $userInput.value;
  // form reload 이벤트 비활성화
  e.preventDefault();

  // 검색키워드에 따른 예외처리
  // (1) 입력한 값이 없을 때
  if (!inputValue){
    $checkText.innerHTML=`검색어가 입력되지 않았습니다.`;
    return;
  }

  // api 호출했을 시 결과값의 유무 (true/false)
  const result = await searchResultCheck(inputValue);

  // (2) 결과값이 있을 때 - queryString를 담아 페이지 전환
  result?window.location.href = `../searchListPage/searchList.html?q=${inputValue}`
  // (3) 결과값이 없을 때
  : $checkText.innerHTML=`"<span>${inputValue}</span>" 에 대한 검색 결과가 없습니다.`;
    $userInput.value='';
});

// 페이지 변경 (header)
// 메인페이지
$mainTitle.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
  // 검색페이지
$searchBtn.addEventListener("click", () => {
    window.location.href = "./search.html";
});
  