export const imagePath = function (poster_path){
    return poster_path?
    `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${poster_path}` : 
    `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg`;
}
