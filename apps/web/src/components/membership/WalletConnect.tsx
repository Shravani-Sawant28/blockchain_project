'use client';

import { ConnectWallet } from './ConnectWallet';

export function WalletConnect() {
  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Wallet</h2>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Connect your MetaMask wallet to buy and manage your membership NFT.
      </p>
      <ConnectWallet />
    </section>
  );
}
