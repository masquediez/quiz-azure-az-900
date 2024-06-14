const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());

// Cargar las preguntas desde el archivo JSON
const questions = require("./questions.json");

app.get("/questions", (req, res) => {
  res.json(questions);
});

// Endpoint para obtener una pregunta específica por número de pregunta
app.get("/pregunta", (req, res) => {
  const numeroPregunta = parseInt(req.query.numeroPregunta);
  if (
    isNaN(numeroPregunta) ||
    numeroPregunta < 0 ||
    numeroPregunta >= questions.length
  ) {
    return res.status(400).send({ error: "Número de pregunta no válido" });
  }
  const pregunta = questions[numeroPregunta];
  res.json({ pregunta, totalPreguntas: questions.length });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
