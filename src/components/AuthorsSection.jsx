export default function AuthorsSection({ photos, activeAuthor, onSelect }) {
  // Deduplicate authors, keep first photo per author as avatar
  const authors = []
  const seen = new Set()
  for (const p of photos) {
    if (!seen.has(p.author)) {
      seen.add(p.author)
      authors.push(p)
    }
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Browse by Author</h2>
        {activeAuthor && (
          <button
            onClick={() => onSelect(null)}
            className="text-sm text-indigo-500 hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {authors.map(p => {
          const isActive = activeAuthor === p.author
          return (
            <button
              key={p.id}
              onClick={() => onSelect(isActive ? null : p.author)}
              className={`flex flex-col items-center gap-1.5 shrink-0 group transition-all`}
              aria-label={`Filter by ${p.author}`}
              aria-pressed={isActive}
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden ring-2 transition-all ${isActive ? 'ring-indigo-500 scale-110' : 'ring-transparent group-hover:ring-indigo-400'}`}>
                <img
                  src={`https://picsum.photos/id/${p.id}/80/80`}
                  alt={p.author}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className={`text-xs font-medium max-w-[64px] truncate transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                {p.author.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
