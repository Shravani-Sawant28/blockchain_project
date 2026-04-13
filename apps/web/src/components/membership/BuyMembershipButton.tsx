'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatEther } from 'ethers';
import {
  getMembershipNftAddressOrNull,
  isUserRejectedError,
  useMembershipNftContract,
  useMembershipWallet,
} from '@/lib/membership';
import { ActionButton } from './ActionButton';

/** Matches `MembershipNFT.MembershipTier`: MONTHLY, BIANNUAL, ANNUAL */
export type MembershipTierId = 0 | 1 | 2;

type Message = { type: 'success' | 'error'; text: string };

function formatTxError(err: unknown): string {
  if (isUserRejectedError(err)) return 'Transaction was rejected.';
  if (typeof err === 'object' && err !== null) {
    const code = (err as { code?: string }).code;
    if (code === 'BAD_DATA') {
      return 'Wrong network or contract address. Switch MetaMask network to where MembershipNFT is deployed.';
    }
    const short = (err as { shortMessage?: string }).shortMessage;
    if (short) return short;
    const reason = (err as { reason?: string }).reason;
    if (reason) return reason;
    const message = (err as { message?: string }).message;
    if (message) return message;
  }
  return 'Transaction failed.';
}

const TIER_LABELS: Record<MembershipTierId, { label: string; duration: string; emoji: string }> = {
  0: { label: 'Monthly', duration: '30 days', emoji: '🌙' },
  1: { label: 'Biannual', duration: '180 days', emoji: '⚡' },
  2: { label: 'Annual', duration: '365 days', emoji: '🌟' },
};

export function BuyMembershipButton() {
  const { browserProvider, chainId, isConnected } = useMembershipWallet();
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
    if (chainId !== 31337) {
      setMessage({
        type: 'error',
        text: `Wrong network. Switch MetaMask to localhost (chainId 31337). Current: ${chainId ?? 'unknown'}.`,
      });
      return;
    }

    const contractAddress = getMembershipNftAddressOrNull();
    if (!browserProvider || !contractAddress) {
      setMessage({ type: 'error', text: 'Wallet provider is not ready yet. Try again.' });
      return;
    }

    setTxPending(true);
    try {
      const code = await browserProvider.getCode(contractAddress);
      if (code === '0x') {
        setMessage({
          type: 'error',
          text: `No contract found at ${contractAddress} on current network (chainId: ${chainId ?? 'unknown'}).`,
        });
        return;
      }

      let value = priceWei;
      if (value === null) {
        value = (await signedContract.tierPrice(tier)) as bigint;
        setPriceWei(value);
      }

      const tx = await signedContract.mintMembership(tier, { value });
      setMessage({
        type: 'success',
        text: `Submitted. Waiting for confirmation… (${tx.hash.slice(0, 10)}…)`,
      });
      await tx.wait();
      setMessage({
        type: 'success',
        text: `Success! Membership minted. Tx ${tx.hash.slice(0, 10)}…${tx.hash.slice(-6)}`,
      });
    } catch (err) {
      setMessage({ type: 'error', text: formatTxError(err) });
    } finally {
      setTxPending(false);
    }
  }, [browserProvider, chainId, isConfigured, isConnected, priceWei, signedContract, tier]);

  const busy = txPending || loadingPrice;
  const canClick = !busy;

  return (
    <div className="flex w-full flex-col items-center gap-5">

      {/* ── Tier Selector ────────────────────────────────────── */}
      <div className="grid w-full grid-cols-3 gap-2" role="group" aria-label="Membership tier">
        {([0, 1, 2] as MembershipTierId[]).map((t) => {
          const info = TIER_LABELS[t];
          const isSelected = tier === t;
          return (
            <button
              key={t}
              id={`tier-btn-${t}`}
              type="button"
              disabled={txPending}
              onClick={() => setTier(t)}
              className={[
                'flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:opacity-50',
                isSelected
                  ? 'border-primary-500/60 bg-primary-900/30 text-forge-text shadow-inner shadow-primary-900/40'
                  : 'border-white/5 bg-white/[0.02] text-forge-muted hover:border-white/10 hover:bg-white/[0.04]',
              ].join(' ')}
            >
              <span className="text-lg">{info.emoji}</span>
              <span className={`text-xs font-bold ${isSelected ? 'text-primary-300' : ''}`}>{info.label}</span>
              <span className="text-[10px] text-forge-muted">{info.duration}</span>
            </button>
          );
        })}
      </div>

      {/* ── Price display ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-forge-muted">Price:</span>
        {loadingPrice ? (
          <span className="flex items-center gap-1.5 text-forge-muted">
            <svg className="h-3.5 w-3.5 animate-spin-slow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            fetching…
          </span>
        ) : priceWei !== null ? (
          <span className="font-mono font-semibold text-accent-cyan">{formatEther(priceWei)} ETH</span>
        ) : isConfigured ? (
          <span className="text-forge-muted">—</span>
        ) : null}
      </div>

      {/* ── CTA Button ───────────────────────────────────────── */}
      <ActionButton
        label="Buy Membership"
        loadingLabel="Processing Transaction…"
        loading={txPending}
        disabled={!canClick}
        onClick={() => void buy()}
      />

      {/* ── Config warning ────────────────────────────────────── */}
      {!isConfigured && (
        <div className="flex items-start gap-2 rounded-xl border border-accent-amber/20 bg-accent-amber/5 px-4 py-3 w-full">
          <svg className="h-4 w-4 text-accent-amber mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-accent-amber leading-relaxed">
            Add <code className="font-mono bg-white/10 px-1 rounded">NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS</code> to <code className="font-mono bg-white/10 px-1 rounded">.env.local</code> to enable minting.
          </p>
        </div>
      )}

      {/* ── Transaction message ───────────────────────────────── */}
      {message && (
        <div
          role="status"
          className={[
            'flex items-start gap-2 rounded-xl border px-4 py-3 w-full transition-all duration-300',
            message.type === 'success'
              ? 'border-accent-lime/30 bg-accent-lime/10'
              : 'border-accent-coral/30 bg-accent-coral/10',
          ].join(' ')}
        >
          {message.type === 'success' ? (
            <svg className="h-4 w-4 text-accent-lime mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-accent-coral mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          )}
          <p className={`text-xs leading-relaxed ${message.type === 'success' ? 'text-accent-lime' : 'text-accent-coral'}`}>
            {message.text}
          </p>
        </div>
      )}
    </div>
  );
}

