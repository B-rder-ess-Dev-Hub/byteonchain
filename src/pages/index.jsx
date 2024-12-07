// pages/index.js
import Sidebar from '../components/Sidebar';
import CustomCalendar from '../components/CustomCalendar';
import Recent from '../components/Recent';
import Tupdate from '../components/Tupdate';
import Events from '../components/Events';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
// import React, { useState } from 'react';

const Home = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date());

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
          <div className={styles.calendar}>
            <CustomCalendar />
            <Events />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
