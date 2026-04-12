import { Contract, type ContractRunner } from 'ethers';
import membershipNftAbi from './membership-nft.abi.json';
import { getMembershipNftAddress, getMembershipNftAddressOrNull } from './config';

export const MEMBERSHIP_NFT_ABI = membershipNftAbi;

/**
 * Typed `ethers.Contract` bound to your Membership NFT ABI and env address.
 * Pass a `BrowserProvider` for reads, or a `Signer` for transactions (e.g. `mintMembership`).
 */
export function getMembershipNftContract(runner: ContractRunner): Contract {
  return new Contract(getMembershipNftAddress(), MEMBERSHIP_NFT_ABI, runner);
}

/** Same as `getMembershipNftContract` but returns null if the env address is not set. */
export function getMembershipNftContractIfConfigured(runner: ContractRunner): Contract | null {
  const addr = getMembershipNftAddressOrNull();
  if (!addr) return null;
  return new Contract(addr, MEMBERSHIP_NFT_ABI, runner);
}
