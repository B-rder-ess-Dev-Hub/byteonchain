import React, { useState, useEffect } from "react";
import styles from "../styles/QuizPage.module.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import QuizUNNModal from "../components/UNNquizmodal";
import QuizBUKModal from "../components/Bukquizmodal";

const Quiz = () => {
  const [userFullName, setUserFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [quizStates, setQuizStates] = useState({});
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizType, setQuizType] = useState(null); // Track which modal to show
<<<<<<< HEAD
  const [participants, setParticipants] = useState({}); // Stores total participants for each quiz
=======
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
>>>>>>> f5e2fa468e5b1e1e7bce3dc1c6b2d2427739aa23

  // Fetch user's connected wallet address
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
      const response = await fetch(`https://byteapi-two.vercel.app/api/user/${walletAddress}`);
      const data = await response.json();
      if (data && data.user) {
        setUserFullName(data.user.fullname);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchParticipants = async (courseNames, quizId) => {
    try {
      let totalParticipants = 0;

      for (const courseName of courseNames) {
        const response = await fetch(
          `https://byteapi-two.vercel.app/api/course-completion?course_name=${encodeURIComponent(courseName)}`
        );
        const data = await response.json();

        if (data && typeof data.total_completed === "number") {
          totalParticipants += data.total_completed;
        }
      }

      setParticipants((prev) => ({ ...prev, [quizId]: totalParticipants }));
    } catch (error) {
      console.error(`Error fetching participants for ${courseNames.join(", ")}:`, error);
      setParticipants((prev) => ({ ...prev, [quizId]: 0 }));
    }
  };

  useEffect(() => {
    // **Manually Set Quiz States Here** (true = active, false = expired)
    const manualQuizStates = {
      "1": false,
      "2": true,
      "3": true,
    };

    setQuizStates(manualQuizStates);

    const quizzes = [
      {
        id: 1,
        name: "Computer Appreciation",
        participants: 0, // Will be fetched dynamically
        access: "Public",
        date: "2025-02-25",
        courseNames: ["Fundamentals of Computer Literacy"], // Single course
      },
      {
        id: 2,
        name: "BUK Web3 Onboarding",
        participants: 0,
        access: "Public",
        date: "2025-02-28",
        courseNames: ["Web3 Configuration - BUK", "BUK Onboarding Quiz"], // Sum of 2 courses
      },
      {
        id: 3,
        name: "B<>rder/ess UNN Hangout",
        participants: 0,
        access: "Public",
        date: "2025-02-21",
        courseNames: ["B<>rder/ess UNN Hangout"], // Single course
      },
    ];

    setQuizData(quizzes);

    // Fetch participant count for each quiz
    quizzes.forEach((quiz) => fetchParticipants(quiz.courseNames, quiz.id));

    // **Solution 1: Polling every 30 seconds**
    const interval = setInterval(() => {
      quizzes.forEach((quiz) => fetchParticipants(quiz.courseNames, quiz.id));
    }, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  const openQuizModal = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizModalOpen(true);

    // Determine which modal to show based on quiz.id
    if (quiz.id === 2) {
      setQuizType("buk");
    } else if (quiz.id === 3) {
      setQuizType("unn");
    }
  };

  const closeQuizModal = () => {
    setQuizModalOpen(false);
    setSelectedQuiz(null);
    setQuizType(null);

    // **Solution 2: Refresh Data After Quiz Completion**
    quizData.forEach((quiz) => fetchParticipants(quiz.courseNames, quiz.id));
  };

  // Filter quizzes based on search query
  const filteredQuizzes = quizData.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

            <h1 className={styles.bannerText}>Select a quiz to begin😌!</h1>
          </div>

          {/* Search Field */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search for a quiz..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quiz Cards */}
          <div className={styles.quizCardsContainer}>
<<<<<<< HEAD
            {quizData.map((quiz) => (
              <div key={quiz.id} className={styles.quizCard}>
                <h3 style={{ textAlign: "center" }}>{quiz.name}</h3>

                <div className={styles.quizDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Participants:</span>
                    <span className={styles.detailValue}>👤 {participants[quiz.id] ?? "Loading..."}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Access:</span>
                    <span className={styles.detailValue}>{quiz.access}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span className={styles.detailValue}>{quiz.date}</span>
=======
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
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
>>>>>>> f5e2fa468e5b1e1e7bce3dc1c6b2d2427739aa23
                  </div>

                  <button
                    className={`${styles.actionButton} ${quizStates[quiz.id] ? styles.active : styles.inactive}`}
                    disabled={!quizStates[quiz.id]}
                    onClick={() => openQuizModal(quiz)}
                  >
                    {quizStates[quiz.id] ? "Take Quiz" : "Expired"}
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.noResults}>No quizzes found for "{searchQuery}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Conditionally Render Modals Based on Quiz Type */}
      {quizModalOpen && quizType === "buk" && (
        <QuizBUKModal isOpen={quizModalOpen} onClose={closeQuizModal} quiz={selectedQuiz} />
      )}

      {quizModalOpen && quizType === "unn" && (
        <QuizUNNModal isOpen={quizModalOpen} onClose={closeQuizModal} quiz={selectedQuiz} />
      )}
    </div>
  );
};

export default Quiz;
