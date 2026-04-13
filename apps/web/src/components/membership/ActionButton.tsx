'use client';

type ActionButtonProps = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

export function ActionButton({
  label,
  loadingLabel = 'Processing...',
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary',
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      id="action-btn"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'glow-btn relative inline-flex items-center justify-center gap-3 rounded-xl px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-forge-bg disabled:cursor-not-allowed disabled:opacity-40',
        isPrimary
          ? 'bg-gradient-to-r from-primary-600 to-accent-magenta text-white shadow-lg shadow-primary-900/40 hover:from-primary-500 hover:to-accent-magenta hover:shadow-primary-700/50 hover:-translate-y-0.5 active:translate-y-0'
          : 'border border-primary-500/40 bg-primary-900/20 text-primary-300 hover:bg-primary-900/40 hover:border-primary-400/60',
      ].join(' ')}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin-slow shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {!loading && isPrimary && (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
      )}
      <span>{loading ? loadingLabel : label}</span>
    </button>
  );
}

