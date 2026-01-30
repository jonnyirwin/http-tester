import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useCollectionsStore } from '../../stores/collectionsStore'
import { useRequestStore } from '../../stores/requestStore'

interface SaveRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SaveRequestModal({ isOpen, onClose }: SaveRequestModalProps) {
  const { collections, addRequestToCollection, updateRequestInCollection, selectedCollectionId, selectedRequestId } = useCollectionsStore()
  const { request, setName, setDescription } = useRequestStore()

  const [selectedCollection, setSelectedCollection] = useState(selectedCollectionId || '')
  const [saveMode, setSaveMode] = useState<'new' | 'update'>(selectedRequestId ? 'update' : 'new')

  const handleSave = () => {
    if (saveMode === 'update' && selectedCollectionId && selectedRequestId) {
      updateRequestInCollection(selectedCollectionId, selectedRequestId, request)
    } else if (selectedCollection) {
      addRequestToCollection(selectedCollection, request)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Request"
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={saveMode === 'new' && !selectedCollection}
          >
            Save
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {selectedRequestId && (
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="saveMode"
                checked={saveMode === 'update'}
                onChange={() => setSaveMode('update')}
                className="text-app-accent"
              />
              <span className="text-sm">Update existing</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="saveMode"
                checked={saveMode === 'new'}
                onChange={() => setSaveMode('new')}
                className="text-app-accent"
              />
              <span className="text-sm">Save as new</span>
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm text-app-text-muted mb-1">Request Name</label>
          <input
            type="text"
            value={request.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Request"
            className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-app-text-muted mb-1">Description (optional)</label>
          <textarea
            value={request.description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this request..."
            rows={2}
            className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm resize-none"
          />
        </div>

        {saveMode === 'new' && (
          <div>
            <label className="block text-sm text-app-text-muted mb-1">Collection</label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2 bg-app-bg border border-app-border rounded text-sm"
            >
              <option value="">Select a collection...</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {collections.length === 0 && (
              <p className="text-xs text-app-text-muted mt-1">
                Create a collection first to save requests
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
