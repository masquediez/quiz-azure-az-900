import React from "react";

const Score = ({
  textos,
  score,
  numQuestions,
  handleResetQuiz,
  selectedQuestionsLength,
}) => {
  return (
    <div className="score">
      <h2>{textos.resultado}</h2>
      <div>
        {textos.puntuacion}: {score}/{selectedQuestionsLength}
      </div>
      <button onClick={handleResetQuiz}>{textos.reiniciarQuiz}</button>
    </div>
  );
};

export default Score;
