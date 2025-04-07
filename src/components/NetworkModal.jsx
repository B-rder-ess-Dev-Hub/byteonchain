import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/NetworkModal.module.css';
import arbitrumLogo from '../../public/arbitrum.png';
import optimismLogo from '../../public/optimisim.png';
import celoLogo from '../../public/celo.png';
import baseLogo from '../../public/base.svg';

const NetworkModal = ({ isOpen, onNetworkSelect }) => {
  const [switchingNetwork, setSwitchingNetwork] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const networks = [
    { 
      id: 'arbitrum',
      name: 'Arbitrum',
      logo: arbitrumLogo,
      chainId: 42161,
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorerUrl: 'https://arbiscan.io',
      isActive: true
    },
    { 
      id: 'base',
      name: 'Base',
      logo: baseLogo,
      chainId: 8453,
      rpcUrl: 'https://mainnet.base.org',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorerUrl: 'https://basescan.org',
      isActive: true 
    },
    { 
      id: 'optimism',
      name: 'Optimism',
      logo: optimismLogo,
      chainId: 10,
      rpcUrl: 'https://mainnet.optimism.io',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorerUrl: 'https://optimistic.etherscan.io',
      isActive: true 
    },
    { 
      id: 'celo',
      name: 'Celo',
      chainId: 42220,
      logo: celoLogo,
      rpcUrl: 'https://forno.celo.org',
      nativeCurrency: {
        name: 'Celo',
        symbol: 'CELO',
        decimals: 18
      },
      blockExplorerUrl: 'https://explorer.celo.org',
      isActive: true
    },
  ];

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet detected. Please install MetaMask or another web3 wallet.");
      }
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please connect your wallet.");
      }
      
      setIsConnecting(false);
      return accounts[0];
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message);
      setIsConnecting(false);
      return null;
    }
  };

  const switchNetwork = async (network) => {
    try {
      setSwitchingNetwork(network.id);
      setError(null);
      
      const account = await connectWallet();
      if (!account) {
        throw new Error("Failed to connect wallet. Please try again.");
      }
      
      const params = {
        chainId: `0x${network.chainId.toString(16)}`, 
        chainName: network.name,
        nativeCurrency: network.nativeCurrency,
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: [network.blockExplorerUrl]
      };

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: params.chainId }],
        });
      } catch (switchError) {
       
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          });
        } else {
          throw switchError;
        }
      }

      onNetworkSelect(network);
      setSwitchingNetwork(null);
    } catch (error) {
      console.error("Error switching network:", error);
      setError(error.message);
      setSwitchingNetwork(null);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Connect to a Network</h3>
        <p>Select a network to continue</p>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.networkList}>
          {networks.map((network) => (
            <button
              key={network.id}
              className={`${styles.networkButton} ${!network.isActive ? styles.disabled : ''} ${switchingNetwork === network.id ? styles.switching : ''}`}
              onClick={() => network.isActive && switchNetwork(network)}
              disabled={!network.isActive || switchingNetwork !== null || isConnecting}
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
              {switchingNetwork === network.id && <span className={styles.switchingIndicator}>Switching...</span>}
            </button>
          ))}
        </div>
        
        {isConnecting && (
          <div className={styles.connectingIndicator}>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Connecting wallet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkModal;