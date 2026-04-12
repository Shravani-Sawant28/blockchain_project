'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatEther } from 'ethers';
import {
  isUserRejectedError,
  useMembershipNftContract,
  useMembershipWallet,
} from '@/lib/membership';

/** Matches `MembershipNFT.MembershipTier`: MONTHLY, BIANNUAL, ANNUAL */
export type MembershipTierId = 0 | 1 | 2;

type Message = { type: 'success' | 'error'; text: string };

function formatTxError(err: unknown): string {
  if (isUserRejectedError(err)) return 'Transaction was rejected.';
  if (typeof err === 'object' && err !== null) {
    const short = (err as { shortMessage?: string }).shortMessage;
    if (short) return short;
    const reason = (err as { reason?: string }).reason;
    if (reason) return reason;
    const message = (err as { message?: string }).message;
    if (message) return message;
  }
  return 'Transaction failed.';
}

export function BuyMembershipButton() {
  const { isConnected } = useMembershipWallet();
  const { readContract, signedContract, isConfigured } = useMembershipNftContract();

  const [tier, setTier] = useState<MembershipTierId>(0);
  const [priceWei, setPriceWei] = useState<bigint | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!readContract || !isConfigured) {
      setPriceWei(null);
      return;
    }
    let cancelled = false;
    setLoadingPrice(true);
    void (async () => {
      try {
        const wei = (await readContract.tierPrice(tier)) as bigint;
        if (!cancelled) setPriceWei(wei);
      } catch {
        if (!cancelled) setPriceWei(null);
      } finally {
        if (!cancelled) setLoadingPrice(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [readContract, isConfigured, tier]);

  const buy = useCallback(async () => {
    setMessage(null);
    if (!isConfigured) {
      setMessage({
        type: 'error',
        text: 'Set NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS in .env.local.',
      });
      return;
    }
    if (!isConnected || !signedContract) {
      setMessage({ type: 'error', text: 'Connect your wallet first.' });
      return;
    }
    if (priceWei === null) {
      setMessage({
        type: 'error',
        text: 'Could not load price. Check contract address and network.',
      });
      return;
    }

    setTxPending(true);
    try {
      const tx = await signedContract.mintMembership(tier, { value: priceWei });
      setMessage({
        type: 'success',
        text: `Submitted. Waiting for confirmation… (${tx.hash.slice(0, 10)}…)`,
      });
      await tx.wait();
      setMessage({
        type: 'success',
        text: `Success. Tx ${tx.hash.slice(0, 10)}…${tx.hash.slice(-6)}`,
      });
    } catch (err) {
      setMessage({ type: 'error', text: formatTxError(err) });
    } finally {
      setTxPending(false);
    }
  }, [isConfigured, isConnected, priceWei, signedContract, tier]);

  const busy = txPending || loadingPrice;
  const canClick = isConfigured && priceWei !== null && !busy;

  return (
    <div className="mt-6 flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <label className="inline-flex items-center gap-2">
          <span>Tier</span>
          <select
            className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            value={tier}
            onChange={(e) => setTier(Number(e.target.value) as MembershipTierId)}
            disabled={txPending}
          >
            <option value={0}>Monthly</option>
            <option value={1}>Biannual</option>
            <option value={2}>Annual</option>
          </select>
        </label>
        {loadingPrice ? (
          <span>Price…</span>
        ) : priceWei !== null ? (
          <span>{formatEther(priceWei)} ETH</span>
        ) : isConfigured ? (
          <span>—</span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => void buy()}
        disabled={!canClick}
        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {txPending ? 'Processing…' : 'Buy Membership'}
      </button>

      {!isConfigured ? (
        <p className="text-center text-xs text-zinc-500">
          Add NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS to use this button.
        </p>
      ) : null}

      {message ? (
        <p
          role="status"
          className={
            message.type === 'success'
              ? 'text-center text-sm text-emerald-700 dark:text-emerald-400'
              : 'text-center text-sm text-red-600 dark:text-red-400'
          }
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
