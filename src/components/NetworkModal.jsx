import React from 'react';
import Image from 'next/image';
import styles from '../styles/NetworkModal.module.css';
import arbitrumLogo from '../../public/arbitrum.png';
import ethereumLogo from '../../public/ethereum.png';
import polygonLogo from '../../public/polygon.webp';
import optimismLogo from '../../public/optimisim.png';

const NetworkModal = ({ isOpen, onNetworkSelect }) => {
  if (!isOpen) return null;

  const networks = [
    { id: 'arbitrum', name: 'Arbitrum', logo: arbitrumLogo, chainId: 42161, isActive: true },
    { id: 'ethereum', name: 'Ethereum', logo: ethereumLogo, chainId: 1, isActive: false },
    { id: 'polygon', name: 'Polygon', logo: polygonLogo, chainId: 137, isActive: false },
    { id: 'optimism', name: 'Optimism', logo: optimismLogo, chainId: 10, isActive: false }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Connect to a Network</h3>
        <p>Select a network to continue</p>
        <div className={styles.networkList}>
          {networks.map((network) => (
            <button
              key={network.id}
              className={`${styles.networkButton} ${!network.isActive ? styles.disabled : ''}`}
              onClick={() => network.isActive && onNetworkSelect(network)}
              disabled={!network.isActive}
            >
              <Image
                src={network.logo}
                alt={network.name}
                width={24}
                height={24}
                className={`${styles.networkLogo} ${!network.isActive ? styles.disabledLogo : ''}`}
              />
              <span>{network.name}</span>
              {!network.isActive && <span className={styles.comingSoon}>Coming Soon</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkModal;