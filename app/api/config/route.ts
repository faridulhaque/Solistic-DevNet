import { NextResponse } from "next/server";
import { BN } from "bn.js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export async function POST(req) {
  try {
    const PAYER_KEY = process.env.PAYER_KEY || "";
    const RPC = process.env.RPC || "";

    // Check for required environment variables
    if (!PAYER_KEY || !RPC) {
      throw new Error(
        "Missing required environment variables: PAYER_KEY or RPC"
      );
    }

    // Initialize Solana connection and payer
    const payer = Keypair.fromSecretKey(bs58.decode(PAYER_KEY));
    const connection = new Connection(RPC, { commitment: "finalized" });

    return NextResponse.json({ payer, connection });
  } catch (error) {
    console.error("Error in deposit API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
