import { useState, useMemo } from 'react'
import { useTheme } from './hooks/useTheme'
import { usePhotos } from './hooks/usePhotos'
import Navbar from './components/Navbar'
import PhotoCard from './components/PhotoCard'
import Modal from './components/Modal'
import Pagination from './components/Pagination'
import ErrorBanner from './components/ErrorBanner'
import SkeletonGrid from './components/SkeletonGrid'
import AuthorsSection from './components/AuthorsSection'
import './App.css'

export default function App() {
  const { dark, toggle } = useTheme()
  const { allPhotos, photos, page, totalPages, loading, error, hasMore, goNext, goPrev, retry } = usePhotos()
  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState(null)
  const [selected, setSelected] = useState(null)

  function handleSearch(val) {
    setSearch(val)
    if (val) setAuthorFilter(null)
  }

  function handleAuthorClick(author) {
    setAuthorFilter(prev => prev === author ? null : author)
    setSearch('')
  }

  function clearFilter() {
    setAuthorFilter(null)
    setSearch('')
  }

  // When filtered/searched → search ALL photos; otherwise show current page
  const displayPhotos = useMemo(() => {
    if (authorFilter) return allPhotos.filter(p => p.author === authorFilter)
    if (search.trim()) return allPhotos.filter(p =>
      p.author.toLowerCase().includes(search.toLowerCase())
    )
    return photos
  }, [allPhotos, photos, search, authorFilter])

  const isFiltered = !!(authorFilter || search.trim())
  const activeFilterLabel = authorFilter || (search.trim() ? `"${search}"` : null)

  const selectedIndex = selected ? displayPhotos.findIndex(p => p.id === selected.id) : -1

  function openModal(photo) {
    setSelected(photo)
  }

  function closeModal() {
    setSelected(null)
  }

  function prevPhoto() {
    if (selectedIndex > 0) setSelected(displayPhotos[selectedIndex - 1])
  }

  function nextPhoto() {
    if (selectedIndex < displayPhotos.length - 1) setSelected(displayPhotos[selectedIndex + 1])
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar dark={dark} onToggle={toggle} search={search} onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Free Photos for Everyone
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {allPhotos.length > 0
              ? `${allPhotos.length} stunning high-quality images`
              : 'Browse thousands of stunning high-quality images'}
          </p>
        </div>

        {/* Authors strip — always uses full dataset */}
        {!loading && !error && allPhotos.length > 0 && (
          <AuthorsSection
            photos={allPhotos}
            activeAuthor={authorFilter}
            onSelect={handleAuthorClick}
          />
        )}

        {/* Active filter badge */}
        {activeFilterLabel && !loading && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {displayPhotos.length} photo{displayPhotos.length !== 1 ? 's' : ''} for
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-full">
              {activeFilterLabel}
              <button
                onClick={clearFilter}
                aria-label="Clear filter"
                className="hover:text-indigo-900 dark:hover:text-white ml-1 leading-none"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* Screen-reader live region for loading/error */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {loading && 'Loading photos...'}
          {error && `Error: ${error}`}
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid count={12} />
        ) : error ? (
          <ErrorBanner message={error} onRetry={retry} />
        ) : displayPhotos.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">No photos found for {activeFilterLabel}</p>
          </div>
        ) : (
          <div className="photo-grid">
            {displayPhotos.map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={openModal}
                onAuthorClick={handleAuthorClick}
              />
            ))}
          </div>
        )}

        {/* Pagination — only when not filtering/searching */}
        {!error && !loading && !isFiltered && (
          <Pagination
            page={page}
            totalPages={totalPages}
            loading={loading}
            hasMore={hasMore}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
        Photos provided by{' '}
        <a
          href="https://picsum.photos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:underline"
        >
          Lorem Picsum
        </a>
        {' '}· Built with React + Vite
      </footer>

      {/* Lightbox */}
      {selected && (
        <Modal
          photo={selected}
          onClose={closeModal}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          isFirst={selectedIndex === 0}
          isLast={selectedIndex === displayPhotos.length - 1}
        />
      )}
    </div>
  )
}
