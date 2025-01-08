import Sidebar from '../components/Sidebar';
import CustomCalendar from '../components/CustomCalendar';
import Recent from '../components/Recent';
import Tupdate from '../components/Tupdate';
import Events from '../components/Events';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import { useAccount, useConnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Home = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <div className={styles.middleSection}>
            <Recent />
            <Tupdate />
          </div>
          <div className={styles.calendarSection}>
            <CustomCalendar />
          </div>
        </div>
      </div>
      
      {!isConnected && (
        <div className={styles.walletOverlay}>
          <div className={styles.walletContent}>
            <h3>Connect Your Wallet</h3>
            <p>Please connect your wallet to access the platform</p>
            <button 
              className={styles.connectWalletButton}
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;