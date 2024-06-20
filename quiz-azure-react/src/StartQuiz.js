import React from "react";

const StartQuiz = ({
  textos,
  numQuestions,
  handleNumQuestionsChange,
  startQuiz,
  questionsLength,
}) => {
  return (
    <div className="start-quiz">
      <h2>{textos.titulo}</h2>
      <div>
        <label>{textos.numeroPreguntas}</label>
        <input
          type="number"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          min="1"
          max={questionsLength}
        />
      </div>
      <button onClick={startQuiz}>{textos.empezarQuiz}</button>
    </div>
  );
};

export default StartQuiz;
