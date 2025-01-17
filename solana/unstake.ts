import { BN } from "bn.js";
import { getStateAccountData } from "./getStateAccountData";
import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Wallet } from "@solana/wallet-adapter-react";
import { handleConfig } from "./config";

export async function unstake(
  sSolAmount: string,
  userPublicKey: PublicKey,
  connection: Connection,
  wallet: Wallet,
  sendTransaction: any,
  connected: boolean,
  priorityFee: boolean
) {
  // const amount = Number(sSolAmount) * 10**9;
  // console.log("amt", amount);

  try {
    // Ensure a wallet is connected
    if (!connected || !wallet || !wallet.adapter) {
      throw new Error("No wallet is connected. Please connect your wallet.");
    }

    const data = await handleConfig();
    const connection = data.connection;
    const program = data.program;
    const contractAddr = data.contractAddr;

    const response = await fetch("/api/state-acc-publickey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    const stateAccountAddr = result.stateAccountAddr;

    const sSolAmt = new BN(sSolAmount);

    const stateAccountPubKey = new PublicKey(stateAccountAddr);
    const stateAccountData = await getStateAccountData(stateAccountAddr);

    // console.log("State account data:", stateAccountData);

    const msolMint = stateAccountData.msolMint;

    // Generate PDAs for the liquidity pool and authority
    const [solLegPda] = PublicKey.findProgramAddressSync(
      [stateAccountPubKey.toBuffer(), Buffer.from("liq_sol")],
      contractAddr
    );

    console.log("solLegPda", solLegPda.toString());

    const [authorityMSolLegAcc] = PublicKey.findProgramAddressSync(
      [stateAccountPubKey.toBuffer(), Buffer.from("liq_st_sol_authority")],
      contractAddr
    );

    console.log("authorityMSolLegAcc", authorityMSolLegAcc.toString());

    // Get the associated token account (ATA) for the user and the mint
    const getsSolFrom = getAssociatedTokenAddressSync(msolMint, userPublicKey);
    // console.log(getsSolFrom.toString());
    const mSolLeg = getAssociatedTokenAddressSync(
      msolMint,
      authorityMSolLegAcc,
      true
    );

    console.log("mSolLeg", mSolLeg.toString());

    const transaction = new Transaction();

    const setComputeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: priorityFee ? 800_000 : 400_000,
    });
    // if it is off then unit is 400_000 and microlampot 2
    // if it is on then units are 800_000 and microlampot 20
    const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFee ? 20 : 2, // example priority fee: 2 micro-lamports per CU
    });

    transaction.add(setComputeUnitLimitIx, setComputeUnitPriceIx);

    // Create the unstake transaction
    console.log("Creating unstake transaction...");
    const unStakeTx = await program.methods
      .liquidUnstake(sSolAmt)
      .accounts({
        state: stateAccountAddr,
        msolMint: msolMint,
        liqPoolMsolLeg: mSolLeg,
        liqPoolSolLegPda: solLegPda,
        treasuryMsolAccount: stateAccountData.treasuryMsolAccount,
        getMsolFrom: getsSolFrom,
        getMsolFromAuthority: userPublicKey,
        transferSolTo: userPublicKey,
      })
      .transaction();

    transaction.add(unStakeTx);

    transaction.feePayer = userPublicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    console.log("Requesting wallet to sign unstake transaction...");
    const sig = await sendTransaction(transaction, connection);
    console.log("Unstake transaction signature:", sig);

    return sig;
  } catch (error) {
    console.log("Error", error);
    // console.error("Error during unstake:", error);
    // console.error("Error stack:", error.stack);
    // throw error;
  }
}
