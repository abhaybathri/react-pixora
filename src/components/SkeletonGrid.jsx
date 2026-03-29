export default function SkeletonGrid({ count = 12 }) {
  return (
    <div className="photo-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="photo-item">
          <div className="rounded-2xl overflow-hidden">
            <div
              className="skeleton w-full"
              style={{ height: `${180 + (i % 3) * 60}px` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
