import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/AdminLogin.module.css';
import { toast } from 'react-toastify';
import { postData } from '../../utils/api'; 

export const config = {
  unstable_runtimeJS: true
};

export async function getStaticProps() {
  return {
    props: {}
  };
}

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await postData('/api/admin/signin', { username, password });
      
      localStorage.setItem('adminToken', data.token);
      
      if (data.admin && data.admin.email) {
        localStorage.setItem('adminEmail', data.admin.email);
      }
      
      if (data.admin && data.admin.username) {
        localStorage.setItem('adminUsername', data.admin.username);
      } else {
        localStorage.setItem('adminUsername', username);
      }
      
      router.push('/dashboard');
      
      if (isMounted) {
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
      
      if (isMounted) {
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <Image 
            src="/byte.png" 
            alt="ByteOnChain Logo" 
            width={150} 
            height={100} 
            priority
          />
        </div>
        
        <h1 className={styles.loginTitle}>Admin Login</h1>
        <p className={styles.loginSubtitle}>Enter your credentials to access the admin dashboard</p>
        
        {errorMessage && (
          <div className={styles.errorBanner}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 6.66667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 13.3333H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.buttonLoader}>
                <span className={styles.spinnerDot}></span>
                <span className={styles.spinnerDot}></span>
                <span className={styles.spinnerDot}></span>
              </div>
            ) : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;