import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { chains } from './chains';

const LOCAL_RPC_URL = process.env.NEXT_PUBLIC_LOCAL_RPC_URL || 'http://127.0.0.1:8545';

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: {
    [chains[0].id]: http(LOCAL_RPC_URL),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}