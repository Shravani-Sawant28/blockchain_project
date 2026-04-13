'use client';

export function Hero() {
  return (
    <header className="relative text-center py-14 px-4 animate-fade-in-up">
      {/* Decorative top glow orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -translate-y-1/2 flex justify-center"
      >
        <div className="h-56 w-56 rounded-full bg-primary-600/20 blur-3xl" />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-900/20 px-4 py-1.5 text-xs font-medium tracking-widest text-primary-300 uppercase mb-6 animate-fade-in-up">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
        On-Chain · ERC-721 · Trustless
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-4 animate-fade-in-up-delay">
        <span className="shimmer-text">NFT-Based</span>{' '}
        <span className="text-forge-text">Membership Access</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-forge-muted font-light max-w-2xl mx-auto mb-6 animate-fade-in-up-delay">
        Own your membership. Unlock premium features with{' '}
        <span className="text-primary-400 font-medium">blockchain-secured access.</span>
      </p>

      {/* 3-pillar description */}
      <div className="mx-auto mt-8 flex flex-wrap justify-center gap-4 max-w-xl animate-fade-in-up-delay-2">
        {[
          { icon: '🚫', label: 'No Subscriptions', desc: 'Pay once, own forever' },
          { icon: '💎', label: 'NFT Ownership', desc: 'Your key, your asset' },
          { icon: '🔗', label: 'Decentralized Access', desc: 'Trustless & verifiable' },
        ].map(({ icon, label, desc }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-center w-[140px] hover:border-primary-500/30 hover:bg-primary-900/10 transition-all duration-300"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-semibold text-forge-text">{label}</span>
            <span className="text-xs text-forge-muted">{desc}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
