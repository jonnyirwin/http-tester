import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import type { HistoryEntry, RequestConfig, HttpMethod } from '../types'

interface HistoryState {
  history: HistoryEntry[]
  isLoaded: boolean
  loadHistory: () => Promise<void>
  saveHistory: () => Promise<void>
  addToHistory: (request: RequestConfig, status?: number, duration?: number) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
}

const MAX_HISTORY_ENTRIES = 100

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isLoaded: false,

  loadHistory: async () => {
    const history = await window.api.getHistory()
    set({ history: history || [], isLoaded: true })
  },

  saveHistory: async () => {
    await window.api.saveHistory(get().history)
  },

  addToHistory: (request, status, duration = 0) => {
    const entry: HistoryEntry = {
      id: uuid(),
      method: request.method as HttpMethod,
      url: request.url,
      status,
      duration,
      timestamp: new Date().toISOString(),
      request: { ...request },
    }

    set((state) => ({
      history: [entry, ...state.history].slice(0, MAX_HISTORY_ENTRIES),
    }))
    get().saveHistory()
  },

  clearHistory: () => {
    set({ history: [] })
    get().saveHistory()
  },

  removeFromHistory: (id) => {
    set((state) => ({
      history: state.history.filter((h) => h.id !== id),
    }))
    get().saveHistory()
  },
}))
