import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/DisconnectModal.module.css';

const DisconnectModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  // Use createPortal to render the modal at the document body level
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Disconnect Wallet</h3>
        <p>Are you sure you want to disconnect your wallet?</p>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body // This ensures the modal is rendered directly in the body
  );
};

export default DisconnectModal;