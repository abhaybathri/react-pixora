export default function Pagination({ page, totalPages, loading, hasMore, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center gap-6 py-10">
      <button
        onClick={onPrev}
        disabled={page <= 1 || loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        Prev
      </button>

      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        Page <span className="text-slate-900 dark:text-white font-bold text-lg">{page}</span>
        {totalPages > 0 && <span> of {totalPages}</span>}
      </span>

      <button
        onClick={onNext}
        disabled={!hasMore || loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  )
}
