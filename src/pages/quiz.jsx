import React, { useState, useEffect } from "react";
import styles from "../styles/QuizPage.module.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import QuizModal from "../components/quizmodal";

const API_BASE_URL = "https://byteapi-two.vercel.app/api";

const Quiz = () => {
  const [userFullName, setUserFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletAddress();
    fetchQuizzes();
  }, []);

  const fetchWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          fetchUserDetails(accounts[0]);
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    }
  };

  const fetchUserDetails = async (walletAddress) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${walletAddress}`);
      const data = await response.json();
      if (data && data.user) {
        setUserFullName(data.user.fullname);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/quizzes/`);
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const openQuizModal = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizModalOpen(true);
  };

  const closeQuizModal = () => {
    setQuizModalOpen(false);
    setSelectedQuiz(null);
  };

  return (
    <div className={styles.quizPage}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.banner}>
            <h1 className={styles.bannerText}>🚀 Ready to test your knowledge? 🎓</h1>

            {isWalletConnected ? (
              <p className={styles.userName}>👤 {userFullName || "Fetching name..."}</p>
            ) : (
              <p className={styles.userName}>
                Please connect your wallet to continue.{" "}
                <button className={styles.connectWalletButton} onClick={fetchWalletAddress}>
                  🔌 Connect Wallet
                </button>
              </p>
            )}

            <h1 className={styles.bannerText}>🎯 Select a quiz to begin! 🎉</h1>
          </div>

          {/* Show Loading Indicator */}
          {loading ? (
            <p className={styles.loadingText}>⏳ Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p className={styles.noQuizzesText}>😔 No quizzes available at the moment.</p>
          ) : (
            <div className={styles.quizCardsContainer}>
              {quizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} openQuizModal={openQuizModal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Render Generic Quiz Modal Dynamically */}
      {quizModalOpen && selectedQuiz && (
        <QuizModal isOpen={quizModalOpen} onClose={closeQuizModal} quiz={selectedQuiz} />
      )}
    </div>
  );
};

const QuizCard = ({ quiz, openQuizModal }) => {
  const [participants, setParticipants] = useState("Loading...");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        let totalParticipants = 0;

        if (quiz.course_title === "Web3 Configuration - BUK") {
          // Fetch both "Web3 Configuration - BUK" and "BUK Onboarding Quiz"
          const [configResponse, onboardingResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/course-completion?course_name=${encodeURIComponent("Web3 Configuration - BUK")}`),
            fetch(`${API_BASE_URL}/course-completion?course_name=${encodeURIComponent("BUK Onboarding Quiz")}`)
          ]);

          const configData = await configResponse.json();
          const onboardingData = await onboardingResponse.json();

          // Ensure both values are numbers and sum them
          const configCount = parseInt(configData?.total_completed, 10) || 0;
          const onboardingCount = parseInt(onboardingData?.total_completed, 10) || 0;

          totalParticipants = configCount + onboardingCount;
        } else {
          // Fetch participants for a single course
          const response = await fetch(
            `${API_BASE_URL}/course-completion?course_name=${encodeURIComponent(quiz.course_title)}`
          );
          const data = await response.json();
          totalParticipants = parseInt(data?.total_completed, 10) || 0;
        }

        console.log(`📌 Participants for ${quiz.course_title}:`, totalParticipants);

        // 🔥 Use functional state update to prevent overwriting
        setParticipants(totalParticipants);
      } catch (error) {
        console.error(`❌ Error fetching participants for ${quiz.course_title}:`, error);
        setParticipants("N/A");
      }
    };

    fetchParticipants();
  }, [quiz.course_title]);

  return (
    <div className={styles.quizCard}>
      <h3 className={styles.quizTitle}>📚 {quiz.course_title}</h3>

      <div className={styles.quizDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Issuer: 🏛️</span>
          <span className={styles.detailValue}>{quiz.issuer}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Duration: ⏱️</span>
          <span className={styles.detailValue}>{quiz.duration}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Total Questions: ❓</span>
          <span className={styles.detailValue}>{quiz.total_questions}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Participants: 👥</span>
          <span className={styles.detailValue}>{participants}</span>
        </div>
      </div>

      <button
        className={`${styles.actionButton} ${quiz.status === "active" ? styles.active : styles.inactive}`}
        disabled={quiz.status !== "active"}
        onClick={() => openQuizModal(quiz)}
      >
        {quiz.status === "active" ? "🎯 Take Quiz" : "❌ Expired"}
      </button>
    </div>
  );
};

export default Quiz;