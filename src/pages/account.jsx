import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Image from 'next/image';
import styles from '../styles/Account.module.css';

const Account = () => {
  return (
    <div className={styles.accountContainer}>
      {/* Header Component */}
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Sidebar and Main Content */}
      <div className={styles.contentWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          {/* Account Section */}
          <div className={styles.accountSection}>
            <div className={styles.accountHeader}>
              <h2 className={styles.accountTitle}>My Account</h2>
              <p className={styles.accountSubtitle}>Manage your profile and settings</p>
            </div>

            {/* Account Details */}
            <div className={styles.accountDetails}>
              <div className={styles.profilePictureContainer}>
                <Image
                  src="/avatar.png"  // Updated to use avatar.png
                  alt="Profile Picture" 
                  className={styles.profilePicture} 
                  width={120}
                  height={120}
                />
              </div>

              <div className={styles.accountInfo}>
                <h3 className={styles.userName}>John Doe</h3>
                <p className={styles.userEmail}>johndoe@example.com</p>
                <button className={styles.editProfileButton}>Edit Profile</button>
              </div>
            </div>

            {/* Stats Section */}
            <div className={styles.stats}>
              <h3 className={styles.statsTitle}>My Stats</h3>
              <ul className={styles.statsList}>
                <li className={styles.statItem}>
                  <span>Total Courses Taken</span>
                  <div className={styles.coursesContainer}>
                    <span className={styles.statValue}>15</span>
                    <button className={styles.viewButton}>View</button>
                  </div>
                </li>
                <li className={styles.statItem}>
                  <span>Certificates</span>
                  <div className={styles.certificatesContainer}>
                    <span className={styles.statValue}>8</span>
                    <button className={styles.viewButton}>View</button>
                  </div>
                </li>
              </ul>
            </div>

            {/* Settings Section */}
            <div className={styles.settings}>
              <h3 className={styles.settingsTitle}>Account Settings</h3>
              <ul className={styles.settingsList}>
                <li className={styles.settingItem}>
                  <span>Notification Settings</span>
                  <button className={styles.settingButton}>Edit</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
