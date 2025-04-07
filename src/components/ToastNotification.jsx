import React, { createContext, useContext, useState, useEffect } from 'react';
import styles from '../styles/Toast.module.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration = 3000) => addToast(message, 'success', duration);
  const error = (message, duration = 3000) => addToast(message, 'error', duration);
  const info = (message, duration = 3000) => addToast(message, 'info', duration);
  const warning = (message, duration = 3000) => addToast(message, 'warning', duration);

  const confirm = (message, onConfirm, onCancel) => {
    const id = Date.now();
    const confirmToast = {
      id,
      message,
      type: 'confirm',
      duration: 0, 
      onConfirm: () => {
        onConfirm?.();
        removeToast(id);
      },
      onCancel: () => {
        onCancel?.();
        removeToast(id);
      }
    };
    setToasts(prev => [...prev, confirmToast]);
    return id;
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning, confirm, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ toast, removeToast }) => {
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
      
      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  if (toast.type === 'confirm') {
    return (
      <div className={`${styles.toast} ${styles.confirmToast}`}>
        <div className={styles.toastContent}>
          <div className={styles.toastMessage}>{toast.message}</div>
          <div className={styles.toastActions}>
            <button 
              className={styles.toastCancel}
              onClick={toast.onCancel}
            >
              Cancel
            </button>
            <button 
              className={styles.toastConfirm}
              onClick={toast.onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div className={styles.toastIcon}>{getIcon()}</div>
      <div className={styles.toastMessage}>{toast.message}</div>
      <button 
        className={styles.toastClose}
        onClick={() => removeToast(toast.id)}
      >
        ×
      </button>
    </div>
  );
};

