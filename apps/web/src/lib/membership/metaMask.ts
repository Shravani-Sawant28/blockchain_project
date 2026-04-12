import type { Eip1193Provider } from 'ethers';

export type MetaMaskEip1193 = Eip1193Provider & {
  isMetaMask?: boolean;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type WindowWithEthereum = Window & {
  ethereum?: MetaMaskEip1193;
};

export function getMetaMaskProvider(): MetaMaskEip1193 | null {
  if (typeof window === 'undefined') return null;
  const { ethereum } = window as WindowWithEthereum;
  if (!ethereum || !ethereum.isMetaMask) return null;
  return ethereum;
}

export function metaMaskInstallMessage(): string {
  if (typeof window === 'undefined') {
    return 'MetaMask is not available in this environment.';
  }
  const { ethereum } = window as WindowWithEthereum;
  if (!ethereum) {
    return 'MetaMask is not installed. Install it from https://metamask.io and refresh this page.';
  }
  return 'Please use the MetaMask browser extension for this app.';
}

export function isUserRejectedError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const e = error as { code?: number | string; message?: string };
  if (e.code === 4001 || e.code === 'ACTION_REJECTED') return true;
  if (typeof e.message === 'string' && e.message.toLowerCase().includes('user rejected'))
    return true;
  return false;
}
