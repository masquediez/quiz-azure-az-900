import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/questions");
        const shuffledQuestions = shuffleArray(response.data);
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setShowCorrectAnswer(false);
  };

  const checkAnswer = () => {
    if (selectedOption === selectedQuestions[currentQuestionIndex]?.answer) {
      setScore((prevScore) => prevScore + 1);
      setAnswerMessage("¡Korrekte Antwort!");
    } else {
      setAnswerMessage("Falsche Antwort");
    }
    setShowCorrectAnswer(true);
  };

  const handleNextQuestion = () => {
    setAnswerMessage("");
    setShowCorrectAnswer(false);

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
    }

    setSelectedOption("");
    setTimeLeft(60);
  };

  const handleResetQuiz = () => {
    window.location.reload();
  };

  const handleNumQuestionsChange = (e) => {
    setNumQuestions(Number(e.target.value));
  };

  const startQuiz = () => {
    const shuffledQuestions = shuffleArray(questions);
    const selected = shuffledQuestions.slice(0, numQuestions);
    setSelectedQuestions(selected);
    setShowScore(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
  };

  return (
    <div className="App">
      <div className="container">
        {showScore ? (
          <div>
            <p>
              Ihre Punktzahl ist {score} von {selectedQuestions.length}
            </p>
            <p>
              Prozentsatz der Wirksamkeit:
              {((score / selectedQuestions.length) * 100).toFixed(2)}%
            </p>
            <div className="button-container">
              <button onClick={handleResetQuiz}>Quiz neu starten</button>
            </div>
          </div>
        ) : (
          <div>
            {selectedQuestions.length === 0 ? (
              <div>
                <label>
                  wie viel Fragen?
                  <input
                    type="number"
                    min="1"
                    max={questions.length}
                    value={numQuestions}
                    onChange={handleNumQuestionsChange}
                  />
                </label>
                <button onClick={startQuiz}>Start Quiz</button>
              </div>
            ) : (
              <div>
                <div className="timer">Übrige Zeit: {timeLeft}s</div>
                <h2>{selectedQuestions[currentQuestionIndex].question}</h2>
                <div>
                  {selectedQuestions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className={`option ${
                          showCorrectAnswer &&
                          option ===
                            selectedQuestions[currentQuestionIndex].answer
                            ? "correct"
                            : showCorrectAnswer && option === selectedOption
                            ? "incorrect"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="option"
                          value={option}
                          checked={selectedOption === option}
                          onChange={handleOptionChange}
                          disabled={showCorrectAnswer}
                        />
                        {option}
                      </div>
                    )
                  )}
                </div>
                <div className="button-container">
                  <button onClick={checkAnswer} disabled={showCorrectAnswer}>
                    Prüfe die Antwort
                  </button>
                  {answerMessage && <p>{answerMessage}</p>}
                  <button onClick={handleNextQuestion}>Nächste Frage</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
