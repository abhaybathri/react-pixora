import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, message: '' }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || 'Unknown error' }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-8 text-center">
          <div className="text-6xl">😵</div>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{this.state.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
