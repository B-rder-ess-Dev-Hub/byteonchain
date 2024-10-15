import React from 'react';
import styles from '../styles/Chat.module.css'
import BottomTab from '../components/BottomTab'; 


const Chat = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.banner}>
       
        <h2 className={styles.title}>Feature Coming Soon</h2>
      </div>
      <BottomTab />
    </div>
  );
};

export default Chat;
