import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import {
  MarinadeForkingSmartContract,
  IDL,
} from "../targets/types/marinade_forking_smart_contract";
import idl from "../targets/idl/marinade_forking_smart_contract.json";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export async function initConfig(PAYER_KEY: string, RPC: string) {
    // Initialize Solana connection and payer
    const payer = Keypair.fromSecretKey(bs58.decode(PAYER_KEY));
    const connection = new Connection(RPC, { commitment: "finalized" });
    const contractAddr = new PublicKey(idl.metadata.address);
  
    // Next.js-friendly provider
    let provider: AnchorProvider | null = null;
  
    // Ensure wallet and provider are accessible in both server and client
    if (typeof window !== "undefined") {
      const wallet = new AnchorProvider(connection, payer as any, {});
      provider = new AnchorProvider(connection, wallet as any, {});
    }
  
    // Initialize Anchor program
    const program = provider
      ? new Program<MarinadeForkingSmartContract>(IDL, contractAddr, provider)
      : null;
  
    return { payer, connection, contractAddr, provider, program };
  }