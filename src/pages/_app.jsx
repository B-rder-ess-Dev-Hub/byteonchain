import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ToastProvider } from '../components/ToastNotification';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from '../components/Loader';

import { config } from "../wagmi";

const client = new QueryClient();

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initial load delay to ensure basic resources are loaded
    const initialTimer = setTimeout(() => {
      setLoading(false);
      // Add a small delay before hiding the loader completely for smooth transition
      setTimeout(() => setShowLoader(false), 500);
    }, 2000);
    
    // Handle route change events
    const handleStart = () => {
      setLoading(true);
      setShowLoader(true);
    };
    
    const handleComplete = () => {
      setLoading(false);
      // Add a small delay before hiding the loader completely for smooth transition
      setTimeout(() => setShowLoader(false), 500);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Check if the document is fully loaded
    if (document.readyState === 'complete') {
      handleComplete();
    } else {
      window.addEventListener('load', handleComplete);
      return () => window.removeEventListener('load', handleComplete);
    }

    return () => {
      clearTimeout(initialTimer);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider modalSize="compact">
          <ToastProvider>
            {showLoader && <Loader />}
            <div style={{ display: loading ? 'none' : 'block', opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
              <Component {...pageProps} />
            </div>
          </ToastProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
