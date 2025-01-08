import React from 'react';
import styles from '../styles/NewsModal.module.css';

const NewsModal = ({ isOpen, onClose, newsUrl }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.iframeWrapper}>
          <iframe
            src={newsUrl}
            title="News Content"
            className={styles.iframe}
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

export default NewsModal; 