import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/Classroom.module.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import eyeIcon from "../../public/eye-icon.png";

const Quiz = () => {
  const [visibleCourses, setVisibleCourses] = useState(4);
  const [videoToWatch, setVideoToWatch] = useState(null);
  const [userFullName, setUserFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Function to fetch the user's connected wallet address
  const fetchWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          fetchUserDetails(accounts[0]); // Fetch user details
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    } else {
      console.error("MetaMask or a Web3 wallet is not installed.");
    }
  };

  // Function to fetch user details from the backend using the wallet address
  const fetchUserDetails = async (walletAddress) => {
    try {
      const response = await fetch(
        `https://byteapi-two.vercel.app/api/user/${walletAddress}`
      );
      const data = await response.json();

      if (data && data.user) {
        setUserFullName(data.user.fullname);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch wallet address on component mount
  useEffect(() => {
    fetchWalletAddress();
  }, []);

  return (
    <div className={styles.classroomContainer}>
      {/* Header Component */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          {/* Banner */}
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

            <h1 className={styles.bannerText}>
              Select a course to begin your quiz journey!
            </h1>
          </div>

          {/* Search Field */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search for a quiz..."
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;