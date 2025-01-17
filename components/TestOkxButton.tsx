"use client";
import React from "react";
import { Connection, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

const TestOKXTransactionButton = ({ walletAddress }) => {
  const handleTestTransaction = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      if (window.okxwallet && window.okxwallet.solana) {
        // Create a connection to the Solana cluster
        const connection = new Connection("https://api.devnet.solana.com");

        const fromPublicKey = new PublicKey(walletAddress);
        const toPublicKey = new PublicKey("EDYv1dKQeCFBM9zCZkCHQq18NHnhhkb1bstXuwroLmHn"); // Replace with recipient's address

        // Fetch the latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        // Create a transaction
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: 0.01 * 10 ** 9, // Convert SOL to lamports
          })
        );

        // Set the transaction's recentBlockhash
        transaction.recentBlockhash = blockhash;

        // Set the transaction's fee payer
        transaction.feePayer = fromPublicKey;

        // Request the OKX Wallet to sign the transaction
        const signedTransaction = await window.okxwallet.solana.signTransaction(
          transaction
        );

        // Send the signed transaction
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );

        console.log("Transaction sent with signature:", signature);

        // Confirm the transaction
        const confirmation = await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "finalized"
        );
        console.log("Transaction confirmed:", confirmation);

        alert("Transaction successful!");
      } else {
        alert(
          "OKX Wallet not found or does not support Solana. Please install the extension."
        );
      }
    } catch (error) {
      console.error("Error while sending transaction:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={handleTestTransaction}
    >
      Test OKX Transaction
    </button>
  );
};

export default TestOKXTransactionButton;
