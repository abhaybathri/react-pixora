import { useState, useEffect } from 'react'

const PAGE_SIZE = 20
const TOTAL_PAGES = 10

// Fisher-Yates shuffle — returns a new shuffled array
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Cache the raw fetch result (not shuffled) so we don't re-fetch on re-mount.
// Each page load gets its own shuffle from the same raw data.
let rawCache = null
let fetchPromise = null

async function fetchAllPhotos() {
  if (rawCache) return rawCache
  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)
    const results = await Promise.all(
      pages.map(p =>
        fetch(`https://picsum.photos/v2/list?page=${p}&limit=30`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => [])
      )
    )
    rawCache = results.flat()
    return rawCache
  })()

  return fetchPromise
}

export function usePhotos() {
  const [allPhotos, setAllPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchAllPhotos()
      .then(data => {
        // Shuffle on every mount (i.e. every page load) — raw data is cached,
        // but the order is always fresh and random.
        setAllPhotos(shuffle(data))
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Failed to load photos')
        setLoading(false)
      })
  }, [])

  const totalPages = Math.ceil(allPhotos.length / PAGE_SIZE)
  const pagePhotos = allPhotos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goNext = () => setPage(p => Math.min(p + 1, totalPages))
  const goPrev = () => setPage(p => Math.max(1, p - 1))
  const retry = () => {
    rawCache = null
    fetchPromise = null
    setLoading(true)
    setError(null)
    fetchAllPhotos()
      .then(data => { setAllPhotos(shuffle(data)); setLoading(false) })
      .catch(err => { setError(err.message || 'Failed to load'); setLoading(false) })
  }

  return {
    allPhotos,       // full dataset — for authors strip & global search
    photos: pagePhotos,  // current page slice — for the grid
    page,
    totalPages,
    loading,
    error,
    hasMore: page < totalPages,
    goNext,
    goPrev,
    retry,
  }
}
