import { BN } from "bn.js";
import { getStateAccountData } from "./getStateAccountData";
import {
  PublicKey,
  Transaction,
  ComputeBudgetProgram,
  Keypair,
} from "@solana/web3.js";
import { createAtaTx } from "./createAtaTx";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Wallet, useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
// import { contractAddr, program } from "./config";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import idl from "../targets/idl/marinade_forking_smart_contract.json";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  IDL,
  MarinadeForkingSmartContract,
} from "../targets/types/marinade_forking_smart_contract";
import { initConfig } from "./initConfig";

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
      body: JSON.stringify({}),
    });

    const result = await response.json();
    const stateAccountAddr = result.stateAccountAddr;
    const stateAccountData = await getStateAccountData(stateAccountAddr);
    const stateAccountPubKey = new PublicKey(stateAccountAddr);
    const depositAmount = new BN(amount);

    const msolMint = stateAccountData.msolMint;

    const { contractAddr, program } = await initConfig(
      result?.PAYER_KEY,
      result?.RPC
    );
    // Generate PDAs for the liquidity pool and authority
    const [solLegPda] = PublicKey.findProgramAddressSync(
      [stateAccountPubKey.toBuffer(), Buffer.from("liq_sol")],
      contractAddr
    );
    const [authorityMsolAcc] = PublicKey.findProgramAddressSync(
      [stateAccountPubKey.toBuffer(), Buffer.from("st_mint")],
      contractAddr
    );
    const [authorityMSolLegAcc] = PublicKey.findProgramAddressSync(
      [stateAccountPubKey.toBuffer(), Buffer.from("liq_st_sol_authority")],
      contractAddr
    );
    const [reservePda] = PublicKey.findProgramAddressSync(
      [stateAccountPubKey.toBuffer(), Buffer.from("reserve")],
      contractAddr
    );

    console.log(
      "Liquidity pool mSOL leg authority:",
      authorityMSolLegAcc.toString()
    );

    // Get the associated token account (ATA) for the user and the mint
    const mintTo = getAssociatedTokenAddressSync(msolMint, userPublicKey);
    const mSolLeg = getAssociatedTokenAddressSync(
      msolMint,
      authorityMSolLegAcc,
      true
    );

    // Check if the user's ATA exists
    const accountExists = await connection.getAccountInfo(mintTo);
    const transaction = new Transaction();

    const setComputeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: priorityFee ? 800_000 : 400_000,
    });
    const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFee ? 20 : 2, // example priority fee: 2 micro-lamports per CU
    });

    transaction.add(setComputeUnitLimitIx, setComputeUnitPriceIx);

    if (!accountExists) {
      console.log("Creating associated token account...");
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPublicKey,
          mintTo,
          userPublicKey,
          msolMint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    } else {
      console.log(
        "Associated token account already exists:",
        mintTo.toBase58()
      );
    }

    // Create the deposit transaction
    console.log("Creating deposit transaction...");
    const staketx = await program.methods
      .deposit(depositAmount)
      .accounts({
        state: stateAccountAddr,
        msolMint: msolMint,
        liqPoolSolLegPda: solLegPda,
        liqPoolMsolLeg: mSolLeg,
        liqPoolMsolLegAuthority: authorityMSolLegAcc,
        reservePda: reservePda,
        transferFrom: userPublicKey,
        mintTo: mintTo,
        msolMintAuthority: authorityMsolAcc,
      })
      .transaction();
    transaction.add(staketx);
    transaction.feePayer = userPublicKey;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    console.log("Requesting wallet to sign deposit transaction...");
    const sig = await sendTransaction(transaction, connection);
    console.log("Deposit transaction signature:", sig);

    return sig;
  } catch (error) {
    console.error("Error during deposit:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}


