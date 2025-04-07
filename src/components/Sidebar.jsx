import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const handleToggle = (event) => {
      if (event.detail && typeof event.detail.visible === 'boolean') {
        setIsVisible(event.detail.visible);
      } else {
        setIsVisible(prev => !prev);
      }
    };
    
    document.addEventListener('toggleSidebar', handleToggle);
    
    return () => {
      document.removeEventListener('toggleSidebar', handleToggle);
    };
  }, []);
  
  useEffect(() => {
    setIsVisible(false);
  }, [router.pathname]);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };
  
  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isVisible && (
        <div 
          className={styles.sidebarOverlay}
          onClick={() => setIsVisible(false)}
        />
      )}
      
      {/* Sidebar content */}
      <div className={`${styles.sidebar} ${isVisible ? styles.sidebarVisible : ''}`}>
        {/* Your sidebar content */}
      </div>
    </>
  );
};

export default Sidebar;