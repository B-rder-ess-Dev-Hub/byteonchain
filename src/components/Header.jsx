import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import messageIcon from '../../public/topmessage.png';
import notificationIcon from '../../public/notify.png';
import searchIcon from '../../public/search.png';
import walletIcon from '../../public/wallet-3.png';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import DisconnectModal from './DisconnectModal';

const Header = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const handleWalletClick = () => {
    if (isConnected) {
      setShowDisconnectModal(true);
    } else if (openConnectModal) {
      openConnectModal();
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
            <Image src={searchIcon} alt="Search" className={styles.searchIcon} />
          </div>

          <div className={styles.iconWrapper}>
            <Image src={messageIcon} alt="Messages" className={styles.icon} />
          </div>

          <div className={styles.iconWrapper}>
            <Image
              src={notificationIcon}
              alt="Notifications"
              className={styles.icon}
            />
          </div>

          <button className={styles.connectButton} onClick={handleWalletClick}>
            <Image
              src={walletIcon}
              alt="Wallet"
              className={styles.walletIcon}
              width={20}
              height={20}
            />
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
    </>
  );
};

export default Header;