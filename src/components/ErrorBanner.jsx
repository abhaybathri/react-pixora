export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="text-5xl">📷</div>
      <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Something went wrong</p>
      <p className="text-slate-400 dark:text-slate-500 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
