'use client';

import { BuyMembershipButton } from './BuyMembershipButton';

export function MembershipCard() {
  return (
    <section className="w-full rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Membership Actions
      </h2>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Purchase a membership NFT and unlock premium access.
      </p>

      <BuyMembershipButton />

      <div className="mt-6 grid gap-3 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Membership Status</p>
        <div className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900">
          <span className="text-zinc-500 dark:text-zinc-400">Status</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-200">Not Active (placeholder)</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900">
          <span className="text-zinc-500 dark:text-zinc-400">Expiry Date</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-200">-- (placeholder)</span>
        </div>
      </div>
    </section>
  );
}
