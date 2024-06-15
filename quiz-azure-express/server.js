const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());

const questionsES = require("./questions-es.json");
const questionsEN = require("./questions-en.json");
const questionsDE = require("./questions-de.json");

// Endpoint para obtener preguntas según el idioma
app.get("/questions-es.json", (req, res) => {
  res.json(questionsES);
});

app.get("/questions-en.json", (req, res) => {
  res.json(questionsEN);
});

app.get("/questions-de.json", (req, res) => {
  res.json(questionsDE);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
