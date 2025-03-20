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

  // Wait for page to fully load before checking wallet connection
  useEffect(() => {
    const handleLoad = () => {
      setPageLoaded(true);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      setPageLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
      
      // Also set a backup timer in case the load event doesn't fire
      const backupTimer = setTimeout(() => {
        setPageLoaded(true);
      }, 2000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(backupTimer);
      };
    }
  }, []);

  // Initial connection check - runs only after page is loaded
  useEffect(() => {
    if (pageLoaded && !initialCheckDone) {
      // Set checking state first
      setConnectionState('checking');
      setShowStatusModal(true);
      
      // Give wallet providers time to initialize
      setTimeout(() => {
        if (isConnected) {
          // Already connected - show success
          setConnectionState('connected');
        } else {
          // Not connected - transition to network modal
          setConnectionState('disconnected');
          setShowStatusModal(false);
          setShowNetworkModal(true);
        }
        setInitialCheckDone(true);
      }, 1500); // Allow time for wallet state to stabilize
    }
  }, [isConnected, initialCheckDone, pageLoaded]);
  
  // Handle connection changes after initial check
  useEffect(() => {
    if (initialCheckDone) {
      if (isConnected && connectionState !== 'connected') {
        // User just connected
        setConnectionState('connected');
        setShowNetworkModal(false);
        setShowStatusModal(true);
      } else if (!isConnected && connectionState !== 'disconnected') {
        // User just disconnected
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