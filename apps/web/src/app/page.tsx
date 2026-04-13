import { Hero } from '@/components/membership/Hero';
import { MembershipCard } from '@/components/membership/MembershipCard';
import { ERC721InteractionPanel } from '@/lib/erc721-stylus/src';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background decorative grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]"
      />

      {/* Page content */}
      <div className="relative mx-auto w-full max-w-2xl px-4 pb-20 pt-4">

        {/* ── Hero Section ──────────────────────────────────── */}
        <Hero />

        {/* ── Membership Card (center focus) ───────────────── */}
        <div className="mt-2 mb-8">
          <MembershipCard />
        </div>

        {/* ── Advanced Interaction Panel (existing) ─────────── */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <p className="mb-4 text-[11px] font-bold tracking-[0.2em] uppercase text-forge-muted text-center">
            Advanced Contract Interactions
          </p>
          <ERC721InteractionPanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-6 text-center text-xs text-forge-muted">
        <p>
          NFT Membership · Built on Ethereum · ERC-721 Standard
        </p>
      </footer>
    </main>
  );
}