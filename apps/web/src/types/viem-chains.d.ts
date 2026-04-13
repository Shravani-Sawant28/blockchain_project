
import type { Chain } from 'viem';

declare module 'viem/chains' {
  export const localhostHardhat: Chain;
}
