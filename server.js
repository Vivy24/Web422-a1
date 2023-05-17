require("dotenv").config()
const MoviesDB = require("./modules/moviesDB.js")
const express = require("express")
const cors = require("cors")
const app = express()
const HTTP_PORT = process.env.PORT || 8080
const db = new MoviesDB()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.json({ message: "API listening" })
})

app.post("/api/movies", (req, res) => {
  try {
    const data = req.body.movie
    const addedMovie = db.addNewMovie(data)
    res.json(addedMovie)
  } catch (error) {
    console.error(error)
    res.status(500).json("Server Error")
  }
})

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
