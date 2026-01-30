import { create } from 'zustand'
import type { ResponseData } from '../types'

interface ResponseState {
  response: ResponseData | null
  activeTab: 'body' | 'headers' | 'cookies'
  setResponse: (response: ResponseData | null) => void
  setActiveTab: (tab: 'body' | 'headers' | 'cookies') => void
  clearResponse: () => void
}

export const useResponseStore = create<ResponseState>((set) => ({
  response: null,
  activeTab: 'body',

  setResponse: (response) => set({ response }),

  setActiveTab: (activeTab) => set({ activeTab }),

  clearResponse: () => set({ response: null }),
}))
