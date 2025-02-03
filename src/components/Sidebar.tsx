import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Sidebar.module.css";
import avatar from "../../public/avatar.png";
import logo from "../../public/byte.png";

const Sidebar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const isActiveTab = (path: string) => {
    return router.pathname === path;
  };

  const tabs = [
    { path: "/", label: "Home" },
    { path: "/discovery", label: "Discovery" },
    { path: "/chat", label: "Chat" },
    { path: "/classroom", label: "Classroom" },
    { path: "/update", label: "Update" },
    { path: "/account", label: "Account" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          fetchUserData(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const fetchUserData = async (address: string) => {
    try {
      const response = await axios.get(`https://byteapi-two.vercel.app/api/user/${address}`);
      if (response.data.status === "success") {
        const { user } = response.data;
        setUser(user.fullname);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Redirect to account page if no user is found
        router.push('/account');
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        fetchUserData(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to proceed.");
    }
  };

  return (
    <div>
      <button
        className={`${styles.toggleButton} ${isSidebarOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? "×" : "☰"}
      </button>

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="Byte Logo"
            width={120}
            height={60}
          />
        </div>

        {tabs.map((tab) => (
          <Link href={tab.path} key={tab.label}>
            <div
              className={`${styles.tabItem} ${
                isActiveTab(tab.path) ? styles.activeTab : ""
              }`}
            >
              <img
                src={`/${tab.label.toLowerCase()}${
                  isActiveTab(tab.path) ? "active" : "inactive"
                }.png`}
                alt={`${tab.label} Icon`}
                className={`${styles.icon} ${
                  isActiveTab(tab.path) ? styles.activeDiscoveryIcon : ""
                }`}
              />
              <span
                className={`${styles.label} ${
                  isActiveTab(tab.path) ? styles.activeLabel : ""
                }`}
              >
                {tab.label}
              </span>
            </div>
          </Link>
        ))}

        <hr className={styles.dottedLine} />
        <div className={styles.userProfile}>
          <div className={styles.profileTop}>
            <div className={styles.avatarContainer}>
              <Image
                src={avatar}
                alt="User Avatar"
                width={40}
                height={40}
                className={styles.avatar}
              />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.username}>
                {user ? user : "Please join ByteonChain"}
              </span>
              <span className={styles.role}>
                {user ? "Student" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;