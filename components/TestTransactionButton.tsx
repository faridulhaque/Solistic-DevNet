"use client";
import React from "react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

interface PhantomWallet {
    solana: {
      isPhantom: boolean;
      publicKey: PublicKey;
      connect(): Promise<{ publicKey: PublicKey }>;
      signTransaction(transaction: Transaction): Promise<Transaction>;
      signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
      disconnect(): Promise<void>;
    };
  }
  

const TestTransactionButton = ({ walletAddress }) => {
    const handleTestTransaction = async () => {
        try {
          const phantom = window.phantom as unknown as PhantomWallet;
      
          if (!phantom?.solana?.isPhantom) {
            alert("Phantom wallet not found. Please install the extension.");
            return;
          }
      
          // Ensure the user is connected
          const response = await phantom.solana.connect();
          const walletAddress = response.publicKey.toString();
      
          // Establish a connection
          const connection = new Connection("https://api.devnet.solana.com", "confirmed");
          const { blockhash } = await connection.getLatestBlockhash("finalized");
      
          // Create a transaction
          const transaction = new Transaction({
            recentBlockhash: blockhash,
            feePayer: new PublicKey(walletAddress),
          }).add(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(walletAddress),
              toPubkey: new PublicKey("8oV3tufwBGts6Bu6Agh9Tqm6xeZUEeD6UrwBcAFFuY1k"),
              lamports: 0.001 * 1_000_000_000,
            })
          );
      
          // Sign the transaction
          const signedTransaction = await phantom.solana.signTransaction(transaction);
      
          // Send the transaction
          const signature = await connection.sendRawTransaction(signedTransaction.serialize());
          console.log("Transaction sent with signature:", signature);
      
          // Confirm the transaction
          await connection.confirmTransaction(signature, "confirmed");
          alert(`Transaction successful! Signature: ${signature}`);
        } catch (error) {
          console.error("Transaction failed:", error);
          alert("Transaction failed. Check console for details.");
        }
      };
      

  return (
    <button
      className="px-4 py-2 bg-green-600 text-white rounded shadow-lg"
      onClick={handleTestTransaction}
    >
      Test Transaction
    </button>
  );
};

export default TestTransactionButton;
