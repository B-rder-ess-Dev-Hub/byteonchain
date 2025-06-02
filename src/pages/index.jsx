import Sidebar from '../components/Sidebarcons';
import CustomCalendar from '../components/CustomCalendar';
import Recent from '../components/Recent';
import Tupdate from '../components/Tupdate';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import WalletWrapper from '../components/WalletWrapper';
import CipherSessionModal from '../components/CipherSessionModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
              
              {/* July Cipher Session Signup Banner */}
              <div className={styles.cipherSessionBanner}>
                <div className={styles.shimmer}></div>
                <h2>July Cipher Session</h2>
                
                <button 
                  className={styles.cipherSessionButton}
                  onClick={openModal}
                >
                  Register Now
                </button>
              </div>
              
              <Tupdate />
            </div>
            <div className={styles.calendarSection}>
              <CustomCalendar />
            </div>
          </div>
        </div>
      </div>
      
      {/* Cipher Session Modal */}
      <CipherSessionModal isOpen={isModalOpen} onClose={closeModal} />
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