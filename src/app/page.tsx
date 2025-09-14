'use client'

import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnect from '../components/WalletConnect';
import PaymentForm from '../components/PaymentForm';
import QRCode from "../components/QRCode";
import { useEffect, useState } from "react";

export default function Home() {
  const walletAddress = '4d5h8TgGHdoewTsarbDZkQJ1zccZtn3s7cGkQQMWnEcy';
  const { connected } = useWallet();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Send SOL
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Send me tokens on the Solana blockchain
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {!connected ? (
            <div className="text-center space-y-6">
              <WalletConnect />

              <div className="flex items-center justify-center space-x-4">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-full">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <QRCode walletAddress={walletAddress} />
            </div>
          ) : (
            <div className="space-y-8">
              <WalletConnect />
              <PaymentForm recipientAddress={walletAddress} />
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Running on Solana Devnet</p>
        </div>
      </div>
    </div>
  );
}
