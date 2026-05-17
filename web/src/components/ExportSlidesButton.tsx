type ExportSlidesButtonProps = {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function ExportSlidesButton({onClick, loading = false, disabled = false}: ExportSlidesButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      className="text-muted hover:text-brand hover:bg-sunshine-wash inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50"
    >
      {loading ? (
        <>
          <span className="bg-cta-accent inline-block size-1.5 animate-pulse rounded-full" aria-hidden />
          Generating slides…
        </>
      ) : (
        <>
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
          Export as slides
        </>
      )}
    </button>
  )
}
