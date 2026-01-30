import { useRequestStore } from '../../stores/requestStore'
import { HTTP_METHODS, type HttpMethod } from '../../types'

interface UrlBarProps {
  onSend: () => void
  isLoading: boolean
}

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-green-400',
  POST: 'text-yellow-400',
  PUT: 'text-blue-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
  HEAD: 'text-purple-400',
  OPTIONS: 'text-pink-400',
}

export function UrlBar({ onSend, isLoading }: UrlBarProps) {
  const { request, setMethod, setUrl } = useRequestStore()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSend()
    }
  }

  return (
    <div className="flex gap-2">
      <select
        value={request.method}
        onChange={(e) => setMethod(e.target.value as HttpMethod)}
        className={`px-3 py-2 bg-app-panel border border-app-border rounded font-semibold ${methodColors[request.method]}`}
      >
        {HTTP_METHODS.map((method) => (
          <option key={method} value={method} className="text-app-text">
            {method}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={request.url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter URL or paste text"
        className="flex-1 px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
      />

      <button
        onClick={onSend}
        disabled={isLoading || !request.url.trim()}
        className={`px-6 py-2 rounded font-semibold transition-colors ${
          isLoading || !request.url.trim()
            ? 'bg-app-border text-app-text-muted cursor-not-allowed'
            : 'bg-app-accent text-white hover:bg-app-accent-hover'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending
          </span>
        ) : (
          'Send'
        )}
      </button>
    </div>
  )
}
