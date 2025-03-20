import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import styles from '../styles/Sidebar.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.pageContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;