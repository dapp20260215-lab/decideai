import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { bsc, bscTestnet, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_PROJECT_ID || '669a14b62190bce494c6d16da3317011'

// Helper to safely get origin in sandboxed iframes
const getSafeOrigin = () => {
  if (typeof window === 'undefined') return 'https://mlbg.qintianjian.fun';
  try {
    // Try multiple ways to get the origin, avoiding direct Location access if possible
    return window.origin || window.location.origin || document.location.origin || (document.baseURI ? new URL(document.baseURI).origin : 'https://mlbg.qintianjian.fun');
  } catch (e) {
    return 'https://mlbg.qintianjian.fun';
  }
};

const safeOrigin = getSafeOrigin();

// 2. Create wagmiConfig
const metadata = {
  name: 'Qin Tian Jian Web4.0',
  description: 'Decentralized Cycle Prediction on BNB Chain',
  url: safeOrigin,
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: safeOrigin,
    universal: safeOrigin
  }
}

const chains = [bsc, bscTestnet, mainnet] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})

// 3. Create modal with safety wrapper
try {
  if (typeof window !== 'undefined') {
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      enableAnalytics: false,
      enableOnramp: true,
      themeMode: 'dark',
      allWallets: 'SHOW', // 确保显示所有钱包选项
      featuredWalletIds: [
        'c53331997368603a539d82339d0506d11413ef14d5a62e909c950a905d032f20', // MetaMask
        '4622a2b2d6ad1dc655824861763a473813b8658c99351c556e8b69b258637114', // Trust Wallet
      ],
      themeVariables: {
        '--w3m-accent': '#f27d26',
        '--w3m-border-radius-master': '12px',
        '--w3m-z-index': 9999,
        '--w3m-font-family': 'Inter, sans-serif'
      }
    })
  }
} catch (error) {
  console.warn('Web3Modal initialization failed:', error)
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
