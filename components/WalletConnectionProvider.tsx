"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CloverWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  SolongWalletAdapter,
  AlphaWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SlopeWalletAdapter } from "@solana/wallet-adapter-slope";
import { SolletWalletAdapter } from "@solana/wallet-adapter-sollet";
import { NightlyWalletAdapter } from "@solana/wallet-adapter-nightly";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

const WalletConnectionProvider = ({ children }) => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // these two are working ↑ ↑
      // ====================
      new SlopeWalletAdapter(),
      // this one should work. check whatsapp message, I sent sols.if you got, it means it is working too.
      // =====================
      new NightlyWalletAdapter(),
      new Coin98WalletAdapter(),
      // can't check above two. They don't have devnet mode.
      // =====================
      // below wallets are not working
      // new TorusWalletAdapter(),
      // new SolletWalletAdapter(),
      // new LedgerWalletAdapter(),
      // new MathWalletAdapter(),
      // new SolongWalletAdapter(),
      // new CloverWalletAdapter(),
      // new AlphaWalletAdapter(),
    ],
    []
  );

  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
