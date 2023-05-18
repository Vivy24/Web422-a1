/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Vivy Vuong Student ID: 154776207  Date: May 18th 2023
 *  Cyclic Link: https://real-pinafore-newt.cyclic.app
 ********************************************************************************/
require("dotenv").config();
const MoviesDB = require("./modules/moviesDB.js");
const express = require("express");
const cors = require("cors");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const db = new MoviesDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API listening" });
});

app.post("/api/movies", async (req, res) => {
  try {
    const data = db.Movie(req.body.movie);
    const addedMovie = await db.addNewMovie(data);
    res
      .status(201)
      .json({ message: "Created movie successfully", data: addedMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/movies", async (req, res) => {
  try {
    const page = req.query.page && +req.query.page;
    const perPage = req.query.perPage && +req.query.perPage;
    const title = req.query.title && req.query.title.toLowerCase();
    if (
      !page ||
      !perPage ||
      !Number.isInteger(page) ||
      !Number.isInteger(perPage) ||
      page < 0 ||
      perPage < 0
    ) {
      res.status(400).json({ message: "Bad Request. Invalid query" });
    } else {
      try {
        const movieList = await db.getAllMovies(page, perPage, title);
        res
          .status(200)
          .json({ message: "Query movie list successfully", data: movieList });
      } catch (error) {
        res.status(400).json({ message: error });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/movies/:_id", async (req, res) => {
  try {
    const movieId = req.params._id;
    const movie = await db.getMovieById(movieId);
    if (!movie) {
      res.status(400).json({ message: "Bad Request. Not a valid movie ID" });
    } else {
      res
        .status(200)
        .json({ message: "Query movie successfully", data: movie });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/api/movies/:_id", async (req, res) => {
  try {
    const movieId = req.params._id;
    const message = await db.updateMovieById(movieId);
    res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/api/movies/:_id", async (req, res) => {
  try {
    const movieId = req.params._id;
    const message = await db.deleteMovieById(movieId);
    res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
