import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "../styles/Quiz.module.css";

// Dynamically import the correct Attestation component
import AttestOnboarding from "../../utils/attestUserOnboarding";
import AttestGeneral from "../../utils/attestUser";

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizModal = ({ isOpen, onClose, quiz }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(quiz?.duration ? parseInt(quiz.duration) * 60 : 600);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [userName, setUserName] = useState("Unknown User");
  const [attestationUID, setAttestationUID] = useState(null);

  const Attest = quiz?.purpose === "onboarding" ? AttestOnboarding : AttestGeneral;

  useEffect(() => {
    if (!isOpen || !quiz) return;

    // Shuffle questions while maintaining correct answers
    const shuffledQuestions = shuffleArray(quiz.questions || []);
    setQuestions(shuffledQuestions);

    // Reset quiz state
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setScore(0);
    setIsCompleted(false);
    setTimer(quiz.duration ? parseInt(quiz.duration) * 60 : 600);
  }, [isOpen, quiz]);

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
        fetchUserData(accounts[0]);
      }
    }
  };

  const fetchUserData = async (address) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${address}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserName(data.user.fullname || "Unknown User");
      setQuizAttempts(data.user.quiz_attempts || 0);
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
      fetchUserData(accounts[0]);
    }
  };

  const handleAnswerClick = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    const correctOption = questions[currentQuestion].answer;
    setCorrectAnswer(correctOption);

    // Compare selected option with correct answer from DB
    if (selectedOption === correctOption) {
      setScore((prev) => prev + (quiz?.marks_per_question || 1));
    }

    setTimeout(() => {
      if (currentQuestion >= questions.length - 1) {
        setIsCompleted(true);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
      }
    }, 1000);
  };

  const shareOnTwitter = () => {
    if (!attestationUID) return;

    const attestationLink = `https://arbitrum.easscan.org/attestation/view/${attestationUID}`;
    const tweetText =
      quiz?.purpose === "onboarding"
        ? `🚀 Just got onboarded to #Web3 via byteonchain.xyz, built by @borderlessdev! Signed my first attestation ever and ready to build #onchain with the #borderlesscommunity.\n\n💡 #ByteOnchain\n\n${attestationLink}`
        : `📚 Just completed a #Web3 course on byteonchain.xyz, powered by @borderlessdev! Leveling up my skills and diving deeper onchain as a web3 contributor. 💡 #ByteOnchain #borderlesscommunity\n\n${attestationLink}`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank");
  };

  if (!isOpen || !quiz) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const maxAttempts = 5;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{quiz.course_title}</h2>

        {!isCompleted && (
          <div className={styles.noticeContainer}>
            <p className={styles.noticeText}>
              Please read carefully before answering. You cannot go back once you answer.
            </p>
          </div>
        )}

        {!isCompleted && (
          <div className={styles.timerContainer}>
            <p className={styles.timer}>
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
            </p>
          </div>
        )}

        {!isCompleted && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {!walletAddress ? (
          <div className={styles.walletContainer}>
            <p>Please connect your wallet to take the quiz.</p>
            <button className={styles.connectButton} onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        ) : isCompleted ? (
          <div className={styles.quizCompleted}>
            <h3>🎉 Quiz Completed!</h3>
            <p className={styles.finalScore}>
              Final Score: <span>{score}</span> / {questions.length * quiz.marks_per_question}
            </p>
            {attestationUID ? (
              <div className={styles.buttonContainer}>
                <a href={`https://arbitrum.easscan.org/attestation/view/${attestationUID}`} target="_blank" rel="noopener noreferrer" className={styles.attestButton}>
                  View Attestation
                </a>
                <button className={styles.shareButton} onClick={shareOnTwitter}>🚀 Share</button>
              </div>
            ) : (
              <Attest walletAddress={walletAddress} score={score} course={quiz.course_title} issuer={quiz.issuer} userName={userName} onAttestationSuccess={setAttestationUID} />
            )}
          </div>
        ) : (
          <>
            <h3 className={styles.questionText}>{questions[currentQuestion]?.question}</h3>
            <ul className={styles.optionsList}>
              {questions[currentQuestion]?.options.map((option, index) => (
                <li key={index} className={styles.option} onClick={() => handleAnswerClick(option)}>
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