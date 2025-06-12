'use client';

import { createConfig, http } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  trustWallet,
  rabbyWallet,
  imTokenWallet,
  oktoWallet,
  bitgetWallet,
  bybitWallet,
  phantomWallet,
  walletConnectWallet,
  injectedWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  celo,
  sepolia,
  holesky,
} from 'wagmi/chains';

// Define the project ID for WalletConnect
const projectId = '0a37ba86d44f44b153e1624cdf82a31b';

// Define the supported chains
const chains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  celo,
  holesky,
  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
] as const;

// Create wallet connectors
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [
        rainbowWallet,
        metaMaskWallet,
        coinbaseWallet,
        trustWallet,
        rabbyWallet,
        imTokenWallet,
        oktoWallet,
        bitgetWallet,
        bybitWallet,
        phantomWallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  { appName: 'Byteonchain', projectId }
);

// Create Wagmi config
export const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [celo.id]: http(),
    [sepolia.id]: http(),
    [holesky.id]: http()
  },
  ssr: true,
});