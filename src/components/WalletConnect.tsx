'use client'

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletConnect() {
  const { 
    wallet, 
    wallets,
    connected, 
    connecting, 
    disconnecting
  } = useWallet();
  
  const [showDownloadInstructions, setShowDownloadInstructions] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {!connected ? (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Connect Your Wallet
        </h2>
      ) : (
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Wallet Connected
        </h2>
      )}
      
      {wallets.length > 0 ? (
        <>
          {!connected && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Connect your Solana wallet to send transactions directly from this app
            </p>
          )}
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-medium" />
        </>
      ) : (
        <div className="w-full max-w-md">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
            No Solana wallets detected. Install a wallet to continue.
          </p>
          
          <div 
            onClick={() => setShowDownloadInstructions(!showDownloadInstructions)}
            className={`transition-all duration-300 ease-in-out bg-gray-50 hover:bg-gray-100  rounded-lg ${
              showDownloadInstructions ? ' p-4 border border-gray-200 dark:border-gray-600' : 'py-2 px-4 '
            }`}
          >
            {!showDownloadInstructions ? (
              <span className="text-sm font-medium text-center">Install a wallet</span>
            ) : (
              <>
                <div className="flex justify-center items-center mb-4">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hide wallets
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">P</span>
                      </div>
                      <div className="mt-0.5">
                        <div className="font-medium text-gray-800 dark:text-white leading-tight mb-1 m-0 text-left">Phantom</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 leading-tight m-0 text-left">Most popular Solana wallet</div>
                      </div>
                    </div>
                    <a
                      href="https://phantom.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Install
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">S</span>
                      </div>
                      <div className="mt-0.5">
                        <div className="font-medium text-gray-800 dark:text-white leading-tight mb-1 m-0 text-left">Solflare</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 leading-tight m-0 text-left">Feature-rich wallet</div>
                      </div>
                    </div>
                    <a
                      href="https://solflare.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Install
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-bold text-sm">B</span>
                      </div>
                      <div className="mt-0.5">
                        <div className="font-medium text-gray-800 dark:text-white leading-tight mb-1 m-0 text-left">Backpack</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 leading-tight m-0 text-left">Modern crypto wallet</div>
                      </div>
                    </div>
                    <a
                      href="https://backpack.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Install
                    </a>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> After installing a wallet, refresh this page to detect it automatically.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {connecting && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            Connecting to {wallet?.adapter?.name}...
          </p>
        </div>
      )}

      {disconnecting && (
        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            Disconnecting...
          </p>
        </div>
      )}
    </div>
  );
}