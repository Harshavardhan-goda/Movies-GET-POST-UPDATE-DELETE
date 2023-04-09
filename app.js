const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
const convertCase = (each) => {
  return {
    movieName: each.movie_name,
  };
};
//Get Movie name API
app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT movie_name FROM movie ORDER BY movie_id;`;
  const movieArray = await db.all(getMovieQuery);
  response.send(movieArray.map((each) => convertCase(each)));
});

module.exports = app;
