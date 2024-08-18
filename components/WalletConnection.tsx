// components/WalletConnection.tsx
"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const WalletConnection = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  if (isConnected) {
    return (
      <div className="space-y-2">
        <p>Connected to {address}</p>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    );
  }

  return <Button onClick={() => open()}>Connect Wallet</Button>;
};

export default WalletConnection;
