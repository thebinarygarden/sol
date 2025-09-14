'use client'

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { createSolanaClient, lamportsToSol } from 'gill';
import type { Address } from '@solana/kit';
import { sendSolTransactionWithBlockhash } from '@/lib/transaction';

interface PaymentFormProps {
  recipientAddress: string;
}

export default function PaymentForm({ recipientAddress }: PaymentFormProps) {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const { connection } = useConnection();

  const { rpc } = createSolanaClient({
    urlOrMoniker: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'devnet',
  });

  const { data: balance, isLoading: balanceLoading, isError: balanceError } = useQuery({
    queryKey: ['balance', publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) return null;
      const result = await rpc.getBalance(publicKey.toBase58() as Address).send();
      return result.value;
    },
    enabled: !!publicKey && connected,
    refetchInterval: 10000,
  });

  const { data: latestBlockhash, isLoading: blockhashLoading, isError: blockhashError } = useQuery({
    queryKey: ['latestBlockhash'],
    queryFn: async () => {
      const result = await rpc.getLatestBlockhash().send();
      return result.value;
    },
    refetchInterval: 5000,
  });
  
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | ''>('');
  const [transactionSignature, setTransactionSignature] = useState('');
  const [confirmationStatus, setConfirmationStatus] = useState<'sending' | 'confirming' | 'confirmed' | 'failed' | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSendTransaction = async () => {
    if (!connected || !publicKey) {
      setMessage('Please connect your wallet first');
      setMessageType('error');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount');
      setMessageType('error');
      return;
    }

    if (!latestBlockhash) {
      setMessage('Unable to fetch latest blockhash. Please try again.');
      setMessageType('error');
      return;
    }

    // Check if user has sufficient balance
    const amountSol = parseFloat(amount);
    const currentBalance = balance ? Number(lamportsToSol(balance)) : 0;
    
    if (currentBalance < amountSol) {
      setMessage(`Insufficient balance. You need ${amountSol.toFixed(6)} SOL.`);
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setConfirmationStatus('sending');
    setMessage('Sending transaction...');
    setMessageType('info');
    setTransactionSignature('');

    try {
      const result = await sendSolTransactionWithBlockhash({
        wallet,
        connection,
        recipientAddress,
        amountSol,
        latestBlockhash,
      });

      if (result.success && result.signature) {
        setTransactionSignature(result.signature);
        setConfirmationStatus('confirmed');
        setMessage('Transaction confirmed!!');
        setMessageType('success');
        setAmount(''); // Clear the amount field
      } else {
        setConfirmationStatus('failed');
        setMessage(result.error || 'Transaction failed');
        setMessageType('error');
      }
    } catch {
      setConfirmationStatus('failed');
      setMessage('Transaction failed. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Send SOL
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          From Address
        </label>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
          <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
            {connected && publicKey ? publicKey.toBase58() : 'Wallet not connected'}
          </p>
          {connected && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Balance:</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {balanceLoading ? (
                    'Loading...'
                  ) : balanceError ? (
                    'Error loading balance'
                  ) : balance !== undefined && balance !== null ? (
                    `${Number(lamportsToSol(balance)).toFixed(6)} SOL`
                  ) : (
                    'No balance data'
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          To Address
        </label>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
          <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
            {recipientAddress}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount (SOL)
        </label>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.0"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={!connected}
        />
      </div>


      <button
        onClick={handleSendTransaction}
        disabled={
          !connected || 
          !amount || 
          parseFloat(amount) <= 0 || 
          isLoading || 
          balanceLoading || 
          blockhashLoading ||
          !latestBlockhash ||
          (balance ? Number(lamportsToSol(balance)) < parseFloat(amount || '0') : true)
        }
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          'Sending Transaction...'
        ) : balanceLoading ? (
          'Loading Balance...'
        ) : blockhashLoading ? (
          'Loading Network Data...'
        ) : (
          'Send SOL'
        )}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
            : messageType === 'info'
            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              {confirmationStatus === 'sending' && (
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              )}
              {confirmationStatus === 'confirming' && (
                <div className="animate-pulse w-4 h-4 bg-blue-500 rounded-full"></div>
              )}
              {confirmationStatus === 'confirmed' && (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              {confirmationStatus === 'failed' && (
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-1 bg-white rounded"></div>
                </div>
              )}
            </div>
            <p className="text-sm">{message}</p>
          </div>
          
          {transactionSignature && (
            <div className={`mt-2 pt-2 border-t ${
              messageType === 'success' 
                ? 'border-green-200 dark:border-green-600'
                : messageType === 'info'
                ? 'border-blue-200 dark:border-blue-600'
                : 'border-red-200 dark:border-red-600'
            }`}>
              <p className={`text-xs ${
                messageType === 'success' 
                  ? 'text-green-700 dark:text-green-300'
                  : messageType === 'info'
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>Transaction Signature:</p>
              <a 
                href={`https://explorer.solana.com/tx/${transactionSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-mono hover:underline break-all ${
                  messageType === 'success' 
                    ? 'text-green-600 dark:text-green-400'
                    : messageType === 'info'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {transactionSignature}
              </a>
            </div>
          )}
        </div>
      )}

      {connected && (balanceError || blockhashError) && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
          <p className="text-sm text-red-800 dark:text-red-200">
            {balanceError && 'Unable to load balance. '}
            {blockhashError && 'Network connection issues. '}
            Please check your connection and try again.
          </p>
        </div>
      )}

      {!connected && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Connect your wallet to send SOL payments
          </p>
        </div>
      )}

      {connected && amount && parseFloat(amount) > 0 && balance && (
        Number(lamportsToSol(balance)) < parseFloat(amount)
      ) && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            Insufficient balance. You have {Number(lamportsToSol(balance)).toFixed(6)} SOL but need {parseFloat(amount).toFixed(6)} SOL.
          </p>
        </div>
      )}
    </div>
  );
}