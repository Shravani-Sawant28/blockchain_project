'use client';

import { useMemo } from 'react';
import type { Contract } from 'ethers';
import { getMembershipNftAddressOrNull } from './config';
import { getMembershipNftContractIfConfigured } from './contract';
import { useMembershipWallet } from './MembershipWalletContext';

export type UseMembershipNftContractResult = {
  /** Read-only contract (connected provider). */
  readContract: Contract | null;
  /** Contract bound to the connected signer (transactions). */
  signedContract: Contract | null;
  /** True when `NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS` is set and valid. */
  isConfigured: boolean;
};

/**
 * Reusable Membership NFT `ethers.Contract` instances for the current MetaMask session.
 * Use `readContract` for view calls; use `signedContract` for `mintMembership` and other txs.
 */
export function useMembershipNftContract(): UseMembershipNftContractResult {
  const { readProvider, signer } = useMembershipWallet();

  const isConfigured = getMembershipNftAddressOrNull() !== null;

  const readContract = useMemo(() => {
    if (!readProvider) return null;
    return getMembershipNftContractIfConfigured(readProvider);
  }, [readProvider]);

  const signedContract = useMemo(() => {
    if (!signer) return null;
    return getMembershipNftContractIfConfigured(signer);
  }, [signer]);

  return { readContract, signedContract, isConfigured };
}
