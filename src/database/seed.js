let imdbId = "tt3896198";
let apiKey = "6b6a080a";

async function getMovieMetadata(imdbId, apiKey) {
  const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`;
  let response = await fetch(url);
  let data = await response.json();
  console.log(data.Title);
  return data;
}

getMovieMetadata();
