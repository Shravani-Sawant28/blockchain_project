'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMembershipNftContract } from './useMembershipNftContract';
import { useMembershipWallet } from './MembershipWalletContext';

export type MembershipStatus = {
  /** null = not yet fetched or no wallet */
  hasAccess: boolean | null;
  /** Unix timestamp (seconds) when the membership expires. null = no membership. */
  expiryTimestamp: bigint | null;
  /** True while reading contract */
  loading: boolean;
  /** Call this after a successful mint to immediately refresh status */
  refresh: () => void;
};

/**
 * Reads the connected wallet's membership status and expiry from the contract.
 * Auto-polls every 15 seconds so the UI stays in sync.
 */
export function useMembershipStatus(): MembershipStatus {
  const { address, isConnected } = useMembershipWallet();
  const { readContract, isConfigured } = useMembershipNftContract();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [expiryTimestamp, setExpiryTimestamp] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!readContract || !isConfigured || !address || !isConnected) {
      setHasAccess(null);
      setExpiryTimestamp(null);
      return;
    }

    setLoading(true);
    try {
      // Check access (hasAccess = owns NFT AND not expired)
      const access = (await readContract.hasAccess(address)) as boolean;
      setHasAccess(access);

      // Get tokenId to look up expiry
      const tokenId = (await readContract.userToTokenId(address)) as bigint;
      if (tokenId > 0n) {
        const expiry = (await readContract.membershipExpiry(tokenId)) as bigint;
        setExpiryTimestamp(expiry);
      } else {
        setExpiryTimestamp(null);
      }
    } catch {
      setHasAccess(null);
      setExpiryTimestamp(null);
    } finally {
      setLoading(false);
    }
  }, [readContract, isConfigured, address, isConnected]);

  // Fetch on mount and whenever wallet or contract changes
  useEffect(() => {
    void fetch();
    // Also poll every 15 seconds to catch on-chain changes
    const interval = setInterval(() => void fetch(), 15_000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { hasAccess, expiryTimestamp, loading, refresh: fetch };
}
