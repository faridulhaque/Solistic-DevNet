"use client";
import React, { useEffect, useState } from "react";

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const ConnectWalletButton = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <>
      {domLoaded && (
        <div>
          <WalletModalProvider>
            <div style={{ display: "flex", alignItems: "center" }}>
            <WalletMultiButton
      style={{
        backgroundColor: "#8c70dc",
        color: "#f5edd3",
        fontFamily: "Zilla Slab, serif",
        fontSize: "14px",
        fontWeight: 600,
        borderRadius: "20px",
        padding: "10px 20px",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease",
      }}
    />

<WalletDisconnectButton
        style={{
          backgroundColor: connected ? "#8c70dc" : "#4a4a4a", // Purple if connected, gray otherwise
          color: connected ? "#f5edd3" : "#f5edd3", // Creamy text if connected, dark gray otherwise
          fontFamily: "Zilla Slab, serif",
          fontSize: "14px",
          fontWeight: 600,
          borderRadius: "20px",
          padding: "10px 20px",
          border: "none",
          cursor: connected ? "pointer" : "not-allowed", // Disable interaction when not connected
          transition: "background-color 0.3s ease, transform 0.2s ease",
          marginLeft: "5px"
        }}
      />
            </div>
          </WalletModalProvider>
        </div>
      )}
    </>
  );
};

export default ConnectWalletButton;
