import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange, className = 'mt-8' }) {
  if (totalPages <= 1) return null

  function goTo(nextPage) {
    onPageChange(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-soft transition-colors hover:text-accent disabled:opacity-40 disabled:shadow-none"
      >
        <ChevronLeft size={18} />
      </button>

      <span className="text-sm font-medium text-muted tabular-nums">
        Page {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label="Page suivante"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-soft transition-colors hover:text-accent disabled:opacity-40 disabled:shadow-none"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
