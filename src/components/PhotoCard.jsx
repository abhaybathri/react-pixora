import { useState } from 'react'
import { downloadImage } from '../utils/download'

export default function PhotoCard({ photo, onClick, onAuthorClick }) {
  const [loaded, setLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const thumbUrl = `https://picsum.photos/id/${photo.id}/400/300`

  async function handleDownload(e) {
    e.stopPropagation()
    if (downloading) return
    setDownloading(true)
    await downloadImage(photo.download_url, photo.author, photo.id)
    setDownloading(false)
  }

  return (
    <div className="photo-item">
      <div
        className="group relative rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        onClick={() => onClick(photo)}
        role="button"
        tabIndex={0}
        aria-label={`View photo by ${photo.author}`}
        onKeyDown={e => e.key === 'Enter' && onClick(photo)}
      >
        {/* Skeleton */}
        {!loaded && !imgError && <div className="skeleton w-full h-52" />}

        {/* Image */}
        {!imgError ? (
          <img
            src={thumbUrl}
            alt={`Photo by ${photo.author}`}
            className={`w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-52 flex items-center justify-center text-slate-400 text-sm gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Failed to load
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <button
            className="text-white text-sm font-semibold truncate text-left hover:underline w-fit"
            onClick={e => { e.stopPropagation(); onAuthorClick(photo.author) }}
            aria-label={`View all photos by ${photo.author}`}
          >
            {photo.author}
          </button>
          <p className="text-slate-300 text-xs">{photo.width} × {photo.height}</p>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-white p-1.5 rounded-lg hover:bg-indigo-500 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={`Download photo by ${photo.author}`}
          title="Download"
        >
          {downloading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
