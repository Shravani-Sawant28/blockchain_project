'use client';

type ActionButtonProps = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function ActionButton({
  label,
  loadingLabel = 'Processing...',
  loading = false,
  disabled = false,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
