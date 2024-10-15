// pages/index.js
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import BottomTab from '../components/BottomTab'; 
import CustomCalendar from '../components/CustomCalendar'; 
import Recent from '../components/Recent';
import Tupdate from '../components/Tupdate';
import Events from '../components/Events';
import styles from '../styles/Home.module.css';
import Image from 'next/image'; 
import userAvatar from '../../public/user-avater.png'; 
import notificationIcon from '../../public/notify.png'; 
import searchIcon from '../../public/search.png'; 
import React, { useState } from 'react';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date

  return (
    <div className={styles.container}>
      <Head>
        <title>ByteOnChain</title>
        <meta
          content=""
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Image src={userAvatar} alt="User Avatar" className={styles.avatar} />
          <div className={styles.connectButton}>
            <ConnectButton />
          </div>
        </div>
        <div className={styles.headerRight}>
          <Image src={notificationIcon} alt="Notifications" className={styles.icon} />
          <Image src={searchIcon} alt="Search" className={styles.icon} />
        </div>
      </header>

      <main >
        {/* Calendar Component */}
          <CustomCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <Recent />
          <Tupdate />
          <Events />


      </main>

      {/* Add BottomTab Component */}
      <BottomTab />
    </div>
  );
};

export default Home;
