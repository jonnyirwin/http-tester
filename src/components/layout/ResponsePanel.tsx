import { useResponseStore } from '../../stores/responseStore'
import { StatusBar } from '../response/StatusBar'
import { ResponseHeaders } from '../response/ResponseHeaders'
import { ResponseBody } from '../response/ResponseBody'
import { CookiesViewer } from '../response/CookiesViewer'
import { Tabs } from '../common/Tabs'

const responseTabs = [
  { id: 'body', label: 'Body' },
  { id: 'headers', label: 'Headers' },
  { id: 'cookies', label: 'Cookies' },
]

export function ResponsePanel() {
  const { response, activeTab, setActiveTab, clearResponse } = useResponseStore()

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center bg-app-panel text-app-text-muted">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <p className="text-lg">Send a request to see the response</p>
          <p className="text-sm mt-1">Click Send or press Ctrl+Enter</p>
        </div>
      </div>
    )
  }

  const headersCount = response.headers ? Object.keys(response.headers).length : 0

  const tabs = responseTabs.map((tab) => {
    if (tab.id === 'headers') return { ...tab, count: headersCount }
    return tab
  })

  return (
    <div className="h-full flex flex-col bg-app-panel">
      <div className="flex items-center justify-between pr-2">
        <StatusBar response={response} />
        <button
          onClick={clearResponse}
          className="p-1 text-app-text-muted hover:text-app-text"
          title="Clear response"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {response.success && (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(t) => setActiveTab(t as 'body' | 'headers' | 'cookies')} />
          <div className="flex-1 overflow-hidden">
            {activeTab === 'body' && <ResponseBody body={response.body || ''} />}
            {activeTab === 'headers' && <ResponseHeaders headers={response.headers || {}} />}
            {activeTab === 'cookies' && <CookiesViewer cookies={response.cookies || ''} />}
          </div>
        </>
      )}
    </div>
  )
}
