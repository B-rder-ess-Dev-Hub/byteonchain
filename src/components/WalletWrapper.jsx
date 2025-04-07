import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NetworkModal from './NetworkModal';
import ConnectionStatusModal from './ConnectionStatusModal';

const WalletWrapper = ({ children }) => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [connectionState, setConnectionState] = useState('initial');
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
      setConnectionState('checking');
      setShowStatusModal(true);
      
      setTimeout(() => {
        if (isConnected) {
          setConnectionState('connected');
        } else {
          setConnectionState('disconnected');
          setShowStatusModal(false);
          setShowNetworkModal(true);
        }
        setInitialCheckDone(true);
      }, 1500); 
    }
  }, [isConnected, initialCheckDone, pageLoaded]);
  
  useEffect(() => {
    if (initialCheckDone) {
      if (isConnected && connectionState !== 'connected') {
        setConnectionState('connected');
        setShowNetworkModal(false);
        setShowStatusModal(true);
      } else if (!isConnected && connectionState !== 'disconnected') {
        setConnectionState('disconnected');
        setShowStatusModal(false);
        setShowNetworkModal(true);
      }
    }
  }, [isConnected, connectionState, initialCheckDone]);

  return (
    <>
      {children}
      
      {/* Connection Status Modal - shows checking or success state */}
      {showStatusModal && (
        <ConnectionStatusModal 
          isConnected={isConnected}
          address={address}
          isChecking={connectionState === 'checking'}
          connectionState={connectionState}
          onClose={() => {
            setShowStatusModal(false);
            if (!isConnected) {
              setShowNetworkModal(true);
            }
          }}
        />
      )}
      
      {/* Network Modal - only show if not connected */}
      {showNetworkModal && !isConnected && !showStatusModal && (
        <NetworkModal
          isOpen={true}
          onNetworkSelect={handleNetworkSelect}
          onClose={() => setShowNetworkModal(false)}
        />
      )}
    </>
  );
};

export default WalletWrapper;