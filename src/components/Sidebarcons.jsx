import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchData } from '../../utils/api';
import styles from "../styles/Sidebar.module.css";
import avatar from "../../public/avatar.png";
import logo from "../../public/byte.png";
import { motion } from "framer-motion";

const icons = {
  home: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  discovery: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chat: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  classroom: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14l9-5-9-5-9 5 9 5z" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14v10" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  update: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  quiz: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  schema: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  account: (active) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke={active ? "#FBBF24" : "#4B5563"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const Sidebar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [activeTab, setActiveTab] = useState("/");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActiveTab(router.pathname);
  }, [router.pathname]);

  const tabs = [
    { path: "/", label: "Home", icon: "home" },
    { path: "/discovery", label: "Discovery", icon: "discovery" },
    { path: "/chat", label: "Chat", icon: "chat" },
    { path: "/classroom", label: "Classroom", icon: "classroom" },
    { path: "/update", label: "Update", icon: "update" },
    { path: "/quiz", label: "Quiz", icon: "quiz" },
    { path: "/schema", label: "Schema", icon: "schema" },
    { path: "/account", label: "Account", icon: "account" },
    { path: "/create", label: "Create", icon: "account" },
    { path: "/mint", label: "Mint", icon: "account" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isClient) {
      checkWalletConnection();
      
      const handleClickOutside = (event) => {
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('sidebar-toggle');
        
        if (sidebar && 
            !sidebar.contains(event.target) && 
            toggleButton && 
            !toggleButton.contains(event.target) &&
            isSidebarOpen && 
            window.innerWidth < 768) {
          setIsSidebarOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSidebarOpen, isClient]);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
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

  const fetchUserData = async (address) => {
    try {
     
      const response = await fetchData(`/api/user/${address}`);
      if (response.status === "success") {
        const { user } = response;
        setUser(user.fullname);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        router.push('/account');
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
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

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const tabVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <>
      <button
        id="sidebar-toggle"
        className={`${styles.toggleButton} ${isSidebarOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={styles.menuIcon}
        >
          {isSidebarOpen ? (
            <path 
              d="M18 6L6 18M6 6l12 12" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          ) : (
            <>
              <path 
                d="M4 6h16M4 12h16M4 18h16" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
      </button>

      {/* Add overlay for mobile */}
      {isClient && (
        <div 
          className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.visible : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <motion.div 
        id="sidebar"
        className={styles.sidebar}
        initial="closed"
        animate={isSidebarOpen || (isClient && window.innerWidth > 768) ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="Byte Logo"
            width={100}
            height={60}
            className={styles.logo}
          />
        </div>

        <div className={styles.navigationContainer}>
          {tabs.map((tab) => (
            <Link href={tab.path} key={tab.label} passHref>
              <motion.div
                className={`${styles.tabItem} ${activeTab === tab.path ? styles.activeTab : ""}`}
                whileHover="hover"
                whileTap="tap"
                variants={tabVariants}
                onClick={() => {
                  setActiveTab(tab.path);
                  if (isClient && window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
              >
                <div className={styles.iconContainer}>
                  {/* Replace background image with SVG icon */}
                  {icons[tab.icon](activeTab === tab.path)}
                </div>
                <span className={styles.label}>{tab.label}</span>
                {activeTab === tab.path && <div className={styles.activeIndicator} />}
              </motion.div>
            </Link>
          ))}
        </div>

        <div className={styles.userProfileContainer}>
          <div className={styles.userProfile}>
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
              {user && (
                <span className={styles.walletAddress}>
                  {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : ""}
                </span>
              )}
            </div>
            {!user && (
              <button className={styles.connectButton} onClick={connectWallet}>
                Connect
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;