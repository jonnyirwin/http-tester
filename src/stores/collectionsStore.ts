import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { Collection, RequestConfig } from '../types'

interface CollectionsState {
  collections: Collection[]
  selectedCollectionId: string | null
  selectedRequestId: string | null
  isLoaded: boolean
  loadCollections: () => Promise<void>
  saveCollections: () => Promise<void>
  createCollection: (name: string, description?: string) => void
  updateCollection: (id: string, updates: Partial<Collection>) => void
  deleteCollection: (id: string) => void
  addRequestToCollection: (collectionId: string, request: RequestConfig) => void
  updateRequestInCollection: (collectionId: string, requestId: string, request: RequestConfig) => void
  removeRequestFromCollection: (collectionId: string, requestId: string) => void
  selectCollection: (id: string | null) => void
  selectRequest: (collectionId: string | null, requestId: string | null) => void
  exportCollection: (id: string) => Promise<{ success: boolean; path?: string }>
  importCollection: () => Promise<{ success: boolean; error?: string }>
}

export const useCollectionsStore = create<CollectionsState>((set, get) => ({
  collections: [],
  selectedCollectionId: null,
  selectedRequestId: null,
  isLoaded: false,

  loadCollections: async () => {
    const collections = await window.api.getCollections()
    set({ collections: collections || [], isLoaded: true })
  },

  saveCollections: async () => {
    await window.api.saveCollections(get().collections)
  },

  createCollection: (name, description = '') => {
    const newCollection: Collection = {
      id: uuid(),
      name,
      description,
      requests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ collections: [...state.collections, newCollection] }))
    get().saveCollections()
  },

  updateCollection: (id, updates) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }))
    get().saveCollections()
  },

  deleteCollection: (id) => {
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
      selectedCollectionId: state.selectedCollectionId === id ? null : state.selectedCollectionId,
    }))
    get().saveCollections()
  },

  addRequestToCollection: (collectionId, request) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              requests: [...c.requests, { ...request, id: uuid() }],
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }))
    get().saveCollections()
  },

  updateRequestInCollection: (collectionId, requestId, request) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              requests: c.requests.map((r) => (r.id === requestId ? request : r)),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    }))
    get().saveCollections()
  },

  removeRequestFromCollection: (collectionId, requestId) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              requests: c.requests.filter((r) => r.id !== requestId),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
      selectedRequestId: state.selectedRequestId === requestId ? null : state.selectedRequestId,
    }))
    get().saveCollections()
  },

  selectCollection: (id) => set({ selectedCollectionId: id }),

  selectRequest: (collectionId, requestId) =>
    set({ selectedCollectionId: collectionId, selectedRequestId: requestId }),

  exportCollection: async (id) => {
    const collection = get().collections.find((c) => c.id === id)
    if (!collection) return { success: false }
    return window.api.exportCollection(collection)
  },

  importCollection: async () => {
    const result = await window.api.importCollection()
    if (result.success && result.data) {
      const importedCollection: Collection = {
        id: uuid(),
        name: result.data.name || 'Imported Collection',
        description: result.data.description || '',
        requests: (result.data.requests || []).map((r: RequestConfig) => ({ ...r, id: uuid() })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      set((state) => ({ collections: [...state.collections, importedCollection] }))
      get().saveCollections()
      return { success: true }
    }
    return { success: false, error: result.error }
  },
}))
