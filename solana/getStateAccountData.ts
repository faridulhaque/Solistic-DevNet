import { config } from "dotenv";
import { program } from "./config";
import { PublicKey } from "@solana/web3.js";
config();

async function getStateAccountData(stateAccountPubKey: string) {
  try {
    const state = await program.account.state.fetch(stateAccountPubKey);

    return state;
  } catch (error) {
    throw error;
  }
}

export { getStateAccountData };
