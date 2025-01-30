import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios"; // Import axios for API calls
import styles from "../styles/Sidebar.module.css";
import avatar from "../../public/avatar.png";
import logo from "../../public/byte.png"; // Add logo import

const Sidebar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility
  const [user, setUser] = useState<string | null>(null); // State to store user fullname
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // State to store wallet address

  const isActiveTab = (path: string) => {
    return router.pathname === path;
  };

  const tabs = [
    { path: "/", label: "Home" },
    { path: "/discovery", label: "Discovery" }, // Discovery tab
    { path: "/chat", label: "Chat" },
    { path: "/classroom", label: "Classroom" },
    { path: "/quiz", label: "Quiz" },
    { path: "/update", label: "Update" },
    { path: "/account", label: "Account" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  // Fetch user data when the component mounts or wallet address changes
  useEffect(() => {
    checkWalletConnection(); // Check wallet connection on mount

    if (walletAddress) {
      fetchUserData(walletAddress); // Fetch user data if wallet address is available
    }
  }, [walletAddress]);

  // Function to connect to wallet and get the address
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        // Check if the wallet address exists in the database
        fetchUserData(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to proceed.");
    }
  };

  // Function to check if the wallet is already connected
  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // Check if the wallet address exists in the database
          fetchUserData(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  // Fetch user data based on wallet address
  const fetchUserData = async (address: string) => {
    try {
      const response = await axios.get(
        `https://byteapi-two.vercel.app/api/user/${address}`
      );
      if (response.data.status === "success") {
        const { user } = response.data;
        setUser(user.fullname); // Set only the fullname
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div>
      {/* Button to toggle sidebar */}
      <button
        className={`${styles.toggleButton} ${isSidebarOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? "×" : "☰"} {/* Change to "X" when open */}
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        {/* Logo at the top */}
        <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="Byte Logo"
            width={120} // Adjust the width as needed
            height={60} // Increased height for the logo
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
              {/* Show user fullname if available, otherwise show default text */}
              <span className={styles.username}>
                {user ? user : "Please join ByteonChain"}
              </span>
              <span className={styles.role}>
                {user ? "Student" : ""}{" "}
                {/* You can customize the role based on your data */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
