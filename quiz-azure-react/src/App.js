import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

// Archivos JSON con textos estáticos en diferentes idiomas
import textosES from "./textos-es.json";
import textosEN from "./textos-en.json";
import textosDE from "./textos-de.json";

const shuffleArray = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answerMessage, setAnswerMessage] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [language, setLanguage] = useState("es"); // Estado para el idioma seleccionado
  const [selectedLanguage, setSelectedLanguage] = useState("es"); // Estado para el botón de idioma seleccionado
  const [quizStarted, setQuizStarted] = useState(false); // Estado para controlar si se ha iniciado el quiz

  useEffect(() => {
    // Cargar las preguntas solo al inicio
    const fetchQuestions = async () => {
      const fetchedQuestions = await loadQuestionsByLanguage(language);
      if (fetchedQuestions.length > 0) {
        const shuffledQuestions = shuffleArray(fetchedQuestions);
        setQuestions(shuffledQuestions);
      }
    };
    fetchQuestions();
  }, [language]); // Añadir language a la dependencia para actualizar preguntas al cambiar idioma

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuestionsByLanguage = async (lang) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/questions-${lang}.json`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowCorrectAnswer(false);
  };

  const checkAnswer = () => {
    if (selectedOption === selectedQuestions[currentQuestionIndex]?.answer) {
      setScore((prevScore) => prevScore + 1); // Contabiliza la respuesta correcta
      setAnswerMessage(textos[language].respuestaCorrecta);
    } else {
      setAnswerMessage(textos[language].respuestaIncorrecta);
    }
    setShowCorrectAnswer(true);
  };

  const handleNextQuestion = () => {
    setShowCorrectAnswer(false);
    setAnswerMessage(""); // Limpiar el mensaje de respuesta

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setTimeLeft(60);
    } else {
      setShowScore(true);
    }
  };

  const handleResetQuiz = () => {
    setShowScore(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizStarted(false); // Reiniciar el estado de quizStarted
    setSelectedQuestions([]);
    setTimeLeft(60);
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(Number(e.target.value));
  };

  const startQuiz = () => {
    console.log("Starting quiz...");
    if (questions.length === 0) {
      console.error("No questions loaded");
      return;
    }
    setSelectedQuestions(shuffleArray(questions).slice(0, numQuestions));
    setShowScore(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
    setQuizStarted(true); // Marcar que el quiz ha comenzado
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setSelectedLanguage(lang); // Marca el botón de idioma seleccionado
  };

  // Definición de textos estáticos según el idioma seleccionado
  const textos = {
    es: textosES,
    en: textosEN,
    de: textosDE,
  };

  return (
    <div className="App">
      <div className="language-buttons">
        <button
          className={selectedLanguage === "es" ? "selected" : ""}
          onClick={() => changeLanguage("es")}
        >
          ES
        </button>
        <button
          className={selectedLanguage === "en" ? "selected" : ""}
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>
        <button
          className={selectedLanguage === "de" ? "selected" : ""}
          onClick={() => changeLanguage("de")}
        >
          DE
        </button>
      </div>
      <div className="container">
        {!quizStarted && !showScore && (
          <div className="start-quiz">
            <label>
              {textos[language].elegirCantidadPreguntas}
              <input
                type="number"
                min="1"
                max={questions.length}
                value={numQuestions}
                onChange={handleNumQuestionsChange}
              />
            </label>
            <button className="start-quiz-button" onClick={startQuiz}>
              {textos[language].iniciarQuiz}
            </button>
          </div>
        )}
        {quizStarted && !showScore && selectedQuestions.length > 0 && (
          <div>
            <div className="timer">
              {textos[language].tiempoRestante}: {timeLeft}s
            </div>
            <h2>{selectedQuestions[currentQuestionIndex]?.question}</h2>
            <div>
              {selectedQuestions[currentQuestionIndex]?.options.map(
                (option, index) => (
                  <div
                    key={index}
                    className={`option ${
                      showCorrectAnswer &&
                      option === selectedQuestions[currentQuestionIndex]?.answer
                        ? "correct"
                        : showCorrectAnswer &&
                          option !==
                            selectedQuestions[currentQuestionIndex]?.answer
                        ? "incorrect"
                        : selectedOption === option
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleOptionChange(option)}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionChange(option)}
                      disabled={showCorrectAnswer}
                    />
                    {option}
                  </div>
                )
              )}
            </div>
            <div className="button-container">
              <button
                className="verificar"
                onClick={checkAnswer}
                disabled={showCorrectAnswer}
              >
                {textos[language].verificarRespuesta}
              </button>
              {showCorrectAnswer && <p>{answerMessage}</p>}
              <button
                className="siguientePregunta"
                onClick={handleNextQuestion}
              >
                {textos[language].siguientePregunta}
              </button>
            </div>
          </div>
        )}
        {showScore && (
          <div>
            <p>
              {textos[language].puntuacion}: {score} / {numQuestions}
            </p>
            <p>
              {textos[language].porcentajeAciertos}:
              {((score / selectedQuestions.length) * 100).toFixed(2)}%
            </p>
            <div className="button-container">
              <button className="siguientePregunta" onClick={handleResetQuiz}>
                {textos[language].reiniciarQuiz}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
