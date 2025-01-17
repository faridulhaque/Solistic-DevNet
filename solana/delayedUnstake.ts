import { BN } from "bn.js";
import { getStateAccountData } from "./getStateAccountData";
import {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Wallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { payer, program } from "./config";
import { initConfig } from "./initConfig";

export async function delayedUnstake(
  amount: string,
  userPublicKey: PublicKey,
  connection: Connection,
  wallet: Wallet,
  sendTransaction: any,
  connected: boolean,
  priorityFee: boolean
) {
  console.log("Delayed unstake amount:", amount);
  console.log("pf", priorityFee);

  try {
    // Ensure a wallet is connected
    if (!connected || !wallet || !wallet.adapter) {
      throw new Error("No wallet is connected. Please connect your wallet.");
    }

    const response = await fetch("/api/state-acc-publickey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const result = await response.json();
    const stateAccountAddr = result.stateAccountAddr;

    const unstakeAmount = new BN(amount);
    const stateAccountData = await getStateAccountData(stateAccountAddr);

    const msolMint = stateAccountData.msolMint;

    const { program } = await initConfig(
      result?.PAYER_KEY,
      result?.RPC
    );

    // Generate new ticket account
    const newTicketAccount = Keypair.generate();

    // Get the associated token account (ATA) for the user and the mint
    const burnMsolFrom = getAssociatedTokenAddressSync(msolMint, userPublicKey);
    const transaction = new Transaction();

    const setComputeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: priorityFee ? 800_000 : 400_000,
    });

    const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFee ? 20 : 2, // example priority fee: 2 micro-lamports per CU
    });

    transaction.add(setComputeUnitLimitIx, setComputeUnitPriceIx);

    // Create the delayed unstake transaction
    console.log("Creating delayed unstake transaction...");
    const delayedUnstakeTx = await program.methods
      .orderUnstake(unstakeAmount)
      .accounts({
        state: stateAccountAddr,
        msolMint: msolMint,
        burnMsolFrom: burnMsolFrom,
        burnMsolAuthority: userPublicKey,
        newTicketAccount: newTicketAccount.publicKey,
      })
      .preInstructions([
        await program.account.ticketAccountData.createInstruction(
          newTicketAccount
        ),
      ])
      .transaction();
    transaction.add(delayedUnstakeTx);

    transaction.feePayer = userPublicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(newTicketAccount);
    transaction.partialSign(payer);

    const signature = await sendTransaction(transaction, connection);
    console.log("Transaction signature:", signature);
    return signature;
  } catch (error) {
    console.error("Error in delayedUnstake:", error);
    throw error;
  }
}
