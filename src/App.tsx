import { useEffect, useState, useCallback } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { MainPanel } from './components/layout/MainPanel'
import { ResponsePanel } from './components/layout/ResponsePanel'
import { EnvSelector } from './components/environment/EnvSelector'
import { useRequestStore } from './stores/requestStore'
import { useResponseStore } from './stores/responseStore'
import { useCollectionsStore } from './stores/collectionsStore'
import { useEnvironmentStore } from './stores/environmentStore'
import { useHistoryStore } from './stores/historyStore'
import { resolveVariables } from './utils/variableResolver'
import { runPreRequestScript } from './utils/scriptRunner'

function App() {
  const { request, isLoading, setIsLoading } = useRequestStore()
  const { setResponse } = useResponseStore()
  const { loadCollections } = useCollectionsStore()
  const { loadEnvironments, getActiveVariables } = useEnvironmentStore()
  const { loadHistory, addToHistory } = useHistoryStore()

  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)

  // Load persisted data on mount
  useEffect(() => {
    loadCollections()
    loadEnvironments()
    loadHistory()
  }, [loadCollections, loadEnvironments, loadHistory])

  // Handle sidebar resize
  const handleMouseDown = () => {
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.max(200, Math.min(500, e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleSendRequest = useCallback(async () => {
    if (!request.url.trim() || isLoading) return

    setIsLoading(true)
    setResponse(null)

    try {
      // Get environment variables
      let variables = getActiveVariables()

      // Run pre-request script
      if (request.preRequestScript) {
        const scriptResult = runPreRequestScript(request.preRequestScript, request, variables)
        if (!scriptResult.success) {
          setResponse({
            success: false,
            error: `Pre-request script error: ${scriptResult.error}`,
            duration: 0,
          })
          setIsLoading(false)
          return
        }
        variables = scriptResult.updatedVariables
      }

      // Build URL with query params
      let url = resolveVariables(request.url, variables)
      const enabledParams = request.queryParams.filter((p) => p.enabled && p.key)
      if (enabledParams.length > 0) {
        const searchParams = new URLSearchParams()
        enabledParams.forEach((p) => {
          searchParams.append(p.key, resolveVariables(p.value, variables))
        })
        const separator = url.includes('?') ? '&' : '?'
        url = `${url}${separator}${searchParams.toString()}`
      }

      // Build headers
      const headers: Record<string, string> = {}
      request.headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => {
          headers[h.key] = resolveVariables(h.value, variables)
        })

      // Add auth headers
      if (request.auth.type === 'basic' && request.auth.username) {
        const credentials = btoa(`${request.auth.username}:${request.auth.password || ''}`)
        headers['Authorization'] = `Basic ${credentials}`
      } else if (request.auth.type === 'bearer' && request.auth.token) {
        headers['Authorization'] = `Bearer ${resolveVariables(request.auth.token, variables)}`
      } else if (request.auth.type === 'apikey' && request.auth.apiKey && request.auth.apiKeyName) {
        if (request.auth.apiKeyIn === 'header') {
          headers[request.auth.apiKeyName] = resolveVariables(request.auth.apiKey, variables)
        } else {
          const separator = url.includes('?') ? '&' : '?'
          url = `${url}${separator}${request.auth.apiKeyName}=${encodeURIComponent(resolveVariables(request.auth.apiKey, variables))}`
        }
      }

      // Add content-type header for body
      if (request.bodyType !== 'none' && request.body) {
        if (request.bodyType === 'json' && !headers['Content-Type']) {
          headers['Content-Type'] = 'application/json'
        } else if (request.bodyType === 'xml' && !headers['Content-Type']) {
          headers['Content-Type'] = 'application/xml'
        } else if (request.bodyType === 'form-urlencoded' && !headers['Content-Type']) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
      }

      // Prepare body
      const body =
        request.bodyType !== 'none' && request.body
          ? resolveVariables(request.body, variables)
          : undefined

      // Send request through IPC
      const response = await window.api.sendRequest({
        method: request.method,
        url,
        headers,
        body,
      })

      setResponse(response)

      // Add to history
      addToHistory(request, response.status, response.duration)
    } catch (error) {
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }, [request, isLoading, setIsLoading, setResponse, getActiveVariables, addToHistory])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSendRequest()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSendRequest])

  return (
    <div className="h-screen flex flex-col bg-app-bg text-app-text overflow-hidden">
      {/* Top bar */}
      <div className="h-10 flex items-center justify-between px-4 bg-app-sidebar border-b border-app-border drag-region">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm">HTTP Tester</span>
        </div>
        <EnvSelector />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div style={{ width: sidebarWidth }} className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Resize handle */}
        <div
          className="w-1 bg-app-border hover:bg-app-accent cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Request panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 min-w-0 border-r border-app-border">
              <MainPanel onSend={handleSendRequest} isLoading={isLoading} />
            </div>
            <div className="flex-1 min-w-0">
              <ResponsePanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
