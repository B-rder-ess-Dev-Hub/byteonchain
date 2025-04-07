import React from 'react';
import styles from '../styles/Chat.module.css';
import Sidebar from '../components/Sidebarcons'; 
import WalletWrapper from '../components/WalletWrapper';
import Header from '../components/Header';

const ChatContent = () => {
  return (
    <div className={styles.chatContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.chatInterface}>
            <div className={styles.chatSidebar}>
              <div className={styles.searchContainer}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="text" placeholder="Search messages" className={styles.searchInput} />
              </div>
              
              <div className={styles.chatList}>
                {[1, 2, 3].map((item) => (
                  <div key={item} className={`${styles.chatPreview} ${styles.shimmer}`}>
                    <div className={styles.avatarShimmer}></div>
                    <div className={styles.previewContent}>
                      <div className={styles.nameShimmer}></div>
                      <div className={styles.messageShimmer}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.chatMain}>
              <div className={styles.emptyState}>
                <div className={styles.iconContainer}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className={styles.title}>Chat Feature Coming Soon</h2>
                <p className={styles.subtitle}>We're working on something amazing for you</p>
                <div className={styles.featureList}>
                  <div className={styles.featureItem}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Real-time messaging</span>
                  </div>
                  <div className={styles.featureItem}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>File sharing</span>
                  </div>
                  <div className={styles.featureItem}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Group conversations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  return (
    <WalletWrapper>
      <ChatContent />
    </WalletWrapper>
  );
};

export default Chat;
