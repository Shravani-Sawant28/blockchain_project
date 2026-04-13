'use client';

import { useMembershipWallet } from '@/lib/membership';

export function ConnectWallet() {
  const { address, chainId, connecting, error, connect, switchToLocalhost, disconnect } =
    useMembershipWallet();

  const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
  const isCorrectChain = chainId === 31337;

  return (
    <div className="flex flex-col items-center gap-4">
      {!address ? (
        /* ── Connect button ──────────────────────────────── */
        <button
          id="connect-wallet-btn"
          type="button"
          onClick={() => void connect()}
          disabled={connecting}
          className="glow-btn inline-flex items-center gap-3 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 px-8 py-3.5 text-sm font-semibold text-accent-cyan shadow-lg shadow-accent-cyan/10 transition-all duration-300 hover:border-accent-cyan/60 hover:bg-accent-cyan/20 hover:shadow-accent-cyan/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0 animate-pulse-glow"
        >
          {connecting ? (
            <>
              <svg className="h-4 w-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Connecting…</span>
            </>
          ) : (
            <>
              {/* MetaMask fox icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 7.5L12 2 3 7.5v9L12 22l9-5.5v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 2v20M3 7.5l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      ) : (
        /* ── Connected state ────────────────────────────── */
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Address pill */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-accent-lime opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-lime" />
            </span>
            <span className="font-mono text-sm text-forge-text tracking-wider">
              {shortAddress(address)}
            </span>
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                isCorrectChain
                  ? 'bg-accent-lime/10 text-accent-lime border border-accent-lime/20'
                  : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20'
              }`}
            >
              {isCorrectChain ? 'Localhost' : `Chain ${chainId ?? '?'}`}
            </span>
            <button
              id="disconnect-wallet-btn"
              type="button"
              onClick={disconnect}
              title="Disconnect"
              className="ml-2 rounded-lg p-1 text-forge-muted hover:text-forge-text hover:bg-white/10 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Wrong network warning */}
          {!isCorrectChain && (
            <button
              id="switch-network-btn"
              type="button"
              onClick={() => void switchToLocalhost()}
              className="inline-flex items-center gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-4 py-2 text-xs font-medium text-accent-amber hover:bg-accent-amber/20 hover:border-accent-amber/50 transition-all duration-200"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Switch to Localhost (31337)
            </button>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-accent-coral/30 bg-accent-coral/10 px-4 py-3 max-w-sm w-full" role="alert">
          <svg className="h-4 w-4 text-accent-coral mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-accent-coral leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
}

