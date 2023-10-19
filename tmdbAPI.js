const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDVhNjJlYmEwMjExZDc4YjgxYWUyMzI3ZWNhNjgyZiIsInN1YiI6IjY0YjI5Mzk5Mzc4MDYyMDBmZjM4N2UyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8UaTRGLM2eoPK8c0wmZm01o7zS9r1Vij9ZWBfYJqCI4'
    }
  };


export async function getData(url){
  try{
    const response = await fetch(url,options);
    const data = await response.json();
    console.log(data);
    return data.results;
  }catch(err){
    console.log(`err==>>'${err}`);
  }
}

export async function getSingleData(url){
  try{
    const response = await fetch(url,options);
    const data = await response.json();
    return data;
  }catch(err){
    console.log(`err==>>'${err}`);
  }
}
