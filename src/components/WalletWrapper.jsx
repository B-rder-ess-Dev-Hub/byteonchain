import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NetworkModal from './NetworkModal';

const WalletWrapper = ({ children }) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState(null);

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
    if (isConnected && selectedChainId && currentChainId !== selectedChainId) {
      switchChain({ chainId: selectedChainId });
    }
  }, [isConnected, currentChainId, selectedChainId, switchChain]);

  useEffect(() => {
    if (!isConnected) {
      setShowNetworkModal(true);
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <NetworkModal
        isOpen={true}
        onNetworkSelect={handleNetworkSelect}
      />
    );
  }

  return <>{children}</>;
};

export default WalletWrapper;