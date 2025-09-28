'use client'

import React, {useMemo} from 'react';
import {ConnectionProvider, WalletProvider,} from '@solana/wallet-adapter-react';
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 30000,
      queryFn: async ({ queryKey }) => {
        throw new Error(`No queryFn found for query: ${queryKey}`);
      },
    },
  },
});

interface WalletContextProviderProps {
  children: React.ReactNode;
}

export default function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
  }, []);

  const wallets = useMemo(() => [], []);


  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}