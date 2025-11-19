'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { Toaster } from 'sonner';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Configure network (mainnet-beta for production)
  const network = WalletAdapterNetwork.Mainnet;

  // Use custom RPC if provided, otherwise use public endpoint
  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(network);
  }, [network]);

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#0a0a0a',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: '#fff',
              },
            }}
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
