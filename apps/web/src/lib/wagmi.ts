import { cookieStorage, createStorage } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { chains } from './chains';

const envWalletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ?? '';
// RainbowKit requires a non-empty WalletConnect Cloud `projectId`. If unset, use the literal
// "YOUR_PROJECT_ID": RainbowKit substitutes its bundled demo ID (see RainbowKit source).
// For production, create your own project at https://cloud.walletconnect.com and set the env var.
const projectId =
  envWalletConnectId.length > 0 ? envWalletConnectId : 'YOUR_PROJECT_ID';


export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'My DApp',
  projectId,
  chains: chains,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});


declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}