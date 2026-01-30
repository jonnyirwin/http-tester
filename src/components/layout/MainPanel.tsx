import { useState } from 'react'
import { UrlBar } from '../request/UrlBar'
import { HeadersEditor } from '../request/HeadersEditor'
import { QueryParamsEditor } from '../request/QueryParamsEditor'
import { BodyEditor } from '../request/BodyEditor'
import { AuthEditor } from '../request/AuthEditor'
import { PreRequestScript } from '../request/PreRequestScript'
import { SaveRequestModal } from '../collections/SaveRequestModal'
import { Tabs } from '../common/Tabs'
import { useRequestStore } from '../../stores/requestStore'

interface MainPanelProps {
  onSend: () => void
  isLoading: boolean
}

const requestTabs = [
  { id: 'params', label: 'Params' },
  { id: 'headers', label: 'Headers' },
  { id: 'body', label: 'Body' },
  { id: 'auth', label: 'Auth' },
  { id: 'scripts', label: 'Pre-request Script' },
]

export function MainPanel({ onSend, isLoading }: MainPanelProps) {
  const { request, resetRequest } = useRequestStore()
  const [activeTab, setActiveTab] = useState('params')
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  const enabledParams = request.queryParams.filter((p) => p.enabled && p.key).length
  const enabledHeaders = request.headers.filter((h) => h.enabled && h.key).length

  const tabs = requestTabs.map((tab) => {
    if (tab.id === 'params') return { ...tab, count: enabledParams }
    if (tab.id === 'headers') return { ...tab, count: enabledHeaders }
    return tab
  })

  return (
    <div className="h-full flex flex-col bg-app-panel">
      <div className="p-4 border-b border-app-border">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={request.name}
            readOnly
            className="flex-1 bg-transparent text-lg font-semibold focus:outline-none"
            title={request.name}
          />
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="btn btn-secondary text-xs"
          >
            Save
          </button>
          <button
            onClick={() => {
              if (confirm('Clear current request?')) {
                resetRequest()
              }
            }}
            className="btn btn-secondary text-xs"
          >
            New
          </button>
        </div>
        <UrlBar onSend={onSend} isLoading={isLoading} />
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'params' && <QueryParamsEditor />}
        {activeTab === 'headers' && <HeadersEditor />}
        {activeTab === 'body' && <BodyEditor />}
        {activeTab === 'auth' && <AuthEditor />}
        {activeTab === 'scripts' && <PreRequestScript />}
      </div>

      <SaveRequestModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  )
}
