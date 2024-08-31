"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Home() {
  const [quiz, setQuiz] = useState(null);
  const [theme, setTheme] = useState('light');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(Cookies.get('username') || '');

  useEffect(() => {
    if (username) {
      fetchQuiz();
    }
  }, [username]);

  const fetchQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/quiz');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const shuffledAnswers = data.answers.sort(() => Math.random() - 0.5);
      setQuiz({ ...data, answers: shuffledAnswers });
      setSelectedAnswer(null);
      setResult(null);
      setIsAnswered(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
    setIsLoading(false);
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

  const toggleModal = () => {
    setShowModal(!showModal);
    setIsSignup(false); // Default to login form
  };

  const handleFormSubmit = async () => {
    if (isSignup && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const url = isSignup ? 'http://localhost:3000/register' : 'http://localhost:3000/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert('Success: ' + JSON.stringify(data));
      Cookies.set('username', data.username, { expires: 1 }); // Set cookie for 1 day
      setUsername(data.username);
      setShowModal(false);
    } else {
      alert('Error: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center" data-theme={theme}>
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-base-100 shadow-md">
        <div className="flex items-center space-x-2">
          <label className="label">
            Theme:
          </label>
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
              {/* Quiz Content... */}
            </div>
          ) : (
            <p>Failed to load quiz. Please try again later.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{isSignup ? 'Signup' : 'Login'}</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input input-bordered w-full mb-4" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered w-full mb-4" />
            {isSignup && (
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input input-bordered w-full mb-4" />
            )}
            <button onClick={handleFormSubmit} className="btn btn-accent w-full mb-2">{isSignup ? 'Sign Up' : 'Log In'}</button>
            <button onClick={() => setIsSignup(!isSignup)} className="btn btn-link">{isSignup ? 'Already have an account? Log In' : 'No account? Sign up'}</button>
            <button onClick={toggleModal} className="btn btn-link text-gray-500">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}