import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "../styles/Quiz.module.css";
import Attest from "../../utils/attestUserOnboarding"; // Import the Attest component

const quizData = {
  "course_title": "Web3 Configuration - BUK",
  "Issuer": "BUK",
  "duration": "15 minutes",
  "total_questions": 13,
  "marks_per_question": 1,
  "questions": [
      {
          "question": "What is a key difference between Web3 and Web2?",
          "options": [
              "Web3 relies on centralized servers, while Web2 is decentralized.",
              "Web3 is built on blockchain technology, while Web2 relies on centralized databases.",
              "Web3 does not require the internet, while Web2 does.",
              "Web3 eliminates user-generated content, unlike Web2."
          ],
          "answer": "Web3 is built on blockchain technology, while Web2 relies on centralized databases."
      },
      {
          "question": "What is a major benefit of Web3?",
          "options": [
              "It ensures all transactions are private and untraceable.",
              "It allows users to have control and ownership over their data.",
              "It makes the internet faster without using blockchain.",
              "It is only accessible to large corporations."
          ],
          "answer": "It allows users to have control and ownership over their data."
      },
      {
          "question": "Which of the following is an example of a Web3 technology?",
          "options": [
              "Social media platforms like Facebook and Instagram",
              "Cloud storage solutions like Google Drive",
              "Smart contracts on Ethereum",
              "Traditional banking apps"
          ],
          "answer": "Smart contracts on Ethereum"
      },
      {
          "question": "How does Web3 improve financial transactions?",
          "options": [
              "By requiring intermediaries like banks to validate transactions",
              "By enabling peer-to-peer transactions through decentralized finance (DeFi)",
              "By increasing the cost of sending money across borders",
              "By limiting access to financial services"
          ],
          "answer": "By enabling peer-to-peer transactions through decentralized finance (DeFi)"
      },
      {
          "question": "What is a smart contract?",
          "options": [
              "A legal agreement that requires a lawyer to execute",
              "A program stored on the blockchain that automatically executes actions",
              "A contract used only by developers for coding purposes",
              "A document that outlines blockchain regulations"
          ],
          "answer": "A program stored on the blockchain that automatically executes actions"
      },
      {
          "question": "Which of these is NOT a common Web3 application?",
          "options": [
              "Decentralized Finance (DeFi)",
              "Non-Fungible Tokens (NFTs)",
              "Traditional banking apps",
              "Metaverse platforms"
          ],
          "answer": "Traditional banking apps"
      },
      {
          "question": "What is the main purpose of a blockchain in Web3?",
          "options": [
              "To provide centralized storage for user data",
              "To create a network controlled by a single authority",
              "To secure and verify transactions in a decentralized manner",
              "To replace social media networks"
          ],
          "answer": "To secure and verify transactions in a decentralized manner"
      },
      {
          "question": "What makes DAOs unique compared to traditional organizations?",
          "options": [
              "DAOs have a CEO who makes all decisions.",
              "DAOs operate through smart contracts and community governance.",
              "DAOs require government approval to function.",
              "DAOs rely on a central bank for funding."
          ],
          "answer": "DAOs operate through smart contracts and community governance."
      },
      {
          "question": "Who is the Tech Lead for borderless Tech club KANO?",
          "options": [
              "Emmybabs",
              "Xenotheking",
              "Vicky",
              "Mallam Ali"
          ],
          "answer": "Emmybabs"
      },
      {
          "question": "Who is B<>rder/ess Tech organization?",
          "options": [
              "Some guys talking about web3",
              "B<>rder/ess is a public good, raising the next generation of web3 developers, builders and contributors.",
              "B<>rder/ess is beautiful people in web3",
              "B<>rder/ess is a love organization"
          ],
          "answer": "B<>rder/ess is a public good, raising the next generation of web3 developers, builders and contributors."
      },
      {
          "question": "Who is the Lead Partner for B<>rder/ess world wide?",
          "options": [
              "Vitalik Buterin",
              "Satoshi Nakamoto",
              "KarlaGod",
              "Davido"
          ],
          "answer": "KarlaGod"
      },
      {
          "question": "Who are the latest partners of B<>rder/ess in February?",
          "options": [
              "Sonic",
              "Binance",
              "Octant",
              "Bybit"
          ],
          "answer": "Sonic"
      },
      {
          "question": "What are cipher sessions in B<>rder/ess?",
          "options": [
              "Times people buy cryptocurrencies",
              "Time people invest in connections",
              "A session people acquire web3 skills",
              "A session when people watch film together"
          ],
          "answer": "A session people acquire web3 skills"
      }
  ]
};





// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizModal = ({ isOpen, onClose }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(10 * 60); // 10 minutes
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [userName, setUserName] = useState("Unknown User");
  const [attestationUID, setAttestationUID] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuestions(shuffleArray(quizData.questions));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
    setTimer(10 * 60);
  }, [isOpen]);

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
        fetchUserData(accounts[0]); // Fetch user data
      }
    }
  };

  const fetchUserData = async (address) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${address}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserName(data.user.fullname || "Unknown User");
      setQuizAttempts(data.user.quiz_attempts || 0); // Set quiz attempts from database
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserName("Unknown User");
      setQuizAttempts(0);
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
      fetchUserData(accounts[0]); // Fetch user data after connecting wallet
    }
  };

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    if (option === questions[currentQuestion].answer) {
      setScore((prev) => prev + quizData.marks_per_question);
    }

    if (currentQuestion >= quizData.total_questions - 1) { 
      setIsCompleted(true); 
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }

    setSelectedAnswer(null); 
  };

  const updateQuizAttempts = async (address) => {
    try {
      const newAttempts = quizAttempts + 1;
      setQuizAttempts(newAttempts); 

      const response = await fetch(`https://byteapi-two.vercel.app/api/api/user/${address}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz_attempts: newAttempts }),
      });

      if (!response.ok) throw new Error("Failed to update quiz attempts");
      console.log("Quiz attempts updated successfully!");
    } catch (error) {
      console.error("Error updating quiz attempts:", error);
    }
  };

  const handleAttestationSuccess = (uid) => {
    setAttestationUID(uid);
    updateCourseIdInDatabase(uid);
  };

  const updateCourseIdInDatabase = async (uid) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const userData = await response.json();
      const prevCourseId = userData.user.course_id || {};

      const updatedCourseId = {
        ...prevCourseId,
        [quizData.course_title]: uid,
      };

      const updateResponse = await fetch(`https://byteapi-two.vercel.app/api/api/user/${walletAddress}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: updatedCourseId }),
      });

      if (!updateResponse.ok) throw new Error("Failed to update course_id");
      console.log("Course ID updated successfully!");
    } catch (error) {
      console.error("Error updating course_id:", error);
    }
  };

  if (!isOpen) return null;

  const progress = ((currentQuestion + 1) / quizData.total_questions) * 100;

  const maxAttempts = 5;

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
        ) : quizAttempts >= maxAttempts ? (
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
            {attestationUID ? (
              <>
                <a
                  href={`https://arbitrum.easscan.org/attestation/view/${attestationUID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attestButton}
                >
                  View Attestation
                </a>
                <button className={styles.closeButton} onClick={onClose}>
                  Close
                </button>
              </>
            ) : (
              <>
                <Attest
                  walletAddress={walletAddress}
                  score={score}
                  course={quizData.course_title}
                  issuer={quizData.Issuer}
                  userName={userName}
                  onAttestationSuccess={handleAttestationSuccess}
                />
                <button
                  className={styles.retakeButton}
                  onClick={() => {
                    setQuestions(shuffleArray(quizData.questions));
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setScore(0);
                    setIsCompleted(false);
                    setTimer(10 * 60);
                    updateQuizAttempts(walletAddress);
                  }}
                >
                  Retake Quiz
                </button>
              </>
            )}
          </div>
        ) : (
          <>
          <div className={styles.noticeContainer}>
            <p className={styles.noticeText}>
              Please read carefully before answering. You cannot go back once you answer.
            </p>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <h3 className={styles.questionText}>
            {questions[currentQuestion].question}
          </h3>
          <div className={styles.questionCounter}>
            <span>
              {currentQuestion + 1} / {quizData.total_questions}
            </span>
          </div>
          <ul className={styles.optionsList}>
            {questions[currentQuestion].options.map((option, index) => (
              <li
                key={index}
                className={`${styles.option} ${
                  selectedAnswer === option ? styles.selected : ""
                }`}
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