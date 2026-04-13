'use client';

import { useMembershipWallet } from '@/lib/membership';

export function ConnectWallet() {
  const { address, chainId, connecting, error, connect, switchToLocalhost, disconnect } =
    useMembershipWallet();

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
      {address ? (
        <p className="text-xs text-zinc-500">Connected network chainId: {chainId ?? 'unknown'}</p>
      ) : null}
      {address && chainId !== 31337 ? (
        <button
          type="button"
          onClick={() => void switchToLocalhost()}
          className="rounded-lg border border-amber-500 px-3 py-1 text-xs text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950"
        >
          Switch to Localhost (31337)
        </button>
      ) : null}
    </div>
  );
}
