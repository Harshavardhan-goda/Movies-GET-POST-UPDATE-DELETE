const express = require("express");
const app = express();
app.use(express.json());
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

//Add Movie name API
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const movieAddQuery = `
    INSERT INTO movie (director_id,movie_name,lead_actor)
    VALUES (
        ${directorId},
        '${movieName}',
        '${leadActor}'
    );`;
  const movieAdd = await db.run(movieAddQuery);
  response.send("Movie Successfully Added");
});

//Get movie_id API
const convertCase1 = (each) => {
  return {
    movieId: each.movie_id,
    directorId: each.director_id,
    movieName: each.movie_name,
    leadActor: each.lead_actor,
  };
};
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieIdQuery = `
    SELECT * FROM movie WHERE movie_id = '${movieId}';`;
  const movieArray = await db.get(movieIdQuery);
  response.send(convertCase1(movieArray));
});

//Update movie Details API
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const movieUpdateQuery = `
    UPDATE movie 
    SET director_id = ${directorId},
        movie_name = '${movieName}',
        lead_actor = '${leadActor}'
    WHERE movie_id = ${movieId};`;
  await db.run(movieUpdateQuery);
  response.send("Movie Details Updated");
});
//Delete movieDetails API
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `
     DELETE FROM movie WHERE movie_id = ${movieId};`;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});

module.exports = app;
