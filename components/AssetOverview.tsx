// components/AssetOverview.tsx
"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { erc20Abi } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Token {
  symbol: string;
  address: `0x${string}`;
  priceKey: string;
}

interface TokenBalance extends Token {
  balance: bigint;
  usdValue: number;
}

interface PriceData {
  [key: string]: {
    usd: number;
  };
}

const TOKENS: Token[] = [
  {
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    priceKey: "ethereum",
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    priceKey: "usd-coin",
  },
  {
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    priceKey: "wrapped-bitcoin",
  },
];

const AssetOverview = () => {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [prices, setPrices] = useState<PriceData>({});

  const { data: tokenData } = useReadContracts({
    contracts: TOKENS.map((token) => ({
      address: token.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address!],
    })),
  });

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${TOKENS.map(
          (t) => t.priceKey
        ).join(",")}&vs_currencies=usd`
      );
      const data: PriceData = await response.json();
      setPrices(data);
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    if (tokenData) {
      setTokenBalances(
        TOKENS.map((token, index) => {
          const balance = (tokenData[index]?.result as bigint) || BigInt(0);
          return {
            ...token,
            balance,
            usdValue:
              Number(formatEther(balance)) * (prices[token.priceKey]?.usd || 0),
          };
        })
      );
    }
  }, [tokenData, prices]);

  if (!address) return <p>Please connect your wallet to view assets.</p>;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>USD Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>ETH</TableCell>
              <TableCell>{ethBalance?.formatted} ETH</TableCell>
              <TableCell>
                $
                {(
                  Number(ethBalance?.formatted) * (prices["ethereum"]?.usd || 0)
                ).toFixed(2)}
              </TableCell>
            </TableRow>
            {tokenBalances.map((token) => (
              <TableRow key={token.symbol}>
                <TableCell>{token.symbol}</TableCell>
                <TableCell>
                  {formatEther(token.balance)} {token.symbol}
                </TableCell>
                <TableCell>${token.usdValue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssetOverview;
