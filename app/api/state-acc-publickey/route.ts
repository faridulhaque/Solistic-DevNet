import { NextResponse } from "next/server";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";

export async function POST(req) {
  try {
    const stateAccountAddr = process.env.STATE_ACCOUNT || "";
    if (!stateAccountAddr) {
      throw new Error("State account missing in environment variables");
    }


    return NextResponse.json({ stateAccountAddr });
  } catch (error) {
    console.error("Error in deposit API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
