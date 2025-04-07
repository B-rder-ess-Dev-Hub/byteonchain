import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from './AdminSidebar';
import styles from '../styles/AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!token && router.pathname !== '/login') {
      router.push('/login');
    } else {
      setIsAuthenticated(token ? true : false);
      setIsLoading(false);
    }
  }, [router]);

  if (router.pathname === '/login' || isLoading) {
    return <>{children}</>;
  }


  if (!isAuthenticated && router.pathname !== '/login') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.adminContent}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;