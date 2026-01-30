import { useRequestStore } from '../../stores/requestStore'
import type { AuthConfig } from '../../types'

const authTypes = [
  { value: 'none', label: 'No Auth' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'apikey', label: 'API Key' },
] as const

export function AuthEditor() {
  const { request, setAuth } = useRequestStore()
  const auth = request.auth

  const updateAuth = (updates: Partial<AuthConfig>) => {
    setAuth({ ...auth, ...updates })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        {authTypes.map((type) => (
          <label key={type.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="authType"
              value={type.value}
              checked={auth.type === type.value}
              onChange={(e) => updateAuth({ type: e.target.value as AuthConfig['type'] })}
              className="text-app-accent focus:ring-app-accent"
            />
            <span className="text-sm">{type.label}</span>
          </label>
        ))}
      </div>

      {auth.type === 'basic' && (
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm text-app-text-muted mb-1">Username</label>
            <input
              type="text"
              value={auth.username || ''}
              onChange={(e) => updateAuth({ username: e.target.value })}
              placeholder="Enter username"
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-app-text-muted mb-1">Password</label>
            <input
              type="password"
              value={auth.password || ''}
              onChange={(e) => updateAuth({ password: e.target.value })}
              placeholder="Enter password"
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
            />
          </div>
        </div>
      )}

      {auth.type === 'bearer' && (
        <div className="max-w-md">
          <label className="block text-sm text-app-text-muted mb-1">Token</label>
          <input
            type="text"
            value={auth.token || ''}
            onChange={(e) => updateAuth({ token: e.target.value })}
            placeholder="Enter bearer token"
            className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
          />
        </div>
      )}

      {auth.type === 'apikey' && (
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm text-app-text-muted mb-1">Key Name</label>
            <input
              type="text"
              value={auth.apiKeyName || ''}
              onChange={(e) => updateAuth({ apiKeyName: e.target.value })}
              placeholder="e.g. X-API-Key"
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-app-text-muted mb-1">Key Value</label>
            <input
              type="text"
              value={auth.apiKey || ''}
              onChange={(e) => updateAuth({ apiKey: e.target.value })}
              placeholder="Enter API key"
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-app-text-muted mb-1">Add to</label>
            <select
              value={auth.apiKeyIn || 'header'}
              onChange={(e) => updateAuth({ apiKeyIn: e.target.value as 'header' | 'query' })}
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
            >
              <option value="header">Header</option>
              <option value="query">Query Params</option>
            </select>
          </div>
        </div>
      )}

      {auth.type === 'none' && (
        <p className="text-app-text-muted text-sm">
          This request does not use any authorization.
        </p>
      )}
    </div>
  )
}
