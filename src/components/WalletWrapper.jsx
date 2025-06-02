import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NetworkModal from './NetworkModal';

const WalletWrapper = ({ children }) => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const handleNetworkSelect = async (network) => {
    try {
      setSelectedChainId(network.chainId);
      if (currentChainId !== network.chainId) {
        await switchChain({ chainId: network.chainId });
      }
      if (openConnectModal) {
        openConnectModal();
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  useEffect(() => {
    const handleLoad = () => {
      setPageLoaded(true);
    };

    if (document.readyState === 'complete') {
      setPageLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
      
      const backupTimer = setTimeout(() => {
        setPageLoaded(true);
      }, 2000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(backupTimer);
      };
    }
  }, []);

  useEffect(() => {
    if (pageLoaded && !initialCheckDone) {
      setTimeout(() => {
        if (!isConnected) {
          // Detect Trust Wallet and Backpack Wallet
          const isTrustWallet = window.trustwallet && window.trustwallet.isTrustWallet;
          const isBackpackWallet = window.backpack && window.backpack.isBackpack;
          setShowNetworkModal(true);
        }
        setInitialCheckDone(true);
      }, 500); 
    }
  }, [isConnected, initialCheckDone, pageLoaded]);

  useEffect(() => {
    if (initialCheckDone) {
      if (isConnected) {
        setShowNetworkModal(false);
      } else {
        // Detect Trust Wallet and Backpack Wallet on disconnection
        const isTrustWallet = window.trustwallet && window.trustwallet.isTrustWallet;
        const isBackpackWallet = window.backpack && window.backpack.isBackpack;
        setShowNetworkModal(true);
      }
    }
  }, [isConnected, initialCheckDone]);

  return (
    <>
      {children}
      
      {/* Network Modal - only show if not connected */}
      {showNetworkModal && !isConnected && (
        <NetworkModal
          isOpen={true}
          onNetworkSelect={handleNetworkSelect}
          onClose={() => setShowNetworkModal(false)}
          supportedWallets={['Trust Wallet', 'Backpack Wallet', 'MetaMask']} 
        />
      )}
    </>
  );
};

export default WalletWrapper;