import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react'; // Import useState for toggle functionality
import styles from '../styles/Sidebar.module.css';
import avatar from '../../public/avatar.png';
import logo from '../../public/byte.png'; // Add logo import

const Sidebar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar visibility

  const isActiveTab = (path: string) => {
    return router.pathname === path;
  };

  const tabs = [
    { path: '/', label: 'Home' },
    { path: '/discovery', label: 'Discovery' }, // Discovery tab
    { path: '/chat', label: 'Chat' },
    { path: '/classroom', label: 'Classroom' },
    { path: '/update', label: 'Update' },
    { path: '/account', label: 'Account' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div>
      {/* Button to toggle sidebar */}
      <button
        className={`${styles.toggleButton} ${isSidebarOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? '×' : '☰'} {/* Change to "X" when open */}
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
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
                isActiveTab(tab.path) ? styles.activeTab : ''
              }`}
            >
              <img
                src={`/${tab.label.toLowerCase()}${
                  isActiveTab(tab.path) ? 'active' : 'inactive'
                }.png`}
                alt={`${tab.label} Icon`}
                className={`${styles.icon} ${isActiveTab(tab.path) ? styles.activeDiscoveryIcon : ''}`}
              />
              <span
                className={`${styles.label} ${
                  isActiveTab(tab.path) ? styles.activeLabel : ''
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
              <span className={styles.username}>John Doe</span>
              <span className={styles.role}>Student</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;