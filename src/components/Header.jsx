import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit'; 
import styles from '../styles/Home.module.css';
import messageIcon from '../../public/topmessage.png';
import notificationIcon from '../../public/notify.png';
import searchIcon from '../../public/search.png';
import walletIcon from '../../public/wallet-3.png';

const Header = () => {
  return (
    <>
      <Head>
        <title>ByteOnChain</title>
        <meta name="description" content="Your description here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        {/* Right Section */}
        <div className={styles.headerRight}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
            <Image src={searchIcon} alt="Search" className={styles.searchIcon} />
          </div>

          {/* Message Icon */}
          <div className={styles.iconWrapper}>
            <Image src={messageIcon} alt="Messages" className={styles.icon} />
          </div>

          {/* Notification Icon */}
          <div className={styles.iconWrapper}>
            <Image
              src={notificationIcon}
              alt="Notifications"
              className={styles.icon}
            />
          </div>

          {/* Wallet Connect Button */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {!connected ? (
                    <button
                      className={styles.connectButton}
                      onClick={openConnectModal}
                    >
                      <Image
                        src={walletIcon}
                        alt="Wallet"
                        className={styles.walletIcon}
                      />
                      Connect Wallet
                    </button>
                  ) : (
                    <button
                      className={styles.connectButton}
                      onClick={openAccountModal}
                    >
                      <Image
                        src={walletIcon}
                        alt="Wallet"
                        className={styles.walletIcon}
                      />
                      {account.displayName}
                    </button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </header>
    </>
  );
};

export default Header;