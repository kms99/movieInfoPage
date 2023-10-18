const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDVhNjJlYmEwMjExZDc4YjgxYWUyMzI3ZWNhNjgyZiIsInN1YiI6IjY0YjI5Mzk5Mzc4MDYyMDBmZjM4N2UyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8UaTRGLM2eoPK8c0wmZm01o7zS9r1Vij9ZWBfYJqCI4'
    }
  };


export async function getData(url){
    const response = await fetch(url,options);
    const data = await response.json();
    return data.results;
}
