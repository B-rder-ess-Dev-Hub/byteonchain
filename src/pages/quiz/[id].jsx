import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Sidebar from '../../components/Sidebarcons';
import Header from '../../components/Header';
import WalletWrapper from '../../components/WalletWrapper';
import AttestGeneral from '../../../utils/attestUser';
import Attest from '../../../utils/attestUserOnboarding';
import styles from '../../styles/Quiz.module.css';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers'; // ethers v6

export async function getStaticPaths() {
  const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;
  const res = await fetch('https://byteapi-two.vercel.app/api/quizzes/', {
    headers: {
      'Accept': 'application/json',
      'Bytekeys': apiKey,
    },
  });
  const data = await res.json();
  const quizzes = Array.isArray(data) ? data : data.quizzes || Object.values(data || {});
  
  const paths = quizzes.map((quiz) => {
    const safeTitle = quiz.course_title.replace(/\//g, '___SLASH___');
    return { params: { id: encodeURIComponent(safeTitle) } };
  });
  
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;
  let decodedTitle = decodeURIComponent(params.id);
  decodedTitle = decodedTitle.replace(/___SLASH___/g, '/');
  
  const res = await fetch(`https://byteapi-two.vercel.app/api/quizzes/${encodeURIComponent(decodedTitle)}`, {
    headers: {
      'Accept': 'application/json',
      'Bytekeys': apiKey,
    },
  });
  
  if (!res.ok) {
    return { notFound: true };
  }

  const quiz = await res.json();
  return { 
    props: { quiz },
    revalidate: 60
  };
}

// Utility function to fetch data
const fetchData = async (url) => {
  const apiKey = process.env.NEXT_PUBLIC_BYTE_API_KEY;
  const response = await fetch(`https://byteapi-two.vercel.app${url}`, {
    headers: {
      'Accept': 'application/json',
      'Bytekeys': apiKey || '',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch data from https://byteapi-two.vercel.app${url}: ${response.status} - ${errorText || 'Unknown error'}`);
  }

  return await response.json();
};

const QuizPage = ({ quiz = quizData }) => {
  const router = useRouter();
  const { address: walletAddress, isConnected } = useAccount();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [attestationUID, setAttestationUID] = useState(null);
  const [formattedWalletAddress, setFormattedWalletAddress] = useState(null);
  const [isAttestationSuccess, setIsAttestationSuccess] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [canStartQuiz, setCanStartQuiz] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Debug wallet and quiz data
  useEffect(() => {
    console.log("Wallet connection status:", { isConnected, walletAddress });
    console.log("Formatted wallet address:", formattedWalletAddress);
    console.log("Quiz purpose:", quiz.purpose);
    console.log("Quiz attempts:", quizAttempts);
    console.log("Can start quiz:", canStartQuiz);
  }, [isConnected, walletAddress, formattedWalletAddress, quiz.purpose, quizAttempts, canStartQuiz]);

  // Validate and set wallet address when it changes
  useEffect(() => {
    if (isConnected && walletAddress) {
      try {
        // Validate address format (basic check for length and prefix)
        if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
          throw new Error('Invalid Ethereum address format');
        }
        // Use ethers.getAddress to checksum the address, then convert to lowercase
        const checksummedAddress = ethers.getAddress(walletAddress);
        const formatted = checksummedAddress.toLowerCase();
        setFormattedWalletAddress(formatted);
        console.log("Formatted wallet address set (lowercase):", formatted);
      } catch (error) {
        console.error("Invalid wallet address:", walletAddress, error);
        setFormattedWalletAddress(null);
      }
    } else {
      setFormattedWalletAddress(null);
    }
  }, [walletAddress, isConnected]);

  // Fetch initial quiz attempts when wallet address is available
  useEffect(() => {
    const fetchQuizAttempts = async () => {
      if (isConnected && formattedWalletAddress) {
        try {
          const userData = await fetchData(`/api/user/${formattedWalletAddress}`);
          const attempts = userData.user?.quiz_attempts || 0;
          setQuizAttempts(attempts);
          setCanStartQuiz(attempts < 5);
        } catch (error) {
          console.error("Error fetching quiz attempts:", error);
          if (error.message.includes('404')) {
            // User not found, treat as new user with 0 attempts
            setQuizAttempts(0);
            setCanStartQuiz(true);
          } else {
            setErrorMessage(`Failed to load quiz attempts: ${error.message}`);
            setCanStartQuiz(false);
          }
        }
      } else {
        setCanStartQuiz(false);
      }
    };

    fetchQuizAttempts();
  }, [isConnected, formattedWalletAddress]);

  // Timer for quiz duration
  useEffect(() => {
    if (quizStarted && !showResult) {
      const durationStr = quiz.duration || '15 minutes';
      const minutes = parseInt(durationStr.match(/\d+/)[0]) || 15;
      setTimeLeft(minutes * 60);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quizStarted, showResult]);

  const updateCourseIdInDatabase = async (uid) => {
    try {
      // Use lowercase wallet address
      const lowercaseWalletAddress = walletAddress.toLowerCase();
      const userData = await fetchData(`/api/user/${lowercaseWalletAddress}`);
      
      const prevCourseId = userData.user.course_id || {};
  
      const updatedCourseId = {
        ...prevCourseId,
        [quiz.course_title]: uid
      };
  
      const updateResponse = await fetch(`https://byteapi-two.vercel.app/api/api/user/${lowercaseWalletAddress}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Bytekeys": process.env.NEXT_PUBLIC_BYTE_API_KEY || ''
        },
        body: JSON.stringify({ 
          course_id: updatedCourseId
        })
      });
  
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update course_id: ${updateResponse.status} - ${errorText || 'Unknown error'}`);
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
      // Use lowercase wallet address
      const lowercaseAddress = address.toLowerCase();
      
      const response = await fetch(`https://byteapi-two.vercel.app/api/api/user/${lowercaseAddress}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Bytekeys": process.env.NEXT_PUBLIC_BYTE_API_KEY || ''
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
  
      setQuizAttempts(newAttempts); 
      setCanStartQuiz(newAttempts < 5);
      console.log("Quiz attempts updated successfully!");
    } catch (error) {
      console.error("Error updating quiz attempts:", error);
      throw error; 
    }
  };

  if (router.isFallback) {
    return (
      <div className={styles.fallbackContainer}>
        <div className={styles.fallbackContent}>
          <div className={styles.spinner}></div>
          <h2 className={styles.fallbackText}>Loading Quiz...</h2>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className={styles.noQuizContainer}>
        <div className={styles.noQuizContent}>
          <svg className={styles.noQuizIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 className={styles.noQuizTitle}>No Quiz Found</h1>
          <p className={styles.noQuizMessage}>The quiz you're looking for doesn't exist or has no questions.</p>
          <button 
            onClick={() => router.push('/quiz')}
            className={styles.noQuizButton}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const correct = quiz.questions[currentQuestion].answer === selectedOption;
    setAnswers([...answers, { question: quiz.questions[currentQuestion].question, selected: selectedOption, correct }]);
    if (correct) setScore(score + (quiz.marks_per_question || 1));
    setSelectedOption(null);
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
  };

  const startQuiz = () => {
    if (canStartQuiz) {
      setQuizStarted(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
  };

  const getScorePercentage = () => {
    return (score / (quiz.questions.length * (quiz.marks_per_question || 1))) * 100;
  };

  const getScoreColorClass = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return styles.scoreValueGreen;
    if (percentage >= 60) return styles.scoreValueYellow;
    return styles.scoreValueRed;
  };

  const getScoreProgressBarClass = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return styles.scoreProgressBarGreen;
    if (percentage >= 60) return styles.scoreProgressBarYellow;
    return styles.scoreProgressBarRed;
  };

  const handleAttestationSuccess = async (newAttestationUID) => {
    setAttestationUID(newAttestationUID);
    setIsAttestationSuccess(true);
    
    // Update course ID and quiz attempts after successful attestation
    try {
      await updateCourseIdInDatabase(newAttestationUID);
      await updateQuizAttempts(walletAddress);
    } catch (error) {
      setErrorMessage(`Failed to update user data after attestation: ${error.message}`);
    }
  };

  const postToX = () => {
    const totalMarks = (quiz.marks_per_question || 1) * quiz.questions.length;
    let postText;
    if (quiz.issuer === 'Blockchain LAUTECH ') {
      postText = `I just completed the @Backpack_AFR "Backpack Campus Tour" Quiz by @BlockchainLaut1 with a score of ${score}/${totalMarks} on byteonchain.xyz by @borderlessdev\nCheck out my attestation🤓: https://arbitrum.easscan.org/attestation/view/${attestationUID}`;
    } else {
      postText = `I just completed the ${quiz.course_title} Quiz with a score of ${score}/${totalMarks} on byteonchain.xyz by @borderlessdev\nCheck out my attestation🤓: https://arbitrum.easscan.org/attestation/view/${attestationUID}`;
    }

    // Encode the text for URL
    const encodedText = encodeURIComponent(postText);
    // Open X in a new tab with the pre-filled tweet
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{quiz.course_title || 'Quiz'} | ByteOnChain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <div className={styles.mainLayout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <main className={styles.main}>
          <WalletWrapper>
            {!quizStarted ? (
              <div className={styles.quizContainer}>
                <div className={styles.quizHeader}>
                  <h1 className={styles.quizTitle}>
                    {quiz.course_title || 'Quiz'}
                  </h1>
                  <p className={styles.issuer}>By {quiz.issuer || 'Borderless Developers Programme'}</p>
                  <div className={styles.durationContainer}>
                    <svg className={styles.durationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className={styles.durationText}>{quiz.duration || '15 minutes'}</p>
                  </div>
                </div>
                <div className={styles.quizInfo}>
                  <h2 className={styles.quizInfoTitle}>Quiz Information</h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.iconContainer}>
                        <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className={styles.infoLabel}>Total Questions</p>
                        <p className={styles.infoValue}>{quiz.total_questions || quiz.questions.length}</p>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.iconContainer}>
                        <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className={styles.infoLabel}>Marks Per Question</p>
                        <p className={styles.infoValue}>{quiz.marks_per_question || 1}</p>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.iconContainer}>
                        <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className={styles.infoLabel}>Total Marks</p>
                        <p className={styles.infoValue}>{(quiz.marks_per_question || 1) * quiz.questions.length}</p>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.iconContainer}>
                        <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                      </div>
                      <div>
                        <p className={styles.infoLabel}>Purpose</p>
                        <p className={styles.infoValue} style={{ textTransform: 'capitalize' }}>{quiz.purpose || 'Course'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.startButtonContainer}>
                  {isConnected ? (
                    <>
                      {errorMessage && (
                        <p className={styles.errorMessage}>{errorMessage}</p>
                      )}
                      {quizAttempts >= 5 ? (
                        <div className={styles.attemptsLimitMessage}>
                          <p>You have reached the maximum number of quiz attempts (5). You cannot take this quiz again.</p>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={startQuiz}
                            className={`${styles.startButton} ${canStartQuiz ? '' : styles.startButtonDisabled}`}
                            disabled={!canStartQuiz}
                          >
                            Start Quiz
                          </button>
                          <p className={styles.startMessage}>
                            You have {quiz.duration || '15 minutes'} to complete this quiz. Good luck!
                          </p>
                          <p className={styles.attemptsInfo}>
                            Attempts used: {quizAttempts} / 5
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <p className={styles.errorMessage}>
                      Please connect your wallet to start the quiz.
                    </p>
                  )}
                </div>
              </div>
            ) : !showResult ? (
              <div className={styles.quizContainer}>
                <div className={styles.quizProgressHeader}>
                  <div className={styles.quizProgressTitleContainer}>
                    <h1 className={styles.quizProgressTitle}>
                      {quiz.course_title || 'Quiz'}
                    </h1>
                    <p className={styles.quizProgressIssuer}>By {quiz.issuer || 'Borderless Developers Programme'}</p>
                  </div>
                  <div className={styles.timerContainer}>
                    <svg className={styles.timerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className={`${styles.timerText} ${timeLeft < 60 ? styles.timerTextLow : ''}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressText}>
                    <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                    <span>{getProgressPercentage().toFixed(0)}% Complete</span>
                  </div>
                  <div className={styles.progressBarContainer}>
                    <div 
                      className={styles.progressBar}
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
                <div className={styles.questionContainer}>
                  <h2 className={styles.questionText}>
                    {quiz.questions[currentQuestion].question}
                  </h2>
                  <div className={styles.optionsList}>
                    {quiz.questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`${styles.option} ${selectedOption === option ? styles.optionSelected : ''}`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        <div className={`${styles.optionLetter} ${selectedOption === option ? styles.optionLetterSelected : ''}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={styles.optionText}>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.navigationContainer}>
                  <div className={styles.navigationText}>
                    {selectedOption ? 'Click Next to continue' : 'Select an answer to continue'}
                  </div>
                  <button
                    className={`${styles.nextButton} ${selectedOption ? styles.nextButtonEnabled : styles.nextButtonDisabled}`}
                    onClick={handleNext}
                    disabled={selectedOption === null}
                  >
                    {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.quizContainer}>
                {isAttestationSuccess && attestationUID ? (
                  <div className={styles.successContainer}>
                    {/* Add confetti elements for visual effect */}
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i}
                        className={styles.confetti}
                        style={{
                          left: `${Math.random() * 100}%`,
                          backgroundColor: ['#10B981', '#FBBF24', '#3B82F6', '#EC4899'][Math.floor(Math.random() * 4)],
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${3 + Math.random() * 4}s`
                        }}
                      />
                    ))}
                    <div className={styles.successIconContainer}>
                      <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h1 className={styles.successTitle}>Attestation Successful!</h1>
                    <p className={styles.resultMessage}>
                      Your quiz results have been successfully attested on the blockchain.
                    </p>
                    {errorMessage && (
                      <p className={styles.errorMessage}>
                        {errorMessage}
                      </p>
                    )}
                    <div className={styles.attestationId}>
                      {attestationUID}
                    </div>
                    <div className={styles.successButtons}>
                      <a
                        href={`https://arbitrum.easscan.org/attestation/view/${attestationUID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewButton}
                      >
                        <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Attestation
                      </a>
                      <button
                        onClick={postToX}
                        className={styles.postButton}
                      >
                        <svg className={styles.buttonIcon} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                        Post on X
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.resultContainer}>
                    <div className={styles.resultIconContainer}>
                      {getScorePercentage() >= 70 ? (
                        <svg className={styles.resultIconSuccess} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      ) : (
                        <svg className={styles.resultIconWarning} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      )}
                    </div>
                    <h1 className={styles.resultTitle}>Quiz Completed!</h1>
                    <div className={styles.scoreContainer}>
                      <h2 className={`${styles.scoreValue} ${getScoreColorClass()}`}>
                        {score}
                      </h2>
                      <span className={styles.scoreDivider}>/</span>
                      <span className={styles.scoreTotal}>
                        {(quiz.marks_per_question || 1) * quiz.questions.length}
                      </span>
                    </div>
                    <p className={styles.scorePercentage}>{getScorePercentage().toFixed(0)}% Score</p>
                    <div className={styles.scoreProgressBarContainer}>
                      <div 
                        className={`${styles.scoreProgressBar} ${getScoreProgressBarClass()}`}
                        style={{ width: `${getScorePercentage()}%` }}
                      ></div>
                    </div>
                    <p className={styles.resultMessage}>
                      {getScorePercentage() >= 70 
                        ? 'Great job! You have successfully completed the quiz.' 
                        : 'You can do better! Consider reviewing the material and trying again.'}
                    </p>
                    {attestationUID && (
                      <p className={styles.resultMessage}>
                        Attestation successful! UID: {attestationUID}
                      </p>
                    )}
                    {!isConnected && (
                      <p className={styles.resultMessage}>
                        Please connect your wallet to attest your results.
                      </p>
                    )}
                    {errorMessage && (
                      <p className={styles.errorMessage}>
                        {errorMessage}
                      </p>
                    )}
                  </div>
                )}
                <div className={styles.resultButtons}>
                  {isConnected && formattedWalletAddress && !isAttestationSuccess && (quiz.purpose?.toLowerCase() === 'course' ? (
                    <AttestGeneral
                      walletAddress={formattedWalletAddress}
                      score={score}
                      course={quiz.course_title || 'Quiz'}
                      issuer={quiz.issuer || 'Borderless Developers Programme'}
                      onAttestationSuccess={handleAttestationSuccess}
                    />
                  ) : quiz.purpose?.toLowerCase() === 'onboarding' ? (
                    <Attest
                      walletAddress={formattedWalletAddress}
                      score={score}
                      course={quiz.course_title || 'Quiz'}
                      issuer={quiz.issuer || 'Borderless Developers Programme'}
                      onAttestationSuccess={handleAttestationSuccess}
                    />
                  ) : (
                    <p className={styles.resultMessage}>No attestation available for this quiz purpose.</p>
                  ))}
                  {!isAttestationSuccess && canStartQuiz && (
                    <button 
                      onClick={() => { setCurrentQuestion(0); setAnswers([]); setShowResult(false); setScore(0); setQuizStarted(true); setAttestationUID(null); setIsAttestationSuccess(false); setErrorMessage(null); }}
                      className={styles.retryButton}
                    >
                      Retry Quiz
                    </button>
                  )}
                  <button 
                    onClick={() => router.push('/quiz')}
                    className={styles.backButton}
                  >
                    Back to Quizzes
                  </button>
                </div>
              </div>
            )}
          </WalletWrapper>
        </main>
      </div>
    </div>
  );
};

export default QuizPage;