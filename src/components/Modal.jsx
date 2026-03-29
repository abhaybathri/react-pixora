import { useEffect, useRef, useState } from 'react'
import { downloadImage } from '../utils/download'

export default function Modal({ photo, onClose, onPrev, onNext, isFirst, isLast }) {
  const [loaded, setLoaded] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const closeRef = useRef(null)

  // Reset loaded state when photo changes
  useEffect(() => { setLoaded(false) }, [photo?.id])

  // Focus the close button when modal opens (focus management)
  useEffect(() => { closeRef.current?.focus() }, [])

  // Keyboard navigation + focus trap
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight' && !isLast) onNext()
      if (e.key === 'ArrowLeft' && !isFirst) onPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onNext, onPrev, isFirst, isLast])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  if (!photo) return null

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)
    await downloadImage(photo.download_url, photo.author, photo.id)
    setDownloading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-author"
    >
      <div
        className="relative max-w-5xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close modal (Esc)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous photo (←)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={isLast}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next photo (→)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        {/* Image */}
        <div className="relative bg-slate-100 dark:bg-slate-800 min-h-64 flex items-center justify-center">
          {!loaded && <div className="skeleton w-full h-96" />}
          <img
            key={photo.id}
            src={`https://picsum.photos/id/${photo.id}/1200/800`}
            alt={`Photo by ${photo.author}`}
            className={`w-full max-h-[70vh] object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* Info bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900">
          <div>
            <p id="modal-author" className="font-semibold text-slate-900 dark:text-white">{photo.author}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{photo.width} × {photo.height} px</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
