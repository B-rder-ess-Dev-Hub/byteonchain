import React from 'react';
import styles from '../styles/Chat.module.css';
import Sidebar from '../components/Sidebar'; 

const Chat = () => {
  return (
    <div className={styles.chatContainer}>
      <Sidebar />
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h2 className={styles.title}>Feature Coming Soon</h2>
        </div>
      </div>
    </div>
  );
};

export default Chat;
