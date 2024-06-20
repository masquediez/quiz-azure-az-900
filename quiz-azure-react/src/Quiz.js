import React from "react";

const Quiz = ({
  textos,
  selectedQuestions,
  currentQuestionIndex,
  timeLeft,
  selectedOption,
  showCorrectAnswer,
  answerMessage,
  handleOptionChange,
  checkAnswer,
  handleNextQuestion,
  score,
}) => {
  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="quiz">
      <h2>{textos.quiz}</h2>
      <div>
        {textos.tiempoRestante}: {timeLeft}
      </div>
      <div>
        {textos.puntuacion}: {score}
      </div>
      <div className="question">
        <h3>{currentQuestion.question}</h3>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
            />
            <label>{option}</label>
          </div>
        ))}
      </div>
      {showCorrectAnswer && <div>{answerMessage}</div>}
      <button onClick={checkAnswer}>{textos.comprobarRespuesta}</button>
      <button onClick={handleNextQuestion}>{textos.siguientePregunta}</button>
    </div>
  );
};

export default Quiz;
