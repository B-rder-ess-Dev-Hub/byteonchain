import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useChainId, useSwitchChain } from 'wagmi';
import DisconnectModal from './DisconnectModal';
import NetworkModal from './NetworkModal';

const Header = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const handleWalletClick = () => {
    if (isConnected) {
      setShowDisconnectModal(true);
    } else {
      setShowNetworkModal(true);
    }
  };

  const handleNetworkSelect = async (network) => {
    setShowNetworkModal(false);
    try {
      await switchChain({ chainId: network.chainId });
      if (openConnectModal) {
        openConnectModal();
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDisconnectModal(false);
  };

  return (
    <>
      <Head>
        <title>ByteOnChain</title>
        <meta name="description" content="Your description here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className={styles.iconWrapper}>
            <svg className={styles.icon} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H15C17.2091 16 19 14.2091 19 12V8C19 5.79086 17.2091 4 15 4H9C6.79086 4 5 5.79086 5 8V12C5 13.1046 5.42143 14.1295 6.10001 14.9M9 16L6.10001 18.9C5.89435 19.1057 5.99457 19.5 6.26287 19.5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className={styles.iconWrapper}>
            <svg className={styles.icon} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.notificationBadge}></span>
          </div>

          <button className={styles.connectButton} onClick={handleWalletClick}>
            <svg className={styles.walletIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z" fill="currentColor"/>
              <path d="M2 9H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isConnected ? (
              <span>
                {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>
      </header>

      <DisconnectModal 
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={handleDisconnect}
      />

      <NetworkModal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onNetworkSelect={handleNetworkSelect}
      />
    </>
  );
};

export default Header;