import Sidebar from '../components/Sidebarcons';
import CustomCalendar from '../components/CustomCalendar';
import Recent from '../components/Recent';
import Tupdate from '../components/Tupdate';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import WalletWrapper from '../components/WalletWrapper';

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