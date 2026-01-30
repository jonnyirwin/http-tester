import { useState } from 'react'
import { useCollectionsStore } from '../../stores/collectionsStore'
import { useRequestStore } from '../../stores/requestStore'
import { Modal } from '../common/Modal'
import type { RequestConfig, HttpMethod } from '../../types'

const methodColors: Record<HttpMethod, string> = {
  GET: 'text-green-400',
  POST: 'text-yellow-400',
  PUT: 'text-blue-400',
  PATCH: 'text-orange-400',
  DELETE: 'text-red-400',
  HEAD: 'text-purple-400',
  OPTIONS: 'text-pink-400',
}

export function CollectionList() {
  const {
    collections,
    selectedCollectionId,
    selectedRequestId,
    createCollection,
    deleteCollection,
    selectRequest,
    removeRequestFromCollection,
    exportCollection,
    importCollection,
  } = useCollectionsStore()
  const { loadRequest } = useRequestStore()

  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDesc, setNewCollectionDesc] = useState('')
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())

  const toggleCollection = (id: string) => {
    setExpandedCollections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim(), newCollectionDesc.trim())
      setNewCollectionName('')
      setNewCollectionDesc('')
      setIsNewCollectionModalOpen(false)
    }
  }

  const handleSelectRequest = (collectionId: string, request: RequestConfig) => {
    selectRequest(collectionId, request.id)
    loadRequest(request)
  }

  const handleExport = async (id: string) => {
    await exportCollection(id)
  }

  const handleImport = async () => {
    await importCollection()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-app-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Collections</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleImport}
              className="p-1.5 text-app-text-muted hover:text-app-text transition-colors"
              title="Import collection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button
              onClick={() => setIsNewCollectionModalOpen(true)}
              className="p-1.5 text-app-text-muted hover:text-app-text transition-colors"
              title="New collection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {collections.length === 0 ? (
          <div className="p-4 text-center text-app-text-muted text-sm">
            <p>No collections yet</p>
            <button
              onClick={() => setIsNewCollectionModalOpen(true)}
              className="mt-2 text-app-accent hover:text-app-accent-hover"
            >
              Create your first collection
            </button>
          </div>
        ) : (
          <div className="py-2">
            {collections.map((collection) => (
              <div key={collection.id}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-app-panel ${
                    selectedCollectionId === collection.id && !selectedRequestId
                      ? 'bg-app-panel'
                      : ''
                  }`}
                  onClick={() => toggleCollection(collection.id)}
                >
                  <svg
                    className={`w-4 h-4 text-app-text-muted transition-transform ${
                      expandedCollections.has(collection.id) ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="flex-1 text-sm truncate">{collection.name}</span>
                  <span className="text-xs text-app-text-muted">
                    {collection.requests.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExport(collection.id)
                    }}
                    className="p-1 text-app-text-muted hover:text-app-text opacity-0 group-hover:opacity-100"
                    title="Export"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this collection?')) {
                        deleteCollection(collection.id)
                      }
                    }}
                    className="p-1 text-app-text-muted hover:text-red-400"
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {expandedCollections.has(collection.id) && (
                  <div className="ml-6">
                    {collection.requests.map((request) => (
                      <div
                        key={request.id}
                        className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-app-panel ${
                          selectedRequestId === request.id ? 'bg-app-panel' : ''
                        }`}
                        onClick={() => handleSelectRequest(collection.id, request)}
                      >
                        <span className={`text-xs font-semibold w-12 ${methodColors[request.method as HttpMethod]}`}>
                          {request.method}
                        </span>
                        <span className="flex-1 text-sm truncate">{request.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Remove this request?')) {
                              removeRequestFromCollection(collection.id, request.id)
                            }
                          }}
                          className="p-1 text-app-text-muted hover:text-red-400 opacity-0 hover:opacity-100"
                          title="Remove"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {collection.requests.length === 0 && (
                      <div className="px-3 py-2 text-xs text-app-text-muted">
                        No requests in this collection
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isNewCollectionModalOpen}
        onClose={() => setIsNewCollectionModalOpen(false)}
        title="New Collection"
        footer={
          <>
            <button
              onClick={() => setIsNewCollectionModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleCreateCollection} className="btn btn-primary">
              Create
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-app-text-muted mb-1">Name</label>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="My Collection"
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-app-text-muted mb-1">
              Description (optional)
            </label>
            <textarea
              value={newCollectionDesc}
              onChange={(e) => setNewCollectionDesc(e.target.value)}
              placeholder="Describe your collection..."
              rows={3}
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
