import { NextResponse } from "next/server";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";

export async function POST(req) {
  try {
    const stateAccountAddr = process.env.STATE_ACCOUNT || "";
    if (!stateAccountAddr) {
      throw new Error("State account missing in environment variables");
    }

    const PAYER_KEY = process.env.PAYER_KEY || "";
    const RPC = process.env.RPC || "";

    // Check for required environment variables
    if (!PAYER_KEY || !RPC) {
      throw new Error(
        "Missing required environment variables: PAYER_KEY or RPC"
      );
    }

    return NextResponse.json({ stateAccountAddr, PAYER_KEY, RPC });
  } catch (error) {
    console.error("Error in deposit API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
