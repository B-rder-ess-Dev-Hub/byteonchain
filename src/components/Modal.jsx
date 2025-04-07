import React from 'react';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }

    if (url.includes('embed')) {
      return url;
    }

    return url;
  };

  const embedUrl = getYoutubeEmbedUrl(videoUrl);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.videoWrapper}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoFrame}
            />
          ) : (
            <div className={styles.errorMessage}>
              Video URL not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
