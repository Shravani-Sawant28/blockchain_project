'use client';

import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';

type MetaMaskEip1193 = ethers.Eip1193Provider & {
  isMetaMask?: boolean;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type WindowWithEthereum = Window & {
  ethereum?: MetaMaskEip1193;
};

function getMetaMaskProvider(): MetaMaskEip1193 | null {
  if (typeof window === 'undefined') return null;
  const { ethereum } = window as WindowWithEthereum;
  if (!ethereum) return null;
  if (!ethereum.isMetaMask) return null;
  return ethereum;
}

function metaMaskInstallMessage(): string {
  if (typeof window === 'undefined') {
    return 'MetaMask is not available in this environment.';
  }
  const { ethereum } = window as WindowWithEthereum;
  if (!ethereum) {
    return 'MetaMask is not installed. Install it from https://metamask.io and refresh this page.';
  }
  return 'Please use the MetaMask browser extension for this app.';
}

function isUserRejectedError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const e = error as { code?: number | string; message?: string };
  if (e.code === 4001 || e.code === 'ACTION_REJECTED') return true;
  if (typeof e.message === 'string' && e.message.toLowerCase().includes('user rejected'))
    return true;
  return false;
}

export function ConnectWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshFromProvider = useCallback(async () => {
    const ethereum = getMetaMaskProvider();
    if (!ethereum) return;
    const provider = new ethers.BrowserProvider(ethereum);
    const accounts = await provider.send('eth_accounts', []);
    if (accounts.length > 0) {
      setAddress(ethers.getAddress(accounts[0]));
    } else {
      setAddress(null);
    }
  }, []);

  useEffect(() => {
    const ethereum = getMetaMaskProvider();
    if (!ethereum) return;

    void refreshFromProvider();

    const onAccountsChanged = (accounts: unknown) => {
      const list = accounts as string[];
      if (!list.length) {
        setAddress(null);
        return;
      }
      setAddress(ethers.getAddress(list[0]));
    };

    ethereum.on?.('accountsChanged', onAccountsChanged);
    return () => {
      ethereum.removeListener?.('accountsChanged', onAccountsChanged);
    };
  }, [refreshFromProvider]);

  const connect = async () => {
    setError(null);
    const ethereum = getMetaMaskProvider();
    if (!ethereum) {
      setError(metaMaskInstallMessage());
      return;
    }

    setConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      setAddress(await signer.getAddress());
    } catch (err) {
      if (isUserRejectedError(err)) {
        setError('You rejected the connection request.');
      } else {
        setError('Could not connect. Please try again.');
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setError(null);
  };

  const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  return (
    <div className="flex flex-col items-center gap-3">
      {!address ? (
        <button
          type="button"
          onClick={() => void connect()}
          disabled={connecting}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {connecting ? 'Connecting…' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            {shortAddress(address)}
          </span>
          <button
            type="button"
            onClick={disconnect}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Clear session
          </button>
        </div>
      )}
      {error ? (
        <p className="max-w-md text-center text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
