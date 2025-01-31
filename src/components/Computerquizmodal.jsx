import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "../styles/Quiz.module.css";
import Attest from "../../src/pages/attestation/utils/attestUser"; // Import the Attest component

const quizData = {
  "course_title": "Computer Appreciation Quiz",
  "duration": "10 minutes",
  "total_questions": 20,
  "marks_per_question": 5,
  "questions": [
    {
      "question": "Which component of a computer is responsible for executing instructions?",
      "options": ["Hard Drive", "RAM", "CPU", "GPU"],
      "answer": "CPU"
    },
    {
      "question": "What is the primary difference between RAM and ROM?",
      "options": [
        "RAM is non-volatile, while ROM is volatile",
        "RAM is temporary storage, while ROM is permanent storage",
        "ROM is faster than RAM",
        "ROM stores data permanently but is erased when power is off"
      ],
      "answer": "RAM is temporary storage, while ROM is permanent storage"
    },
    {
      "question": "Which function key is commonly used to enter the BIOS/UEFI setup during boot?",
      "options": ["F1", "F2", "F8", "F12"],
      "answer": "F2"
    }
  ]
};

const QuizModal = ({ isOpen, onClose }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(10 * 60); // 10 minutes in seconds
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      if (timer <= 0 || isTimerPaused) {
        clearInterval(interval);
        if (timer <= 0) setIsCompleted(true);
      } else {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer, isTimerPaused]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        const storedAttempts = localStorage.getItem(`quizAttempts_${accounts[0]}`);
        setAttempts(storedAttempts ? parseInt(storedAttempts, 10) : 0);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      const storedAttempts = localStorage.getItem(`quizAttempts_${accounts[0]}`);
      setAttempts(storedAttempts ? parseInt(storedAttempts, 10) : 0);
    }
  };

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    if (option === quizData.questions[currentQuestion].answer) {
      setScore((prev) => prev + quizData.marks_per_question);
    }
    setTimeout(() => {
      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsCompleted(true);
        if (walletAddress) {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          localStorage.setItem(`quizAttempts_${walletAddress}`, newAttempts.toString());
        }
      }
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.timerContainer}>
          <p className={styles.timer}>
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </p>
        </div>

        {!walletAddress ? (
          <div className={styles.walletContainer}>
            <p>Please connect your wallet to take the quiz.</p>
            <button className={styles.connectButton} onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        ) : attempts >= 2 ? (
          <div className={styles.limitContainer}>
            <h3>You have reached the maximum attempt limit.</h3>
            <p>You cannot retake the quiz again.</p>
          </div>
        ) : isCompleted ? (
          <div className={styles.quizCompleted}>
            <h3>Quiz Completed!</h3>
            <p className={styles.finalScore}>
              Final Score: <span>{score}</span> / {quizData.total_questions * quizData.marks_per_question}
            </p>
            {score >= 1 ? (
              <Attest
                walletAddress={walletAddress}
                score={score}
                course={quizData.course_title}
              />
            ) : (
              <div>
                <h4>You didn't pass the quiz.</h4>
                <button className={styles.retakeButton} onClick={onClose}>
                  Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className={styles.noticeContainer}>
              <p className={styles.noticeText}>
                Please read carefully before answering, you cannot go back once you answer.
              </p>
            </div>

            <h3 className={styles.questionText}>
              {quizData.questions[currentQuestion].question}
            </h3>
            <div className={styles.questionCounter}>
              <span>{currentQuestion + 1} / {quizData.total_questions}</span>
            </div>
            <ul className={styles.optionsList}>
              {quizData.questions[currentQuestion].options.map((option, index) => (
                <li
                  key={index}
                  className={`${styles.option} ${selectedAnswer === option ? styles.selected : ""}`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizModal;