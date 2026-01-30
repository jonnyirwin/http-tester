import { useState } from 'react'
import { CollectionList } from '../collections/CollectionList'
import { HistoryList } from '../history/HistoryList'

type SidebarTab = 'collections' | 'history'

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('collections')

  return (
    <div className="h-full flex flex-col bg-app-sidebar border-r border-app-border">
      <div className="flex border-b border-app-border">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'collections'
              ? 'text-app-text border-b-2 border-app-accent'
              : 'text-app-text-muted hover:text-app-text'
          }`}
        >
          Collections
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-app-text border-b-2 border-app-accent'
              : 'text-app-text-muted hover:text-app-text'
          }`}
        >
          History
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'collections' ? <CollectionList /> : <HistoryList />}
      </div>
    </div>
  )
}
