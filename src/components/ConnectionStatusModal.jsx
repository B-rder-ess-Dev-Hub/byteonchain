import React, { useEffect, useState } from 'react';
import styles from '../styles/ConnectionStatusModal.module.css';

const ConnectionStatusModal = ({ isConnected, address, isChecking, connectionState, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    // Animate progress bar for connected state - complete in 1.5 seconds
    if (connectionState === 'connected') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setAnimationComplete(true);
            return 100;
          }
          return prev + 6.67; // Complete in ~1.5 seconds (100/15)
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [connectionState]);

  // Only trigger onClose after animation completes
  useEffect(() => {
    if (animationComplete && connectionState === 'connected') {
      const closeTimer = setTimeout(() => {
        onClose();
      }, 300); // Small delay after completion
      
      return () => clearTimeout(closeTimer);
    }
  }, [animationComplete, connectionState, onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {connectionState === 'checking' || isChecking ? (
          <>
            <div className={styles.loadingIcon}>
              <div className={styles.spinner}></div>
            </div>
            <h3>Checking Wallet Connection</h3>
            <p className={styles.message}>Please wait while we verify your wallet connection...</p>
          </>
        ) : connectionState === 'connected' ? (
          <>
            <div className={styles.successIconWrapper}>
              <div className={styles.successIcon}>✓</div>
              <div className={styles.successRipple}></div>
            </div>
            <h3>Wallet Connected!</h3>
            <div className={styles.addressContainer}>
              <div className={styles.addressDot}></div>
              <p className={styles.address}>{address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}</p>
            </div>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${progress}%` }}
              ></div>
              <div className={styles.progressIndicator} style={{ left: `${progress}%` }}></div>
            </div>
            <p className={styles.message}>
              <span className={styles.emoji}>🚀</span> You're all set to explore ByteOnChain
            </p>
            <div className={styles.decorationCircle1}></div>
            <div className={styles.decorationCircle2}></div>
          </>
        ) : (
          <>
            <div className={styles.warningIcon}>!</div>
            <h3>Wallet Not Connected</h3>
            <p className={styles.message}>Please connect your wallet to continue.</p>
            <button className={styles.connectButton} onClick={onClose}>
              Connect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatusModal;