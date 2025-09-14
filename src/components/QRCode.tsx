import React, { useState } from "react";

interface QRCodeProps {
    walletAddress: string;
}

export default function QRCode({walletAddress}: QRCodeProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            
        }
    };
    return (
        <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Send tokens to this address
            </h2>
            <img
                src="/wallet.png"
                alt="Payment QR Code"
                className="w-48 h-48 mb-6 rounded-lg border border-gray-200 dark:border-gray-600"
            />
            <button 
                onClick={handleCopyAddress}
                className={`cursor-pointer p-3  bg-gray-50 dark:bg-gray-700 rounded-lg border w-full max-w-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-100 ${
                    isCopied ? 'border-green-500 shadow-md shadow-green-200 dark:shadow-green-800' : 'border-gray-200 dark:border-gray-600'
                }`}
                title="Click to copy address"
                aria-label="Copy wallet address to clipboard"
            >
                <p className={`text-xs font-mono break-all text-center ${
                    isCopied ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'
                }`}>
                    {isCopied ? 'Copied!' : walletAddress}
                </p>
            </button>
        </div>
    );
}