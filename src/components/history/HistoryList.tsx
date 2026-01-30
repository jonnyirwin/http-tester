import { useHistoryStore } from '../../stores/historyStore'
import { useRequestStore } from '../../stores/requestStore'
import { getStatusColorClass } from '../../utils/httpStatusCodes'
import type { HttpMethod } from '../../types'

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-green-400',
  POST: 'text-yellow-400',
  PUT: 'text-blue-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
  HEAD: 'text-purple-400',
  OPTIONS: 'text-pink-400',
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

export function HistoryList() {
  const { history, clearHistory, removeFromHistory } = useHistoryStore()
  const { loadRequest } = useRequestStore()

  const handleLoadRequest = (entry: typeof history[0]) => {
    loadRequest(entry.request)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-app-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">History</h3>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all history?')) {
                clearHistory()
              }
            }}
            className="text-xs text-app-text-muted hover:text-red-400"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center text-app-text-muted text-sm">
            <p>No history yet</p>
            <p className="mt-1 text-xs">Your requests will appear here</p>
          </div>
        ) : (
          <div className="py-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-app-panel"
                onClick={() => handleLoadRequest(entry)}
              >
                <span className={`text-xs font-semibold w-10 ${methodColors[entry.method]}`}>
                  {entry.method}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" title={entry.url}>
                    {entry.url.replace(/^https?:\/\//, '')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-app-text-muted">
                    <span>{formatTimestamp(entry.timestamp)}</span>
                    {entry.status && (
                      <span className={getStatusColorClass(entry.status)}>
                        {entry.status}
                      </span>
                    )}
                    <span>{entry.duration}ms</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFromHistory(entry.id)
                  }}
                  className="p-1 text-app-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
