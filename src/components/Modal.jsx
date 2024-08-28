import React from 'react';
import styles from '../styles/Modal.module.css'; // Create this CSS file for modal styles

const Modal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Video Player"
        ></iframe>
      </div>
    </div>
  );
};

export default Modal;
