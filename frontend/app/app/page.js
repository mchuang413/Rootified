"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [quiz, setQuiz] = useState(null);
  const [theme, setTheme] = useState('light');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = () => {
    setIsLoading(true);
    fetch('http://localhost:3000/quiz')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Shuffle the answers so the correct one isn't always first
        const shuffledAnswers = data.answers.sort(() => Math.random() - 0.5);
        setQuiz({ ...data, answers: shuffledAnswers });
        setSelectedAnswer(null);
        setResult(null);
        setIsAnswered(false);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching quiz:', error);
        setIsLoading(false);
      });
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.documentElement.setAttribute('data-theme', e.target.value);
  };

  const handleAnswerSelection = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && !isAnswered) {
      setIsAnswered(true);
      setResult(selectedAnswer === quiz.correct_answer ? "Correct!" : "Incorrect, try again.");
    }
  };

  const handleNextQuestion = () => {
    fetchQuiz();
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center" data-theme={theme}>
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-base-100 shadow-md">
        <div className="flex items-center space-x-2">
          <button className="btn btn-outline btn-info flex items-center">
            <span className="material-icons mr-2">palette</span> Theme
          </button>
          <select
            className="select select-bordered"
            value={theme}
            onChange={handleThemeChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="cupcake">Cupcake</option>
            <option value="bumblebee">Bumblebee</option>
            <option value="emerald">Emerald</option>
            <option value="corporate">Corporate</option>
            <option value="synthwave">Synthwave</option>
            <option value="retro">Retro</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="valentine">Valentine</option>
            <option value="halloween">Halloween</option>
            <option value="garden">Garden</option>
            <option value="forest">Forest</option>
            <option value="aqua">Aqua</option>
            <option value="lofi">Lofi</option>
            <option value="pastel">Pastel</option>
            <option value="fantasy">Fantasy</option>
            <option value="wireframe">Wireframe</option>
            <option value="black">Black</option>
            <option value="luxury">Luxury</option>
            <option value="dracula">Dracula</option>
          </select>
        </div>
        <button className="btn btn-accent">Signup/Login</button>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl mt-10">
        <div className="card-body animate-fade-in">
          <h2 className="card-title text-center">Latin Roots Quiz</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : quiz ? (
            <div>
              <p className="mb-4 font-bold text-lg text-center">{quiz.question}</p>
              <div className="form-control space-y-2">
                {quiz.answers.map((answer, index) => (
                  <label
                    key={index}
                    className={`label cursor-pointer rounded-lg p-3 transition-all duration-300 ${
                      selectedAnswer === answer && isAnswered
                        ? answer === quiz.correct_answer
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        : "bg-base-200 hover:bg-base-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz"
                      className="radio radio-primary hidden"
                      checked={selectedAnswer === answer}
                      onChange={() => handleAnswerSelection(answer)}
                      disabled={isAnswered}
                    />
                    <span className="label-text ml-2">{answer}</span>
                  </label>
                ))}
              </div>
              <button
                className="btn btn-accent mt-4 w-full"
                onClick={handleSubmit}
                disabled={isAnswered}
              >
                Submit
              </button>
              {result && (
                <div className="mt-4 text-lg font-bold text-center animate-fade-in">
                  <p className={result === "Correct!" ? "text-green-500" : "text-red-500"}>
                    {result}
                  </p>
                  {isAnswered && (
                    <button className="btn btn-primary mt-4 w-full" onClick={handleNextQuestion}>
                      Next Question
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>Failed to load quiz. Please try again later.</p>
          )}
        </div>
      </div>
    </div>
  );
}
