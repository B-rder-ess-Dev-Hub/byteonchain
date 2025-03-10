import React from 'react';
import styles from '../styles/Chat.module.css';
import Sidebar from '../components/Sidebar'; 
import WalletWrapper from '../components/WalletWrapper';

const ChatContent = () => {
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

const Chat= () => {
  return (
    <WalletWrapper>
      <ChatContent />
    </WalletWrapper>
  );
};

export default Chat;
