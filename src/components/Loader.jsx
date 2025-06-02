import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Loader.module.css';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const loaderRef = useRef(null);
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Start fade out when progress reaches 100%
    if (progress >= 100) {
      setFadeOut(true);
    }
    
    // Listen for beforeunload to show loader again on page refresh
    const handleBeforeUnload = () => {
      setFadeOut(false);
      setProgress(0);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [progress]);
  
  return (
    <>
     <div
      ref={loaderRef}
      className={`${styles.loaderContainer} ${fadeOut ? styles.fadeOut : ''}`}/>
      <div className={styles.logoContainer}>
        <img 
          src="/byte.png" 
          alt="ByteOnChain Logo" 
          className={styles.logo} 
        />
      </div>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
      <p className={styles.loadingText}>Loading ByteOnChain...</p>
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={styles.progressText}>{Math.round(progress)}%</p>
    
    </>   
  );
};

export default Loader;