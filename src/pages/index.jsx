import Sidebar from '../components/Sidebarcons';
import CustomCalendar from '../components/CustomCalendar';
import Recent from '../components/Recent';
import Tupdate from '../components/Tupdate';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import WalletWrapper from '../components/WalletWrapper';
import { useState } from 'react';

export const config = {
  unstable_runtimeJS: true
};

export async function getStaticProps() {
  return {
    props: {}
  };
}

const HomeContent = () => {

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.sidebarContainer}>
            <Sidebar />
          </div>
          <div className={styles.content}>
            <div className={styles.middleSection}>
              <Recent />
              
              {/* July Cipher Session Registration Closed Banner */}
              <div className={styles.cipherSessionClosedBanner}>
                <div className={styles.shimmer}></div>
                <div className={styles.closedIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 16l-4-4-4 4"/>
                    <path d="M8 8l4 4 4-4"/>
                  </svg>
                </div>
                <h2>Registration Closed</h2>
                <p>Thank you for your interest in the July Cipher Session. Registration has now ended. We'll keep you updated via our social media page about future sessions and opportunities.</p>
              
              </div>
              
              <Tupdate />
            </div>
            <div className={styles.calendarSection}>
              <CustomCalendar />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const Home = () => {
  return (
    <WalletWrapper>
      <HomeContent />
    </WalletWrapper>
  );
};

export default Home;