// import { WalletButton } from '@/components/wallet-button';

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24">
//       <div className="max-w-5xl w-full text-center">
//         <h1 className="text-4xl font-bold mb-8">
//           My DApp
//         </h1>
//         <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
//           A Web3 application built with Cradle
//         </p>
        
//         <div className="flex justify-center">
//           <WalletButton />
//         </div>
//       </div>
//     </main>
//   );
// }
import { MembershipCard } from '@/components/membership/MembershipCard';
import { WalletConnect } from '@/components/membership/WalletConnect';
import { ERC721InteractionPanel } from '@/lib/erc721-stylus/src';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            NFT Membership Access
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Connect wallet, mint membership, and manage access.
          </p>
        </div>

        <div className="space-y-4">
          <WalletConnect />
          <MembershipCard />
        </div>

        <div className="mt-8">
          <ERC721InteractionPanel />
        </div>
      </div>
    </main>
  );
}