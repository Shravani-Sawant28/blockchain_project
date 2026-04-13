'use client';

import { useMembershipWallet } from '@/lib/membership';
import { BuyMembershipButton } from './BuyMembershipButton';
import { ConnectWallet } from './ConnectWallet';

export function MembershipCard() {
  const { address, isConnected } = useMembershipWallet();

  const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  return (
    <section
      id="membership-card"
      className="glass-card relative w-full rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 animate-fade-in-up-delay overflow-hidden"
    >
      {/* Decorative gradient blobs inside card */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary-600/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-accent-magenta/8 blur-3xl" />

      {/* ── Card Header ─────────────────────────────────────── */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-forge-muted mb-1">
            ERC-721 Token
          </p>
          <h2 className="text-2xl font-bold text-forge-text">Your Membership</h2>
        </div>
        {/* NFT badge */}
        <div className="flex items-center justify-center h-12 w-12 rounded-xl border border-primary-500/30 bg-primary-900/30 animate-float shrink-0">
          <svg className="h-6 w-6 text-primary-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

      {/* ── Info Rows ───────────────────────────────────────── */}
      <div className="relative space-y-3 mb-7">
        {/* Wallet row */}
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-forge-muted">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5v1A1.5 1.5 0 002.5 8h.635a3 3 0 012.7 1.688l1.618 3.235a3 3 0 002.7 1.688h.695a3 3 0 002.7-1.688l1.617-3.235A3 3 0 0117.365 8H18a1.5 1.5 0 001.5-1.5v-1A1.5 1.5 0 0018 4H2.5zm.5 4.5a1.5 1.5 0 011.5-1.5h.635a1.5 1.5 0 011.35.844l1.618 3.235a1.5 1.5 0 001.35.844H10a1.5 1.5 0 001.35-.844l1.618-3.235A1.5 1.5 0 0114.365 7H15a1.5 1.5 0 010 3h-.635a3 3 0 00-2.7 1.688L10.048 15H9.952l-1.617-3.312A3 3 0 005.635 10H5a1.5 1.5 0 01-1.5-1.5z" clipRule="evenodd" />
            </svg>
            Wallet
          </span>
          {isConnected && address ? (
            <span className="font-mono text-sm font-medium text-forge-text">{shortAddress(address)}</span>
          ) : (
            <span className="text-sm text-forge-muted italic">Not connected</span>
          )}
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-forge-muted">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Membership Status
          </span>
          {/* Placeholder status — will update to live state once minted */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-accent-coral opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-coral" />
            </span>
            <span className="text-sm font-semibold text-accent-coral">Not Active</span>
          </div>
        </div>

        {/* Expiry row */}
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-forge-muted">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
            Expiry Date
          </span>
          <span className="text-sm text-forge-muted italic">— (no membership)</span>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-7" />

      {/* ── Wallet Connect ──────────────────────────────────── */}
      {!isConnected && (
        <div className="relative mb-7 text-center">
          <p className="mb-4 text-sm text-forge-muted">Connect your wallet to proceed</p>
          <ConnectWallet />
        </div>
      )}
      {isConnected && (
        <div className="relative mb-7 flex justify-center">
          <ConnectWallet />
        </div>
      )}

      {/* ── Actions ─────────────────────────────────────────── */}
      <div className="relative">
        <BuyMembershipButton />
      </div>

      {/* ── Footer note ─────────────────────────────────────── */}
      <p className="relative mt-6 text-center text-[11px] text-forge-muted">
        Secured by Ethereum · ERC-721 Standard · Non-transferable logic on-chain
      </p>
    </section>
  );
}

