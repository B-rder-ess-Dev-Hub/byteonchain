import React, { useState, useEffect } from "react";
import styles from "../styles/QuizPage.module.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import QuizModal from "../components/UNNquizmodal";

const Quiz = () => {
  const [userFullName, setUserFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [resetTimes, setResetTimes] = useState({});
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const checkAdmin = async (walletAddress) => {
    const adminWallets = ["0x6bd6109fb3bf59f67c86cab3bc09adb8b77485b7"];
    setIsAdmin(adminWallets.includes(walletAddress));
  };

  const fetchWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          checkAdmin(accounts[0]);
          fetchUserDetails(accounts[0]);
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    }
  };

  const fetchUserDetails = async (walletAddress) => {
    try {
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
      const data = await response.json();
      if (data && data.user) {
        setUserFullName(data.user.fullname);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const storedTimers = JSON.parse(localStorage.getItem("quizExpirationTimes")) || {
      "1": 0,
      "2": 7884000,
      "3": 7884000,
    };

    setQuizData([
      {
        id: 1,
        name: "Computer Appreciation",
        participants: 37,
        access: "Public",
        date: "2025-02-25",
        expiresIn: storedTimers["1"],
      },
      {
        id: 2,
        name: "BUK Web3 Onboarding",
        participants: 38,
        access: "Private",
        date: "2025-02-28",
        expiresIn: storedTimers["2"],
      },
      {
        id: 3,
        name: "B<>rder/ess UNN Hangout",
        participants: 0,
        access: "Public",
        date: "2025-02-21",
        expiresIn: storedTimers["3"],
      },
    ]);
  }, []);

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  const openQuizModal = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizModalOpen(true);
  };

  const closeQuizModal = () => {
    setQuizModalOpen(false);
    setSelectedQuiz(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setQuizData((prevQuizData) => {
        const updatedQuizData = prevQuizData.map((quiz) => ({
          ...quiz,
          expiresIn: quiz.expiresIn > 0 ? quiz.expiresIn - 1 : 0,
        }));

        const newTimers = Object.fromEntries(updatedQuizData.map((q) => [q.id, q.expiresIn]));
        localStorage.setItem("quizExpirationTimes", JSON.stringify(newTimers));

        return updatedQuizData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resetQuizTimer = (quizId) => {
    const newTime = resetTimes[quizId] || 3600;
    const storedTimers = JSON.parse(localStorage.getItem("quizExpirationTimes")) || {};
    storedTimers[quizId] = newTime;
    localStorage.setItem("quizExpirationTimes", JSON.stringify(storedTimers));

    setQuizData((prevQuizData) =>
      prevQuizData.map((quiz) => (quiz.id === quizId ? { ...quiz, expiresIn: newTime } : quiz))
    );
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Expired";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
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
            <h1 className={styles.bannerText}>Ready to test your knowledge?</h1>

            {isWalletConnected ? (
              <p className={styles.userName}>{userFullName || "Fetching name..."}</p>
            ) : (
              <p className={styles.userName}>
                Please connect your wallet to continue.{" "}
                <button className={styles.connectWalletButton} onClick={fetchWalletAddress}>
                  Connect Wallet
                </button>
              </p>
            )}

            <h1 className={styles.bannerText}>Select a course to begin your quiz journey!</h1>
          </div>

          <div className={styles.quizCardsContainer}>
            {quizData.map((quiz) => (
              <div key={quiz.id} className={styles.quizCard}>
                <h3>{quiz.name}</h3>

                <div className={styles.quizDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Participants:</span>
                    <span className={styles.detailValue}>👤 {quiz.participants}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Access:</span>
                    <span className={styles.detailValue}>{quiz.access}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span className={styles.detailValue}>{quiz.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time Left:</span>
                    <span className={styles.detailValue}>{formatTime(quiz.expiresIn)}</span>
                  </div>
                </div>

                <button
                  className={`${styles.actionButton} ${quiz.expiresIn > 0 ? styles.active : styles.inactive}`}
                  disabled={quiz.expiresIn <= 0}
                  onClick={() => openQuizModal(quiz)}
                >
                  {quiz.expiresIn > 0 ? "Take Quiz" : "Expired"}
                </button>

                {isAdmin && (
                  <div className={styles.resetContainer}>
                    <input
                      type="number"
                      placeholder="Seconds"
                      value={resetTimes[quiz.id] || ""}
                      onChange={(e) => setResetTimes({ ...resetTimes, [quiz.id]: e.target.value })}
                      className={styles.resetInput}
                    />
                    <button className={styles.resetButton} onClick={() => resetQuizTimer(quiz.id)}>
                      Reset Timer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {quizModalOpen && <QuizModal isOpen={quizModalOpen} onClose={closeQuizModal} quiz={selectedQuiz} />}
    </div>
  );
};

export default Quiz;