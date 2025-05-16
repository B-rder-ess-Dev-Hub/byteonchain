import React, { useState, useEffect } from "react";
import styles from "../styles/QuizPage.module.css";
import Sidebar from "../components/Sidebarcons";
import Header from "../components/Header";
import WalletWrapper from '../components/WalletWrapper';
import { fetchData } from '../../utils/api'; 
import { useRouter } from 'next/router';

export const config = {
  unstable_runtimeJS: true
};

export async function getStaticProps() {
  return {
    props: {}
  };
}

const Icons = {
  quiz: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  institution: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21H21M3 18H21M5 18V10M19 18V10M12 3L22 10H2L12 3ZM9 14H15V18H9V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  timer: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  question: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.22766 9C8.77678 7.83481 10.2584 7 12.0001 7C14.2092 7 16.0001 8.34315 16.0001 10C16.0001 11.3994 14.7224 12.5751 12.9943 12.9066C12.4519 13.0106 12.0001 13.4477 12.0001 14M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  participants: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rocket: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 17L3 22L8 20.5M4.5 17L9.5 20.5M4.5 17C4.5 17 7 13.5 9.5 10.5M9.5 20.5L15 16M9.5 10.5C12.5 7 16 4.5 16 4.5M9.5 10.5L9 15M16 4.5L20.5 9.5M16 4.5C16 4.5 19 2 21 2C22 2 22 2 22 3C22 5 19.5 8 19.5 8M20.5 9.5L16 15M20.5 9.5C20.5 9.5 22 12 22 14C22 16 20 16 20 16L15 16M16 15L15 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 11V17.4C19 18.8359 19 19.5544 18.7275 20.1111C18.4878 20.6001 18.1001 20.9878 17.6111 21.2275C17.0544 21.5 16.3359 21.5 14.9 21.5H6.1C4.66406 21.5 3.94609 21.5 3.38938 21.2275C2.9004 20.9878 2.51273 20.6001 2.27252 20.1111C2 19.5544 2 18.8359 2 17.4V6.6C2 5.16406 2 4.44609 2.27252 3.88938C2.51273 3.4004 2.9004 3.01273 3.38938 2.77252C3.94609 2.5 4.66406 2.5 6.1 2.5H14.9C16.3359 2.5 17.0544 2.5 17.6111 2.77252C18.1001 3.01273 18.4878 3.4004 18.7275 3.88938C19 4.44609 19 5.16406 19 6.6V8M19 11H17.5C16.1193 11 15 12.1193 15 13.5C15 14.8807 16.1193 16 17.5 16H19M19 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  target: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

const QuizContent = () => {
  const [userFullName, setUserFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [quizzes, setQuizzes] = useState([]); 
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
      const data = await fetchData(`/api/user/${walletAddress}`);
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
      const data = await fetchData('/api/quizzes/');
      
      
      if (data && Array.isArray(data)) {
        setQuizzes(data);
      } else if (data && Array.isArray(data.quizzes)) {
        setQuizzes(data.quizzes);
      } else if (data && typeof data === 'object') {
      
        console.log("Data structure:", Object.keys(data)); 
        const quizzesArray = data.quizzes || data.data || [];
        setQuizzes(Array.isArray(quizzesArray) ? quizzesArray : []);
      } else {
        setQuizzes([]);
        console.error("Unexpected quiz data format:", data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]); 
    } finally {
      setLoading(false);
    }
  };

  const sortedQuizzes = Array.isArray(quizzes) ? [...quizzes].sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;
    return 0;
  }) : [];

  return (
    <div className={styles.quizPage}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper} style={{ position: 'relative', zIndex: 10 }}>
          <Sidebar />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.banner}>
            <div className={styles.bannerContent}>
              <div className={styles.bannerHeader}>
                <div className={styles.bannerIcon}>{Icons.rocket}</div>
                <h1 className={styles.bannerTitle}>Ready to test your knowledge?</h1>
              </div>

              {isWalletConnected ? (
                <div className={styles.userInfoCard}>
                  <div className={styles.userIconWrapper}>{Icons.user}</div>
                  <p className={styles.userName}>{userFullName || "Fetching name..."}</p>
                </div>
              ) : (
                <div className={styles.connectWalletCard}>
                  <p className={styles.connectWalletText}>
                    Please connect your wallet to continue
                  </p>
                  <button className={styles.connectWalletButton} onClick={fetchWalletAddress}>
                    <span className={styles.walletIconWrapper}>{Icons.wallet}</span>
                    <span>Connect Wallet</span>
                  </button>
                </div>
              )}

              <div className={styles.bannerFooter}>
                <div className={styles.targetIconWrapper}>{Icons.target}</div>
                <h2 className={styles.bannerSubtitle}>Select a quiz to begin!</h2>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className={styles.noQuizzesContainer}>
              <div className={styles.noQuizzesIcon}>{Icons.question}</div>
              <p className={styles.noQuizzesText}>No quizzes available at the moment.</p>
            </div>
          ) : (
            <div className={styles.quizCardsContainer}>
              {sortedQuizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuizCard = ({ quiz }) => {
  const [participants, setParticipants] = useState("Loading...");
  const router = useRouter();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const encodedTitle = encodeURIComponent(quiz.course_title);
        const data = await fetchData(`/api/course-completion?course_name=${encodedTitle}`);
        setParticipants(data.total_completed.toString());
      } catch (error) {
        console.error("Error fetching participants:", error);
        setParticipants("N/A");
      }
    };

    fetchParticipants();
  }, [quiz.course_title]);

  const navigateToQuiz = (e) => {
    e.stopPropagation();
    if (!quiz.course_title) {
      console.error('Quiz course_title is undefined:', quiz);
      return;
    }
    router.push(`/quiz/${encodeURIComponent(quiz.course_title)}`);
  };

  return (
    <div className={styles.quizCard}>
      <div className={styles.quizCardHeader}>
        <div className={styles.quizIconWrapper}>
          {Icons.quiz}
        </div>
        <h3 className={styles.quizTitle}>{quiz.course_title}</h3>
      </div>

      <div className={styles.quizDetails}>
        <div className={styles.detailItem}>
          <div className={styles.detailIcon}>
            {Icons.institution}
          </div>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Issuer</span>
            <span className={styles.detailValue}>{quiz.issuer}</span>
          </div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailIcon}>
            {Icons.timer}
          </div>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Duration</span>
            <span className={styles.detailValue}>{quiz.duration} min</span>
          </div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailIcon}>
            {Icons.question}
          </div>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Questions</span>
            <span className={styles.detailValue}>{quiz.total_questions}</span>
          </div>
        </div>
        
        <div className={styles.detailItem}>
          <div className={styles.detailIcon}>
            {Icons.participants}
          </div>
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Participants</span>
            <span className={styles.detailValue}>{participants}</span>
          </div>
        </div>
      </div>

      <button
        className={`${styles.actionButton} ${quiz.status === "active" ? styles.active : styles.inactive}`}
        disabled={quiz.status !== "active"}
        onClick={navigateToQuiz}
      >
        {quiz.status === "active" ? "Start Quiz" : "Expired"}
      </button>
    </div>
  );
};

export default function Quiz() {
  return (
    <WalletWrapper>
      <QuizContent />
    </WalletWrapper>
  );
}