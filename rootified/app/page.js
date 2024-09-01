"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

export default function Home() {
  const [quiz, setQuiz] = useState(null);
  const [theme, setTheme] = useState("light");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetchQuiz();
    const storedEmail = Cookies.get('userEmail');
    if (storedEmail) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://rootified-backend-52fb8.ondigitalocean.app/quiz");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const shuffledAnswers = data.answers.sort(() => Math.random() - 0.5);
      setQuiz({ ...data, answers: shuffledAnswers });
      setSelectedAnswer(null);
      setResult(null);
      setIsAnswered(false);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
    setIsLoading(false);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.documentElement.setAttribute("data-theme", e.target.value);
  };

  const handleAnswerSelection = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer && !isAnswered) {
      setIsAnswered(true);
      setResult(
        selectedAnswer === quiz.correct_answer
          ? "Correct!"
          : "Incorrect, try again."
      );
      try {
        const response = await fetch(`https://rootified-backend-52fb8.ondigitalocean.app/${selectedAnswer === quiz.correct_answer ? "correct" : "incorrect"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: Cookies.get('userEmail'), word: quiz.question }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    }
  };

  const handleNextQuestion = () => {
    fetchQuiz();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setIsSignup(false);
    setLoginError("");
  };

  const handleFormSubmit = async () => {
    if (isSignup && password !== confirmPassword) {
      return;
    }

    const url = isSignup ? "https://rootified-backend-52fb8.ondigitalocean.app/register" : "https://rootified-backend-52fb8.ondigitalocean.app/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        Cookies.set('userEmail', email, { expires: 1 }); 
        setIsLoggedIn(true); 
        const successMessage = isSignup ? "Successful account creation" : "Successful login";
        setShowSuccessMessage(successMessage);
        setShowModal(false);
        setTimeout(() => {
          setShowSuccessMessage("");
          window.location.href = '/dashboard';  
        }, 2000);
      } else {
        setLoginError("Email or password incorrect");  
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginError("Email or password incorrect"); 
    }
  };

  const handleLogout = () => {
    Cookies.remove('userEmail');
    setIsLoggedIn(false); 
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center" data-theme={theme}>
      {showSuccessMessage && (
        <div className="fixed top-0 left-0 right-0 flex justify-center mt-4">
          <motion.div
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showSuccessMessage}
          </motion.div>
        </div>
      )}

        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-base-100 shadow-md">
          <div className="flex items-center space-x-2">
            {/* Logo with rounded corners */}
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-lg" />
            
            <label className="label">Theme:</label>
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
        <div className="flex space-x-2">
          {isLoggedIn ? (
            <button className="btn btn-warning" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="btn btn-accent" onClick={toggleModal}>
              Signup/Login
            </button>
          )}
        </div>
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
                    selectedAnswer === answer && !isAnswered
                      ? "bg-blue-200 text-blue-700" 
                      : selectedAnswer === answer && isAnswered
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
                  <p
                    className={
                      result === "Correct!" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {result}
                  </p>
                  {isAnswered && (
                    <button
                      className="btn btn-primary mt-4 w-full"
                      onClick={handleNextQuestion}
                    >
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

      {showModal && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-3xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {isSignup ? "Sign Up" : "Log In"}
              </h2>
              <button
                className="btn btn-sm btn-ghost text-gray-400 hover:text-gray-600"
                onClick={toggleModal}
              >
                ✕
              </button>
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
              />
            </div>
            {isSignup && (
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered"
                />
              </div>
            )}
            {loginError && (
              <div className="mb-4 text-red-500 text-center">
                {loginError}
              </div>
            )}
            <button
              className="btn btn-primary w-full mb-4"
              onClick={handleFormSubmit}
            >
              {isSignup ? "Sign Up" : "Log In"}
            </button>
            <button
              className="btn btn-link w-full mb-2"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup
                ? "Already have an account? Log In"
                : "No account? Sign up"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
