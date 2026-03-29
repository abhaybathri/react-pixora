/**
 * Sanitize a string to be safe as a filename across all OS.
 */
function sanitizeFilename(name) {
  return name
    .replace(/[/\\:*?"<>|]/g, '-')  // illegal chars
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

/**
 * Downloads a cross-origin image as a blob and triggers a real file save.
 * Returns true on success, false on failure.
 */
export async function downloadImage(url, author, id) {
  const filename = `${sanitizeFilename(author)}-${id}.jpg`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // Delay revoke so browser has time to start the download
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
    return true
  } catch {
    // Fallback: open full-res in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
    return false
  }
}
