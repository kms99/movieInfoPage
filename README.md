# 과제 정보

- 과제 주제 : 영화 정보사이트
- 과제 기한 : '23.10.18. ~ '23.10.23.
- 개발 기간 : '23.10.18. ~ '23.10.21.
- 데모 사이트 :[movie-info-page.vercel.app](https://movie-info-page.vercel.app/)

<hr>

## 사용 기술

- HTML
- CSS
- Vanilla JS

## 와이어 프레임

![image](https://github.com/kms99/movieInfoPage/assets/29966870/8b1116b8-6e6d-4984-b1ae-38629295c416)

## 시연

![image](<https://github.com/kms99/movieInfoPage/blob/8852cc776b7f4b2b4fda50c3441f0c8b1ae74b7f/ezgif.com-video-to-gif%20(5).gif>)

## 주요 기능

- 공통 기능

  - 헤더의 Title (Mov_Ie) 클릭시 main.html로 페이지 이동 (최초 popular Movie Data rending
  - 헤더의 돋보기 버튼 클릭시 search.html로 페이지 이동
  - 영화 poster_path 정보가 없을 시 디폴트 이미지 지정

- main.html

  - Carousel을 이용한 Popular Movie Data 보여주기
  - Search Movie Data를 이용할 시 캐러쉘 비활성화
  - Trailer 버튼을 클릭할 시 유튜브 링크 연결 (Trailer가 없는 Movie는 버튼 비활성화)
  - Reviews 버튼을 클릭할 시 리뷰 모달 나타나기 (Reviews가 없는 Movie는 버튼 비활성화)
  - 영화 데이터 상 rate를 기반으로 별점기능 추가

- seach.html

  - 검색어가 없을 경우 Text로 알려주기
  - 유효한 결과가 없을경우 Text로 알려주기
  - 유효한 결과가 있는 경우 search.html로 페이지 이동 (queryString으로 검색어 추가)

- searchList.html
  - queryString으로 넘어온 검색어를 기반으로 Api 호출하여 영화 리스트 출력
  - 총 영화 검색 개수 출력
  - 각 영화 카드는 hover시 뒤집기 효과와 좌측 상단에 영화명, 영화 ID 출력
  - 영화 카드 앞면에는 포스터 뒷면에는 영화 정보 출력
  - 영화 카드 클릭시 main.js로 페이지 이동 (queryString으로 영화 아이디 추가)

## 주요기술

- 커스텀 Carousel
- queryString을 이용한 page 전환
- CSS Animation 효과 ( 카드 뒤집기 )
- TMDB API 활용 (Popular API, Search API)
- JavaScript Module 활용
