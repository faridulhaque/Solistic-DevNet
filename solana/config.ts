import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import {
  MarinadeForkingSmartContract,
  IDL,
} from "../targets/types/marinade_forking_smart_contract";
import idl from "../targets/idl/marinade_forking_smart_contract.json";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export const handleConfig = async () => {
  const response = await fetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const result = await response.json();
  const connection = result.connection;
  const payer = result.payer;

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
};
