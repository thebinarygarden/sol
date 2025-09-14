import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export interface SendSolWithBlockhashParams {
  wallet: WalletContextState;
  connection: Connection;
  recipientAddress: string;
  amountSol: number;
  latestBlockhash: {
    blockhash: string;
    lastValidBlockHeight: bigint;
  };
}

export async function sendSolTransactionWithBlockhash({
  wallet,
  connection,
  recipientAddress,
  amountSol,
  latestBlockhash,
}: SendSolWithBlockhashParams): Promise<TransactionResult> {
  try {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      throw new Error('Wallet not connected');
    }

    if (amountSol <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const amountLamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

    let recipientPublicKey: PublicKey;
    try {
      recipientPublicKey = new PublicKey(recipientAddress);
    } catch {
      throw new Error('Invalid recipient address');
    }

    
    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amountLamports,
      })
    );
    
    const signature = await wallet.sendTransaction(transaction, connection);

    
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: Number(latestBlockhash.lastValidBlockHeight)
    }, 'confirmed');

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    return {
      success: true,
      signature
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
