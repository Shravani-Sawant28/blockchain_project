import { defineChain } from 'viem';

const LOCAL_RPC_URL = process.env.NEXT_PUBLIC_LOCAL_RPC_URL || 'http://127.0.0.1:8545';

export const localhostHardhat = defineChain({
  id: 31337,
  name: 'Localhost Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [LOCAL_RPC_URL],
    },
  },
});

export const chains = [localhostHardhat] as const;
  