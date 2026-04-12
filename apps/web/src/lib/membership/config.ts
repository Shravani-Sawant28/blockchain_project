import { ethers } from 'ethers';

/**
 * Checksummed address from `NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS`, or null if unset/invalid.
 */
export function getMembershipNftAddressOrNull(): string | null {
  const raw = process.env.NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS?.trim();
  if (!raw) return null;
  try {
    return ethers.getAddress(raw);
  } catch {
    return null;
  }
}

/**
 * Deployed Membership NFT contract address (required for on-chain calls).
 * Replace the env value after you deploy; ABI is `membership-nft.abi.json` in this folder.
 */
export function getMembershipNftAddress(): string {
  const addr = getMembershipNftAddressOrNull();
  if (!addr) {
    throw new Error(
      'Set NEXT_PUBLIC_MEMBERSHIP_NFT_ADDRESS in .env.local to your deployed contract address.',
    );
  }
  return addr;
}
