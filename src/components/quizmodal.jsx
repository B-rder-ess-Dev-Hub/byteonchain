import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "../styles/Quiz.module.css";

// Dynamically import the correct Attestation component
import AttestOnboarding from "../../utils/attestUserOnboarding";
import AttestGeneral from "../../utils/attestUser";
import { useAccount, useSwitchChain, useChainId, } from 'wagmi';
import { networks } from '../../utils/config/networks';

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
  const chainId = useChainId();
  const matchingNetwork = networks.find(network => network.chainId === chainId);
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
  const [isAnswering, setIsAnswering] = useState(false); // Add state to track if user is in the process of answering
  const [answerFeedback, setAnswerFeedback] = useState(null); // Add feedback state
  
  

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
    setIsAnswering(false);
    setAnswerFeedback(null);
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
    // Prevent multiple rapid clicks
    if (isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(selectedOption);
    const correctOption = questions[currentQuestion].answer;
    setCorrectAnswer(correctOption);
  
    // Compare selected option with correct answer from DB
    const isCorrect = selectedOption === correctOption;
    if (isCorrect) {
      setScore((prev) => prev + (quiz?.marks_per_question || 1));
    }
    
    // Remove feedback message and just proceed to next question
    
    // Add a delay before moving to the next question
    setTimeout(() => {
      if (currentQuestion >= questions.length - 1) {
        setIsCompleted(true);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
      }
      setIsAnswering(false);
    }, 800); // Shorter delay since we're not showing feedback
  };

  const shareOnX = () => {
    if (!attestationUID) return;

    const attestationLink = `${matchingNetwork.baseURL}/${attestationUID}`;
    const postText =
      quiz?.purpose === "onboarding"
        ? `🚀 Just got onboarded to #Web3 via byteonchain.xyz, built by @borderlessdev! Signed my first attestation ever and ready to build #onchain with the #borderlesscommunity.\n\n💡 #ByteOnchain\n\n${attestationLink}`
        : `📚 Just completed a #Web3 course on byteonchain.xyz, powered by @borderlessdev! Leveling up my skills and diving deeper onchain as a web3 contributor. 💡 #ByteOnchain #borderlesscommunity\n\n${attestationLink}`;

    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`;
    window.open(xUrl, "_blank");
  };

  const updateCourseIdInDatabase = async (uid) => {
    try {
      // First fetch the current user data
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const userData = await response.json();
      
      // Get existing course_id object or initialize empty object
      const prevCourseId = userData.user.course_id || {};
  
      // Create updated course_id object - just store the UID directly
      const updatedCourseId = {
        ...prevCourseId,
        [quiz.course_title]: uid
      };
  
      // Update the database with new course_id
      const updateResponse = await fetch(`https://byteapi-two.vercel.app/api/api/user/${walletAddress}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          course_id: updatedCourseId
        })
      });
  
      if (!updateResponse.ok) {
        throw new Error("Failed to update course_id");
      }
      
      console.log("Course ID updated successfully!");
    } catch (error) {
      console.error("Error updating course_id:", error);
      throw error;
    }
  };
  
  const updateQuizAttempts = async (address) => {
    try {
      const newAttempts = quizAttempts + 1;
      
      const response = await fetch(`https://byteapi-two.vercel.app/api/api/user/${address}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          quiz_attempts: newAttempts,
          last_quiz_attempt: new Date().toISOString()
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update quiz attempts: ${errorData.message || 'Unknown error'}`);
      }
  
      setQuizAttempts(newAttempts); // Update state after successful API call
      console.log("Quiz attempts updated successfully!");
    } catch (error) {
      console.error("Error updating quiz attempts:", error);
      throw error; // Propagate error to handle it in the calling function
    }
  };
  
  const handleAttestationSuccess = async (uid) => {
    try {
      setAttestationUID(uid);
      await updateCourseIdInDatabase(uid);
      await updateQuizAttempts(walletAddress);
    } catch (error) {
      console.error("Error in handleAttestationSuccess:", error);
      // You might want to show an error message to the user here
    }
  };

  if (!isOpen || !quiz) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const maxAttempts = 5;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{quiz.course_title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {/* Improved warning banner */}
        {!isCompleted && (
          <div className={styles.warningCard}>
            <div className={styles.warningCardContent}>
              <span className={styles.warningIcon}>⚠️</span>
              <p className={styles.warningText}>
                Please read and answer carefully. Once you select an answer, you cannot change it or go back.
              </p>
            </div>
          </div>
        )}

        {!isCompleted && (
          <div className={styles.quizInfo}>
            <div className={styles.timerContainer}>
              <div className={styles.timerIcon}>⏱️</div>
              <div className={styles.timerText}>{formatTime(timer)}</div>
            </div>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressText}>
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {!walletAddress ? (
          <div className={styles.walletContainer}>
            <div className={styles.walletIcon}>🔐</div>
            <p>Please connect your wallet to take the quiz.</p>
            <button className={styles.connectButton} onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        ) : quizAttempts >= maxAttempts ? (
          <div className={styles.quizCompleted}>
            <div className={styles.completedIcon}>❌</div>
            <h3>Maximum Attempts Reached</h3>
            <p>You have reached the maximum number of attempts for this quiz.</p>
          </div>
        ) : isCompleted ? (
          <div className={styles.quizCompleted}>
            <div className={styles.completedIcon}>🎉</div>
            <h3>Quiz Completed!</h3>
            <div className={styles.scoreCard}>
              <div className={styles.scoreHeader}>Your Score</div>
              <div className={styles.scoreValue}>
                {score} / {questions.length * quiz.marks_per_question}
              </div>
              <div className={styles.scorePercentage}>
                {Math.round((score / (questions.length * quiz.marks_per_question)) * 100)}%
              </div>
            </div>
            
            {attestationUID ? (
              <div className={styles.buttonContainer}>
                <a 
                  href={`${matchingNetwork.baseURL}/attestation/view/${attestationUID}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.attestButton}
                >
                  View Attestation
                </a>
                <button className={`${styles.shareButton} ${styles.xButton}`} onClick={shareOnX}>
                  <span className={styles.xIcon}>𝕏</span> Share on X
                </button>
              </div>
            ) : (
              <Attest 
                walletAddress={walletAddress} 
                score={score} 
                course={quiz.course_title} 
                issuer={quiz.issuer} 
                userName={userName} 
                onAttestationSuccess={handleAttestationSuccess} 
              />
            )}
          </div>
        ) : (
          <div className={styles.questionContainer}>
            <h3 className={styles.questionText}>{questions[currentQuestion]?.question}</h3>
            
            {/* Remove the feedback message section */}
            
            <ul className={styles.optionsList}>
              {questions[currentQuestion]?.options.map((option, index) => (
                <li 
                  key={index} 
                  className={`${styles.option} 
                    ${selectedAnswer === option ? styles.selectedOption : ''}
                    ${isAnswering ? styles.disabled : ''}
                  `}
                  onClick={() => handleAnswerClick(option)}
                >
                  <span className={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={styles.optionText}>{option}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;