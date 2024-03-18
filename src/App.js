import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from the API
    fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple")
      .then(response => response.json())
      .then(data => {
        if (data.response_code === 0) {
          setQuestions(data.results);
        } else {
          console.error("Error fetching questions from the API");
        }
      })
      .catch(error => console.error("Error fetching questions:", error));
  }, []);

  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  return (
    <div className="App">
      {/* 1. Header  */}
      <h1>Movie Quiz 🎬</h1>

      {/* 2. Current Score  */}
      <h2>Score: {score}</h2>

      {/* 3. Show results or show the question game  */}
      {showResults ? (
        /* 4. Final Results */
        <div className="final-results">
          <h1>Final Results</h1>
          <h2>
            {score} out of {questions.length} correct - (
            {(score / questions.length) * 100}%)
          </h2>
          <button onClick={() => restartGame()}>Restart game</button>
        </div>
      ) : (
        /* 5. Question Card  */
        <div className="question-card">
          {/* Current Question  */}
          <h2>
            Question: {currentQuestion + 1} out of {questions.length}
          </h2>
          <h3 className="question-text" dangerouslySetInnerHTML={{ __html: questions[currentQuestion]?.question }}></h3>

          {/* List of possible answers  */}
          <ul>
            {questions[currentQuestion]?.incorrect_answers.concat(questions[currentQuestion]?.correct_answer).sort(() => Math.random() - 0.5).map((option, index) => {
              const isCorrect = option === questions[currentQuestion]?.correct_answer;
              return (
                <li
                  key={index}
                  onClick={() => optionClicked(isCorrect)}
                  dangerouslySetInnerHTML={{ __html: option }}
                ></li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
