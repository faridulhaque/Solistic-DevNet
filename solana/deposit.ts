import { BN } from "bn.js";
import { connection, contractAddr, program } from "./config";
import { getStateAccountData } from "./getStateAccountData";
import { PublicKey, Transaction, ComputeBudgetProgram } from "@solana/web3.js";
import { createAtaTx } from "./createAtaTx";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Wallet, useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

export async function deposit(
  amount: string,
  userPublicKey: PublicKey,
  connection: Connection,
  wallet: Wallet,
  sendTransaction: any,
  connected: boolean,
  priorityFee: boolean
) {
  try {
    // Ensure a wallet is connected
    if (!connected || !wallet || !wallet.adapter) {
      throw new Error("No wallet is connected. Please connect your wallet.");
    }

    const response = await fetch("/api/state-acc-publickey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        userPublicKey,
        priorityFee,
      }),
    });

    const result = await response.json();
    const stateAccountAddr = result.stateAccountAddr;
    const stateAccountData = await getStateAccountData(stateAccountAddr);
    const stateAccountPubKey = new PublicKey(stateAccountAddr);
    const depositAmount = new BN(amount);


    const msolMint = stateAccountData.msolMint;
    console.log(msolMint);

    return "";
  } catch (error) {
    console.error("Error during deposit:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
