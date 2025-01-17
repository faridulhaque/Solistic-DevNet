"use client";
import React from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

const TestSolflareTransactionButton = ({ walletAddress }) => {
  const handleTestTransaction = async () => {
    if (!window.solflare || !window.solflare.publicKey) {
      alert("Solflare wallet not connected. Please connect your wallet first.");
      return;
    }

    try {
      // Create a connection to the Solana network
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      // Prefilled transaction details
      const sender = new PublicKey(walletAddress); // Sender's address
      const recipient = new PublicKey(
        "7bFThsCMEzCUQ78hDPWPkZ3JqWEKyKG7dyvKSe76BZEW"
      ); // Replace with the actual recipient's address
      const lamports = 1000000; // 0.001 SOL (in lamports)

      // Create a transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: recipient,
          lamports,
        })
      );

      // Get the latest blockhash to ensure the transaction is valid
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = sender;

      // Request the wallet to sign the transaction

      const signedTransaction = (await window.solana.signTransaction(
        transaction
      )) as Transaction;

      // Send the transaction

      const txId = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Confirm the transaction
      await connection.confirmTransaction(txId, "confirmed");

      alert(`Transaction successful! Transaction ID: ${txId}`);
      console.log("Transaction successful! Transaction ID:", txId);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <button
      className="px-4 py-2 bg-[#7c65c6] text-white rounded"
      onClick={handleTestTransaction}
    >
      Test Solflare Transaction
    </button>
  );
};

export default TestSolflareTransactionButton;
